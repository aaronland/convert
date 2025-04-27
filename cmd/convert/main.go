package main

import (
	"log/slog"
	"syscall/js"

	"github.com/aaronland/convert"
)

func main() {

	units_func := convert.UnitsMapFunc()
	defer units_func.Release()

	convert_func := convert.ConvertUnitsFunc()
	defer convert_func.Release()

	js.Global().Set("convert_units_map", units_func)
	js.Global().Set("convert_units", convert_func)

	c := make(chan struct{}, 0)

	slog.Info("WASM convert functions initialized")
	<-c

}
