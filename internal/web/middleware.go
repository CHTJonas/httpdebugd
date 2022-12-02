package web

import (
	"fmt"
	"log"
	"net"
	"net/http"
)

type loggingResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (lrw *loggingResponseWriter) WriteHeader(code int) {
	lrw.statusCode = code
	lrw.ResponseWriter.WriteHeader(code)
}

func (serv *Server) loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		lrw := &loggingResponseWriter{w, http.StatusOK}
		next.ServeHTTP(lrw, r)
		addr := getAddr(r)
		hostInfo := fmt.Sprintf("\"%s\"", r.Host)
		httpInfo := fmt.Sprintf("\"%s %s %s\"", r.Method, r.URL.Path, r.Proto)
		refererInfo := fmt.Sprintf("\"%s\"", r.Referer())
		if refererInfo == "\"\"" {
			refererInfo = "\"-\""
		}
		uaInfo := fmt.Sprintf("\"%s\"", r.UserAgent())
		if uaInfo == "\"\"" {
			uaInfo = "\"-\""
		}
		log.Println(addr, hostInfo, httpInfo, lrw.statusCode, refererInfo, uaInfo)
	})
}

func (serv *Server) rateLimitingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		serv.rl.Take()
		next.ServeHTTP(w, r)
	})
}

func serverHeaderMiddleware(pwrBy string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("X-Powered-By", pwrBy)
			w.Header().Set("X-Robots-Tag", "noindex, nofollow")
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Cache-Control", "no-store")
			next.ServeHTTP(w, r)
		})
	}
}

func proxyMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if port := r.Header.Get("X-Real-Port"); port != "" {
			addr, _, _ := net.SplitHostPort(r.RemoteAddr)
			r.RemoteAddr = fmt.Sprintf("[%s]:%s", addr, port)
		}
		if addr := r.Header.Get("X-Forwarded-For"); addr != "" {
			_, port, _ := net.SplitHostPort(r.RemoteAddr)
			r.RemoteAddr = fmt.Sprintf("[%s]:%s", addr, port)
		}
		if proto := r.Header.Get("X-Forwarded-Server-Proto"); proto != "" {
			r.Proto = proto
		}
		if scheme := r.Header.Get("X-Forwarded-Proto"); scheme != "" {
			r.URL.Scheme = scheme
		}
		if host := r.Header.Get("X-Forwarded-Host"); host != "" {
			r.Host = host
		}
		next.ServeHTTP(w, r)
	})
}
