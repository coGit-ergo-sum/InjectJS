	function span_onclick(spn){
		var div = spn.closest('#divInject');
		div.style.visibility = "hidden";
	}
		
	function appendLink(href){
		var selector = `head link[href="${href}"]`;			
		var link = document.querySelector(selector);
		
		if(!link){
			link = document.createElement("link");
			link.setAttribute("rel", "stylesheet");
			link.setAttribute("href", href);
			document.getElementsByTagName("head")[0].appendChild(link);				
		}
	}
		
	function appendScript(src, load_complete){
		var selector = `head script[src="${src}"]`;			
		var script = document.querySelector(selector);
		
		if(!script){
			script = document.createElement("script");
			script.setAttribute("src", src);
			
			script.onload = load_complete;
			
			document.getElementsByTagName("head")[0].appendChild(script);				
		}
	}
	
	function appendDivInjection(){
		var selector = `#divInject`;			
		var divInject = document.querySelector(selector);
		if(!divInject){
			
			var HTML = `
				<div id="divInject" style="position:fixed!important;z-index:9999!important;">
					<div class="header">Inject js<span onclick="span_onclick(this)">x</span></div>
					<div class="body">
						<ul id="ulTree" class='container' style="width:calc(100% - 20px)!important;box-sizing:content-box!important;border:none!important;overflow:hidden!important;">
						
						</ul>
					</div>
				</div>
			`
			document.querySelector("body").insertAdjacentHTML('afterbegin', HTML);
			
		}
		
	}

	
	
try{
	appendLink('https://www.metita.net/inject/inject.css');	
	
	appendDivInjection();
	
	appendLink('https://www.metita.net/inject/browse/style.css');	
	
	appendScript('https://www.metita.net/inject/browse/ulToTree.js', (event)=> {
		button_onclick();
	});
	
}
catch(jse){
	alert(jse.message);
}

function button_onclick(){
	// The semicolon before the IIFE prevents any missing previous semicolon
	// https://stackoverflow.com/questions/42036349/uncaught-typeerror-intermediate-value-is-not-a-function
    ;(function () {	
		
		var addChild = function (ulTree, itemName, item){
		
			function getOptions(item, onexpand, open, close){
			
				close = (close) ? close : open;
				var options = {};
				
				options.title = typeof item;
				options.onclick = li_onclick;
				if(onexpand){ options.onexpand = onexpand; }
				if(open || close){ options.icons = {}; }
				if(open){ options.icons.open = open; }
				if(close){ options.icons.close = close; }
				
				return options;
			}

			var options;
			if((typeof item) == (typeof '')){
				options = getOptions(item, undefined, 'string');
			}
			else if((typeof item) == (typeof 0)){			
				options = getOptions(item, undefined, 'number');
			}
			else if((typeof item) == (typeof true)){			
				options = getOptions(item, undefined, 'yinyang');
			}			
			else if(!item){			
				options = getOptions(item, undefined, 'question');
			}
			else if((typeof item) == (typeof addChild)){
				//var names = Object.getOwnPropertyNames(item);
				var names = Object.keys(item);
				var options = (names.length > 0) ? 
					getOptions(item, tree_onexpand, 'function'):
					getOptions(item, undefined    , 'function');				
			}
			else if((typeof item) == (typeof {})){				
				var noChildren = (item == null) || (Object.keys(item) == null) || (Object.keys(item).length == 0);				
				onexpand = noChildren ? null : tree_onexpand;
				options = getOptions(item, onexpand, 'boxOpen', 'boxClose');
			}
			else{
				options = getOptions(item, undefined, 'open', 'clode');
			}
			
			ulTree.addChild(itemName, options); 

		};
		
		var li_onclick = function(text, li){
			alert(text);
		}
		
		var tree_onexpand2 = function(ulTree){
			try{
				let fullPath = ulTree.getFullPath().reverse();
				
				let object = window;
				for(attribute of fullPath){
					object = object[attribute];
				}
				
				var isString = (typeof object) == (typeof '');
				var isNumber = (typeof object) == (typeof 0)
				
				if(!isString && !isNumber){
					//var keys = Object.getOwnPropertyNames(object);
					var keys = Object.keys(object);
					
					for (let key of keys) {	
						addChild(ulTree, key, object[key]);				
					}
				}
			}
			catch(jse){
				ulTree.addError('Error', jse);
			}			
		};		
		
		var tree_onexpand = function(ulTree){
			window.setTimeout(() => { tree_onexpand2(ulTree); }, 430)
		}
		
        // The list of properties belonging to the (native) 'window' object;
        var contentNames = ( function() { 
        
            // create an iframe and append to body to load a clean window object
            let iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        
            // 'contentWindow' is the, clean, instance of 'window' object
			// and 'names' is the list of all the names of the proprties.
            let names = Object.getOwnPropertyNames(iframe.contentWindow);
        
            // the iFrame must be removed before leave this IIFE
            document.body.removeChild(iframe);
        
            return names;
        
        })();
		
		// the container for the 'tree'
		var ul = document.getElementById('ulTree');
		
		// 'ulToTree' it's a kind of 'extention' for the 'ul' element.
		// 'ulTree' it's always a 'ul' element plus some new funtionalities. 
		var ulTree = new ulToTree(ul);
		
        // This is the list of properties belonging to this instance of the 
        // 'window'  object: native properties + custom properties
        var names = Object.getOwnPropertyNames(window);
		
        // custom properties are the 'names' not listed in 'contentNames'
		// in 
        var customNames = names.filter(name => (contentNames.indexOf(name) < 0));
        for(let customName of customNames){
			addChild(ulTree, customName, window[customName]);
        }
		
    }());
 
}

	