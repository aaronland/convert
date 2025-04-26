GOROOT=$(shell go env GOROOT)
GOMOD=$(shell test -f "go.work" && echo "readonly" || echo "vendor")

wasm:
	@make wasmjs
	@make wasmgo

wasmjs:
	GOOS=js GOARCH=wasm \
		go build -mod $(GOMOD) -ldflags="-s -w" \
		-o www/wasm/convert.wasm \
		cmd/convert/main.go

wasmgo:
	curl -s -o www/javascript/sfomuseum.golang.wasm.bundle.js \
		https://raw.githubusercontent.com/sfomuseum/js-sfomuseum-golang-wasm/refs/heads/main/dist/sfomuseum.golang.wasm.bundle.js
