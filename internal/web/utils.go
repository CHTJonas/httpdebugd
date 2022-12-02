package web

import (
	"fmt"
	"io"
	"net"
	"net/http"
)

func getAddr(r *http.Request) string {
	addr, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		addr = r.RemoteAddr
	}
	return addr
}

func getPort(r *http.Request) string {
	_, port, _ := net.SplitHostPort(r.RemoteAddr)
	return port
}

func getHost(r *http.Request) string {
	host, _, err := net.SplitHostPort(r.Host)
	if err != nil {
		host = r.Host
	}
	return host
}

func printTracePairs(w io.Writer, key string, value any) {
	fmt.Fprint(w, key)
	fmt.Fprint(w, "=")
	fmt.Fprintln(w, value)
}
