package convert

import (
	_ "log/slog"
	
	"github.com/bcicen/go-units"
)

var (

	FluidCup = units.NewUnit("cup", "flc", units.Volume, units.US)
	FluidCupGB = units.NewUnit("cup UK", "flcgb", units.Volume, units.BI)
	
	FluidCup = units.NewUnit("fluid cup", "usc", units.Volume, units.US)
	FluidCupGB = units.NewUnit("fluid cup UK", "gbc", units.Volume, units.BI)

	Teaspoon   = units.NewUnit("teaspoon", "tsp", units.Volume, units.US)
	Tablespoon = units.NewUnit("tablespoon", "Tbsp", units.Volume, units.US)

	FluidTeaspoon   = units.NewUnit("fluid teaspoon", "tsp", units.Volume, units.US)
	FluidTablespoon = units.NewUnit("fluid tablespoon", "Tbsp", units.Volume, units.US)
)

func init() {
	
	units.NewRatioConversion(Tablespoon, Teaspoon, 3)
	units.NewRatioConversion(FluidTablespoon, FluidTeaspoon, 3)	

	units.NewRatioConversion(FluidTablespoon, FluidCup, 16)
	units.NewRatioConversion(FluidCup, units.Liter, 4.3272)
	
	/*
	units.NewRatioConversion(Tablespoon, LiterLiquid, 67.6280)

	units.NewRatioConversion(USCup, USPint, 2)

	units.NewRatioConversion(GBCup, LiterLiquid, 5)

	units.NewRatioConversion(JPCup, LiterLiquid, 5)

	units.NewRatioConversion(USFluidOunce, LiterLiquid, 33.814)

	units.NewRatioConversion(GBFluidOunce, LiterLiquid, 35.1950797279)

	units.NewRatioConversion(GBPint, LiterLiquid, 0.5)
	units.NewRatioConversion(USPint, LiterLiquid, 2.1186)
	*/
}
