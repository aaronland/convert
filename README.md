# convert

![](docs/images/convert-example.png)

Convert is a simple web application for converting measurements which is designed to work offline (using ServiceWorkers).

## Motivation

I wanted a simple web application for converting measurements which is designed to work offline (using ServiceWorkers) so this is that tool. It converts units from one measurement to another and nothing else.

Under the hood it uses a WebAssembly (WASM) binary which wraps the [bcicen/go-units](https://github.com/bcicen/go-units) Go package. This is _not_ the most efficient way to do things.

In addition to want a simple offline application I also wanted to continue investigating the use of WASM binaries for providing functionality in (offline) web applications. Go produces large binaries, certainly compared to the size of equivalent functionality written in JavaScript. For example, the `convert.wasm` binary used by this application is 4MB. I can live with that, at least for now.

## Offline mode

This _should_ work in offline mode. It _seems_ to work for me but ServiceWorkers and offline-anything in browsers is fussy and brittle so if you tell me it doesn't work for you I won't be overly surpised.

## Units

The `bcicen/go-units` package, and by extension this application, is missing conversions for standard US/North American cooking units like cups, teaspoons and tablespoons. I'm working on it.

## See also

* https://github.com/bcicen/go-units
* https://github.com/sfomuseum/js-sfomuseum-golang-wasm