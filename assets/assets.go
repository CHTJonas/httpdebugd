package assets

import (
	"embed"
	"net/http"
)

//go:embed *
var content embed.FS
var HandlerFunc http.HandlerFunc

func ReadFile(name string) ([]byte, error) {
	return content.ReadFile(name)
}

func init() {
	fs := http.FS(content)
	srv := http.FileServer(fs)
	HandlerFunc = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		srv.ServeHTTP(w, r)
	})
}
