window.addEventListener("load", function load(event){

    var units_map;

    var feedback_el = document.getElementById("feedback");        
    var result_el = document.getElementById("result");    
    var value_el = document.getElementById("value");
    var quantity_el = document.getElementById("quantity");
    var from_el = document.getElementById("from");
    var to_el = document.getElementById("to");

    const offline = document.body.hasAttribute("offline");

    if (offline){

	convert.offline.init().then((rsp) => {

	    console.debug("Offline service workers registered.");
	    
	    var purge_el = document.createElement("span");
	    purge_el.setAttribute("id", "purge");
	    purge_el.appendChild(document.createTextNode("purge offline cache"));
	    
	    purge_el.onclick = function(){
		
		convert.offline.purge_with_confirmation().then((rsp) => {
		    feedback_el.innerText = "Offline cache has been removed.";
		}).catch((err) => {
		    feedback_el.innerText = "Failed to purge offline cache, " + err;
		});
		
		return false;
	    };
	    
	    var footer = document.getElementById("footer");	
	    footer.appendChild(purge_el);
	    
	}).catch((err) => {
	    feedback_el.innerText = "Failed to initialize offline mode, " + err;
	});
	
    }
    
    const wasm_uri = location.pathname + "wasm/convert.wasm";
    
    sfomuseum.golang.wasm.fetch(wasm_uri).then(rsp => {

	convert_units_map().then((rsp) => {

	    units_map = JSON.parse(rsp);
	    
	    for (var k in units_map){
		var item = document.createElement("option");
		item.setAttribute("value", k);
		item.appendChild(document.createTextNode(k));

		quantity_el.appendChild(item);
	    }
	   
	    quantity_el.onchange = function(e){

		feedback_el.innerHTML = "";
		result_el.innerHTML = "";
		
		from_el.innerHTML = "";
		to_el.innerHTML = "";

		const q = quantity_el.value;

		if (! q){
		    return;
		}

		const units = units_map[q];

		if (! units){
		    return;
		}

		var count = units.length;

		const from_opt = document.createElement("option");
		from_opt.setAttribute("value", "")

		const to_opt = document.createElement("option");
		to_opt.setAttribute("value", "")
		
		from_el.appendChild(from_opt);
		to_el.appendChild(to_opt);
		
		for (var i=0; i < count; i++){

		    var from_item = document.createElement("option");
		    from_item.setAttribute("value", units[i].Name);
		    from_item.appendChild(document.createTextNode(units[i].Name));
		    from_el.appendChild(from_item);

		    var to_item = document.createElement("option");
		    to_item.setAttribute("value", units[i].Name);
		    to_item.appendChild(document.createTextNode(units[i].Name));
		    to_el.appendChild(to_item);		    
		}

		var onchange_func = function(e){

		    feedback_el.innerHTML = "";		    
		    result_el.innerHTML = "";
		    
		    const v = value_el.value;
		    const from_v = from_el.value;
		    const to_v = to_el.value;

		    if (! v){
			return false;
		    }
		    
		    if ((! from_v) || (! to_v)){
			return false;
		    }

		    if (from_v == to_v){
			return false;
		    }

		    console.log("Convert", v, from_v, to_v);
		    
		    convert_units(v, from_v, to_v).then((rsp) => {
			const new_v = JSON.parse(rsp);
			result_el.innerText = new_v.toFixed(2);
		    }).catch((err) => {
			feedback_el.innerText = "Failed to convert units, " + err;
			console.error("Failed to convert units", err);
		    });
		    
		    return false;
		};
		
		from_el.onchange = onchange_func;
		to_el.onchange = onchange_func;		
	    };

	}).catch((err) => {
	    throw err
	})
	    
    }).catch((err) => {
	feedback_el.innerText = "Failed to load convert functions, " + err;
	console.error("Failed to retrieve convert func", err);
    });

});

