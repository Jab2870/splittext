function SplitText(identifier, vars){

	function duplicateObject(obj){
		if(typeof obj == "object" && obj !== null){
			var ret = {};
			for(var index in obj){
				ret[index] = duplicateObject(obj[index]);
			}
			return ret;
		} else {
			return obj;
		}
	}

	var identifier = identifier || [];
	var defaults = {
		type: "chars,words,lines",
		charsClass: undefined,
		linesClass: undefined,
		wordsClass: undefined,
		position: "relative"
	};


	this.HTMLobjects=[];
	this.vars;

	//if the identifier isn't an array, make it one.  If it already is, don't worry.  :)
	if(!Array.isArray(identifier)){
		identifier = [identifier];
	}

	//itterate through the array
	for(var i = 0;i<identifier.length;i++){
		
		
		//if it is an html element, simply add it
		if(identifier[i].nodeType==1){
			this.HTMLobjects.push(identifier[i]);
		}

		//if jquery Element add each html Element
		if (identifier[i] && (identifier[i] instanceof jQuery || identifier[i].constructor.prototype.jquery)) {
			//itterate through array of html elements inside jquery object
			for(var j = 0; j<identifier[i].length;j++){
				//Check that it is an html element before appending it
				if(identifier[i][j].nodeType==1){
					this.HTMLobjects.push(identifier[i][j]);
				}
			}
		}

		//if it's a string, try query selector all
		if(typeof identifier[i] == "string"){
			elements = document.querySelectorAll(identifier[i]);
			for(var j = 0; j<elements.length;j++){
				if(elements[j].nodeType==1){
					this.HTMLobjects.push(elements[j]);
				}
			}
		}

	}

	//if there is an object of variables replace defaults otherwise use defaults
	if(vars && typeof vars == "object" && vars !== null){

		//if type is passed and it's a string, try and validate otherwise use default
		if(vars.type && typeof vars.type == "string"){
			vars.type = vars.type.split(",");
			var possible = ["chars","words","lines"];
			var use = [];
			for(var i = 0;i<vars.type.length;i++){
				if(possible.indexOf(vars.type[i].toLowerCase())!=-1 && use.indexOf(vars.type[i].toLowerCase())==-1){
					use.push(vars.type[i].toLowerCase());
				} else {
					console.error(vars.type[i] + "is not a valid type");
				}
			}

			if(use.length==0){
				this.vars.type = defaults.type;
			} else {
				this.vars.type = ",".join(use);
			}


		} else {
			this.vars.type = defaults.type;
		}


		//if charsClass is set then use it
		this.vars.charsClass = (vars.charsClass && typeof vars.charsClass == "string")?vars.charsClass:defaults.charsClass;

		//if wordsClass is set then use it
		this.vars.wordsClass = (vars.wordsClass && typeof vars.wordsClass == "string")?vars.wordsClass:defaults.wordsClass;

		//if linesClass is set then use it
		this.vars.linesClass = (vars.linesClass && typeof vars.linesClass == "string")?vars.linesClass:defaults.linesClass;

		//greensock's splittext doesn't allow static or null.  null will not set position and leave it to any css on the page
		var allowedPositions = ["absolute","relative","static",null];
		this.vars.position = (vars.position && allowedPositions.indexOf(vars.position)!=-1)?vars.position:defaults.position;

	}else{
		this.vars = duplicateObject(defaults);
	}


	//
	//By now we should have an array at this.HTMLobjects of html objects that need spliting.
	//	
}