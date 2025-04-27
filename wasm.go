package convert

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"strconv"
	"syscall/js"

	"github.com/bcicen/go-units"
)

func UnitsMapFunc() js.Func {

	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {

		handler := js.FuncOf(func(this js.Value, args []js.Value) interface{} {

			resolve := args[0]
			reject := args[1]

			units_map := make(map[string]units.UnitList)

			for _, u := range units.All() {

				q := u.Quantity

				l, ok := units_map[q]

				if !ok {
					l = make([]units.Unit, 0)
				}

				l = append(l, u)
				units_map[q] = l
			}

			enc, err := json.Marshal(units_map)

			if err != nil {
				slog.Error("Failed to marshal units map", "error", err)
				reject.Invoke(fmt.Printf("Failed to marshal units map, %w", err))
				return nil
			}

			resolve.Invoke(string(enc))
			return nil

		})

		promiseConstructor := js.Global().Get("Promise")
		return promiseConstructor.New(handler)
	})
}

func ConvertUnitsFunc() js.Func {

	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {

		str_v := args[0].String()
		from := args[1].String()
		to := args[2].String()

		handler := js.FuncOf(func(this js.Value, args []js.Value) interface{} {

			resolve := args[0]
			reject := args[1]

			v, err := strconv.ParseFloat(str_v, 64)

			if err != nil {
				slog.Error("Failed to parse value", "value", str_v, "error", err)
				reject.Invoke(fmt.Sprintf("Failed to parse value, %w", err))
				return nil
			}

			from_u, err := units.Find(from)

			if err != nil {
				slog.Error("Failed to find unit", "from", from)
				reject.Invoke(fmt.Sprintf("Failed to derive from unit"))
				return nil
			}

			to_u, err := units.Find(to)

			if err != nil {
				slog.Error("Failed to find unit", "to", to)
				reject.Invoke(fmt.Sprintf("Failed to derive to unit"))
				return nil
			}

			val := units.NewValue(v, from_u)
			new_v, err := val.Convert(to_u)

			if err != nil {
				slog.Error("Failed to convert units", "error", err)
				reject.Invoke(fmt.Sprintf("Failed to convert units, %w", err))
				return nil
			}

			enc, err := json.Marshal(new_v.Float())

			if err != nil {
				slog.Error("Failed to marshal new value", "error", err)
				reject.Invoke(fmt.Sprintf("Failed to marshal new value, %w", err))
				return nil
			}

			resolve.Invoke(string(enc))
			return nil
		})

		promiseConstructor := js.Global().Get("Promise")
		return promiseConstructor.New(handler)
	})
}
