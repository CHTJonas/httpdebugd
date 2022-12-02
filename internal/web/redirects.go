package web

import (
	"net/http"
)

var permRedirects = map[string]string{
	"/plain":        "/ipaddr",
	"/plain.cgi":    "/ipaddr",
	"/ip":           "/ipaddr",
	"/ip.cgi":       "/ipaddr",
	"/hostname.cgi": "/hostname",
	"/ptr.cgi":      "/ptr",
	"/iprev.cgi":    "/iprev",
	"/mtr.cgi":      "/mtr",
	"/trace.cgi":    "/trace",
}

func redirect(target string) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, target, http.StatusMovedPermanently)
	}
}
