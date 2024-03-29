package web

import (
	"context"
	"fmt"
	"net/http"
	"os/exec"
	"runtime"
	"strings"
	"time"

	"github.com/CHTJonas/httpdebugd/assets"
	"github.com/gorilla/mux"
	"go.uber.org/ratelimit"
)

type Server struct {
	r   *mux.Router
	srv *http.Server
	rl  ratelimit.Limiter
}

func NewServer(version string) *Server {
	pwrBy := fmt.Sprintf("httpdebugd/%s Go/%s (+https://github.com/CHTJonas/httpdebugd)",
		version, strings.TrimPrefix(runtime.Version(), "go"))
	s := &Server{
		rl: ratelimit.New(5),
	}
	r := mux.NewRouter().StrictSlash(true)

	r.HandleFunc("/ipaddr", s.ipaddr)
	r.HandleFunc("/hostname", s.hostname)
	r.HandleFunc("/ptr", s.ptr)
	r.HandleFunc("/iprev", s.iprev)
	r.HandleFunc("/ping", s.ping)
	r.HandleFunc("/mtr", s.mtr)
	r.HandleFunc("/whois", s.whois)
	r.HandleFunc("/trace", s.trace)

	for path, target := range permRedirects {
		r.HandleFunc(path, redirect(target))
	}

	r.PathPrefix("/").Handler(assets.HandlerFunc)
	r.Use(s.loggingMiddleware)
	r.Use(serverHeaderMiddleware(pwrBy))
	r.Use(proxyMiddleware)
	r.Use(s.rateLimitingMiddleware)
	s.r = r
	return s
}

func (serv *Server) Start(addr string) error {
	serv.srv = &http.Server{
		Addr:         addr,
		Handler:      serv.r,
		WriteTimeout: time.Second * 120,
		ReadTimeout:  time.Second * 120,
		IdleTimeout:  time.Second * 180,
	}
	return serv.srv.ListenAndServe()
}

func (serv *Server) Stop(ctx context.Context) error {
	serv.srv.SetKeepAlivesEnabled(false)
	return serv.srv.Shutdown(ctx)
}

func (serv *Server) ipaddr(w http.ResponseWriter, r *http.Request) {
	ip := getAddr(r)
	fmt.Fprintln(w, ip)
}

func (serv *Server) hostname(w http.ResponseWriter, r *http.Request) {
	ip := getAddr(r)
	cmd := exec.Command("dig", "+short", "-x", ip)
	stdout, err := cmd.Output()
	if err != nil {
		code := http.StatusInternalServerError
		text := http.StatusText(code)
		http.Error(w, text, code)
		return
	}
	str := string(stdout)
	str = strings.TrimSpace(str)
	str = strings.TrimSuffix(str, ".")
	fmt.Fprintln(w, str)
}

func (serv *Server) ptr(w http.ResponseWriter, r *http.Request) {
	ip := getAddr(r)
	cmd := exec.Command("host", ip)
	stdout, err := cmd.Output()
	if err != nil {
		// NXDOMAIN exits with code 1
		exitErr, isExitError := err.(*exec.ExitError)
		if !(isExitError && exitErr.ExitCode() == 1) {
			code := http.StatusInternalServerError
			text := http.StatusText(code)
			http.Error(w, text, code)
			return
		}
	}
	fmt.Fprint(w, string(stdout))
}

func (serv *Server) iprev(w http.ResponseWriter, r *http.Request) {
	ip := getAddr(r)
	cmd := exec.Command("dig", "+short", "-x", ip)
	hostname, err := cmd.Output()
	if err != nil {
		code := http.StatusInternalServerError
		text := http.StatusText(code)
		http.Error(w, text, code)
		return
	}
	if len(hostname) == 0 {
		fmt.Fprintln(w, "false")
		return
	}
	rrType := "A"
	if strings.ContainsAny(ip, ":") {
		rrType = "AAAA"
	}
	cmd = exec.Command("dig", "+short", strings.TrimSpace(string(hostname)), rrType)
	ipResolved, err := cmd.Output()
	if err != nil {
		code := http.StatusInternalServerError
		text := http.StatusText(code)
		http.Error(w, text, code)
		return
	}
	if strings.TrimSpace(string(ipResolved)) == ip {
		fmt.Fprintln(w, "true")
	} else {
		fmt.Fprintln(w, "false")
	}
}

func (serv *Server) ping(w http.ResponseWriter, r *http.Request) {
	ip := getAddr(r)
	cmd := exec.Command("ping", "-c", "30", ip)
	stdout, err := cmd.Output()
	if err != nil {
		// packet loss exits with code 1
		exitErr, isExitError := err.(*exec.ExitError)
		if !(isExitError && exitErr.ExitCode() == 1) {
			code := http.StatusInternalServerError
			text := http.StatusText(code)
			http.Error(w, text, code)
			return
		}
	}
	fmt.Fprint(w, string(stdout))
}

func (serv *Server) mtr(w http.ResponseWriter, r *http.Request) {
	ip := getAddr(r)
	cmd := exec.Command("mtr", "-c", "4", "-bez", "-w", ip)
	stdout, err := cmd.Output()
	if err != nil {
		code := http.StatusInternalServerError
		text := http.StatusText(code)
		http.Error(w, text, code)
		return
	}
	fmt.Fprint(w, string(stdout))
}

func (serv *Server) whois(w http.ResponseWriter, r *http.Request) {
	ip := getAddr(r)
	cmd := exec.Command("whois", ip)
	stdout, err := cmd.Output()
	if err != nil {
		code := http.StatusInternalServerError
		text := http.StatusText(code)
		http.Error(w, text, code)
		return
	}
	fmt.Fprint(w, string(stdout))
}

func (serv *Server) trace(w http.ResponseWriter, r *http.Request) {
	if reqId := r.Header.Get("X-Request-Id"); reqId != "" {
		printTracePairs(w, "request_id", reqId)
	}
	printTracePairs(w, "time", time.Now().Unix())
	printTracePairs(w, "client_ip", getAddr(r))
	printTracePairs(w, "client_port", getPort(r))
	if alpn := r.Header.Get("X-Forwarded-ALPN"); alpn != "" {
		printTracePairs(w, "alpn", alpn)
	}
	if sni := r.Header.Get("X-Forwarded-SNI"); sni != "" {
		printTracePairs(w, "sni", sni)
	}
	printTracePairs(w, "host", getHost(r))
	printTracePairs(w, "https", r.URL.Scheme == "https")
	printTracePairs(w, "protocol", r.Proto)
	if sslProto := r.Header.Get("X-Forwarded-SSL-Proto"); sslProto != "" {
		printTracePairs(w, "ssl_protocol", sslProto)
	}
	if kex := r.Header.Get("X-Forwarded-KEX"); kex != "" {
		printTracePairs(w, "kex", kex)
	}
	if cipher := r.Header.Get("X-Forwarded-Cipher"); cipher != "" {
		printTracePairs(w, "cipher", cipher)
	}
	printTracePairs(w, "method", r.Method)
	printTracePairs(w, "path", r.URL.Path)
	printTracePairs(w, "user_agent", r.UserAgent())
}
