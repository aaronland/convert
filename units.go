package convert

import (
	_ "log/slog"

	"github.com/bcicen/go-units"
)

var (
	Teaspoon   = units.NewUnit("teaspoon", "tsp", units.Mass, units.US)
	Tablespoon = units.NewUnit("tablespoon", "Tbsp", units.Mass, units.US)
	Cup        = units.NewUnit("cup", "c", units.Mass, units.US)

	FluidTeaspoon   = units.NewUnit("fluid teaspoon", "tsp", units.Volume, units.US)
	FluidTablespoon = units.NewUnit("fluid tablespoon", "Tbsp", units.Volume, units.US)
	FluidCup        = units.NewUnit("fluid cup", "c", units.Volume, units.US)
)

func init() {

	units.NewRatioConversion(Tablespoon, Teaspoon, 3)
	units.NewRatioConversion(FluidTablespoon, FluidTeaspoon, 3)

	units.NewRatioConversion(units.KiloGram, Tablespoon, 67.63)
	units.NewRatioConversion(units.KiloGram, Cup, 8)

	units.NewRatioConversion(units.Liter, FluidTablespoon, 66.66)
	units.NewRatioConversion(units.Liter, FluidCup, 4.22)

}
