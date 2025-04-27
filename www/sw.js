const cache_name = 'convert-v0.0.1';

const app_files = [
    // HTML
    "./index.html",
    
    // CSS
    "./css/bootstrap.min.css",
    "./css/convert.css",
    
    // Javascript dependencies
    
    "./javascript/sfomuseum.golang.wasm.bundle.js",
    
    // Javascript application

    "./javascript/convert.js",    
    "./javascript/convert.offline.js",

    // WASM

    "./wasm/convert.wasm",
    
    // Javascript service workers
    "./sw.js"    
];

self.addEventListener("install", (e) => {

    console.log("SW installed", cache_name);

    e.waitUntil((async () => {
	const cache = await caches.open(cache_name);
	// console.log('[Service Worker] Caching all: app shell and content');
	await cache.addAll(app_files);
    })());
});

addEventListener("activate", (event) => {
    console.log("SW activate", cache_name);
});

addEventListener("message", (event) => {
    // event is a MessageEvent object
    console.log(`The service worker sent me a message: ${event.data}`);
  });


self.addEventListener('fetch', (e) => {

    // https://developer.mozilla.org/en-US/docs/Web/API/Cache
    
    e.respondWith((async () => {

	console.debug("fetch", cache_name, e.request.url);
	
	const cache = await caches.open(cache_name);
	const r = await cache.match(e.request);
	
	console.debug(`[Service Worker] Fetching resource: ${e.request.url}`);
	
	if (r) {
	    console.debug("return cache", e.request.url);
	    return r;
	}
	
	const response = await fetch(e.request);
	
	console.debug(`[Service Worker] Caching new resource: ${e.request.url}`);
	cache.put(e.request, response.clone());
	
	return response;
    })());
    
});
