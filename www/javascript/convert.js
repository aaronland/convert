window.addEventListener("load", function load(event){

    var units_map;

    var feedback_el = document.getElementById("feedback");        
    var result_el = document.getElementById("result");    
    var value_el = document.getElementById("value");
    var quantity_el = document.getElementById("quantity");
    var from_el = document.getElementById("from");
    var to_el = document.getElementById("to");            
    var submit_el = document.getElementById("submit");
    
    sfomuseum.golang.wasm.fetch("/wasm/convert.wasm").then(rsp => {

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
		    submit_el.setAttribute("disabled", "disabled");
		    return;
		}

		const units = units_map[q];

		if (! units){
		    submit_el.setAttribute("disabled", "disabled");
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
		    from_item.setAttribute("value", units[i].Symbol);
		    from_item.appendChild(document.createTextNode(units[i].Name));
		    from_el.appendChild(from_item);

		    var to_item = document.createElement("option");
		    to_item.setAttribute("value", units[i].Symbol);
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
			feedback_el.innerText = "Missing value.";
			submit_el.setAttribute("disabled", "disabled");		    			
			return false;
		    }
		    
		    if ((! from_v) || (! to_v)){
			feedback_el.innerText = "One or more missing units.";			
			submit_el.setAttribute("disabled", "disabled");		    			
			return false;
		    }

		    if (from_v == to_v){
			feedback_el.innerText = "Units are the same.";						
			submit_el.setAttribute("disabled", "disabled");		    			
			return false;
		    }
		    
		    submit_el.removeAttribute("disabled");
		    return false;
		};
		
		from_el.onchange = onchange_func;
		to_el.onchange = onchange_func;		
	    };

	    submit_el.onclick = function(e){

		feedback_el.innerHTML = "";
		result_el.innerHTML = "";		
		
		const v = value_el.value;
		const from_v = from_el.value;
		const to_v = to_el.value;

		if (! v){
		    feedback_el.innerText = "Missing value.";
		    submit_el.setAttribute("disabled", "disabled");		    			
		    return false;
		}
		
		if ((! from_v) || (! to_v)){
		    feedback_el.innerText = "One or more missing units.";
		    submit_el.setAttribute("disabled", "disabled");		    			
		    return false;
		}
		
		if (from_v == to_v){
		    feedback_el.innerText = "Units are the same.";
		    submit_el.setAttribute("disabled", "disabled");		    			
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
	    
	}).catch((err) => {
	    throw err
	})
	    
    }).catch((err) => {
	feedback_el.innerText = "Failed to load convert functions, " + err;
	console.error("Failed to retrieve convert func", err);
    });

});

