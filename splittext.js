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

	String.prototype.replaceAll = function(search, replacement) {
	    var target = this;
	    return target.split(search).join(replacement);
	};

	var identifier = identifier || [];
	var defaults = {
		type: "chars,words,lines",
		charsClass: undefined,
		linesClass: undefined,
		wordsClass: undefined,
		position: "relative"
	};


	this.HTMLobjects=[];
	this.vars = {};
	this.originalHTML = [];

	this.lines = [];
	this.words = [];
	this.chars = [];

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
		if (window.jQuery && identifier[i] && (identifier[i] instanceof jQuery || identifier[i].constructor.prototype.jquery)) {
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
				this.vars.type = use.join(",");
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
		var allowedPositions = ["absolute","relative","static","fixed","inherit","initial",null];
		this.vars.position = (vars.position && allowedPositions.indexOf(vars.position)!=-1)?vars.position:defaults.position;
	}else{
		this.vars = duplicateObject(defaults);
	}

	//Store the original state so we can revert easily
	for(var i = 0;i<this.HTMLobjects.length;i++){
		this.originalHTML[i]=this.HTMLobjects[i].innerHTML;
	}

	//add the revert function
	this.revert = function(){
		for(var i = 0;i<this.HTMLobjects.length;i++){
			this.HTMLobjects[i].innerHTML=this.originalHTML[i];
		}
	}


	//
	//By now we should have an array at this.HTMLobjects of html objects that need spliting.
	//	

	//regex match spaces and non space characters
	//can't use this for 
	var regex = {
		wordbreak: / /gm,
		charbreak: /[^\s]/gm
	}

	this.vars.type = this.vars.type.split(",");

	for(var i = 0;i<this.HTMLobjects.length;i++){
			
		var current = this.HTMLobjects[i];

		//remove tags from element
		//ideally, this won't be needed in the future
		current.innerHTML = current.innerHTML.replace(/<\/?[^>]+(>|$)/g, "");

		var currentLists = {
			lines:[],
			words:[],
			chars:[]
		};

		//Split Lines
		if(this.vars.type.indexOf("lines")!=-1){
			var startTag = "<div style='position:" + this.vars.position + "; display:block;' " + ((this.vars.linesClass!==undefined && this.vars.linesClass!="undefined")?"class='"+this.vars.linesClass+"' ":"") + ">";
			var endTag = "</div>";
			var text = current.innerHTML;
			var words = text.split(' ');
			var splitPoints = [];
			current.innerHTML = words[0];
			var height = current.offsetHeight;

			//work out where the splits are
			for(var j = 1; j < words.length; j++){
			    current.innerHTML = current.innerHTML + ' ' + words[j];
			    if(current.offsetHeight > height){
			        height = current.offsetHeight;
			        splitPoints.push(current.innerHTML.length - (words[j].length+1));
			    }
			}
			//add the last line
			splitPoints.push(current.innerHTML.length);

			//add the text to the element, adding in the tags

			current.innerHTML = "";


			for(var j = 0; j < splitPoints.length; j++){
			   	var lineStart = (j==0)?0:splitPoints[j-1]+1;
			   	var lineEnd = (j==splitPoints.length-1)?text.length-1:splitPoints[j];


			   	var div = document.createElement("div");
			   	div.style.position = this.vars.position;
			   	div.style.display = "block";
			   	if(this.vars.linesClass!==undefined && this.vars.linesClass!="undefined"){
			   		this.class = this.vars.linesClass.replace("++",j+1);
			   	}
			   	div.innerHTML = text.substring(lineStart,lineEnd)

			   	current.appendChild(div);

			   	currentLists.lines.push(div);

			}
		}






		//split the words
		if(this.vars.type.indexOf("words")!=-1){
			function splitWords(parent,st){
				var startTag = "<div style='position:" + st.vars.position + "; display:inline-block;' " + ((st.vars.wordsClass!==undefined && st.vars.wordsClass!="undefined")?"class='"+this.vars.wordsClass+"' ":"") + ">";
				var endTag = "</div>";
				parent.innerHTML = startTag + parent.innerHTML.replaceAll(" ",(endTag+ " " +startTag)) + endTag;

				var nodes = parent.querySelectorAll("div");

				for(var j = 0; j<nodes.length;j++){
					currentLists.words.push(nodes[j]);
				}
			}

			//if it has been split by lines, split each line by words
			if(this.vars.type.indexOf("lines")!=-1){
				for(var j = 0; j<currentLists.lines.length;j++){
					splitWords(currentLists.lines[j], this);
				}
			} else {
				splitWords(current, this);
			}


		}



		//split the characters
		if(this.vars.type.indexOf("chars")!=-1){
			function splitChars(parent,st){
				var startTag = "<div style='position:" + st.vars.position + "; display:inline-block;' " + ((st.vars.charsClass!==undefined && st.vars.charsClass!="undefined")?"class='"+this.vars.charsClass+"' ":"") + ">";
				var endTag = "</div>";
				parent.innerHTML = startTag + parent.innerHTML.split("").join(endTag+startTag) + endTag;

				var nodes = parent.querySelectorAll("div");

				for(var j = 0; j<nodes.length;j++){
					currentLists.chars.push(nodes[j]);
				}
			}

			//if it has been split by words, split each word by characters
			//if it has only be split by lines, split each line by characters
			if(this.vars.type.indexOf("words")!=-1){
				for(var j = 0; j<currentLists.words.length;j++){
					splitChars(currentLists.words[j], this);
				}
			} else if(this.vars.type.indexOf("lines")!=-1){
				for(var j = 0; j<currentLists.lines.length;j++){
					splitChars(currentLists.lines[j], this);
				}
			} else {
				splitChars(current, this);
			}


		}


		this.lines = this.lines.concat(currentLists.lines);
		this.words = this.words.concat(currentLists.words);
		this.chars = this.chars.concat(currentLists.chars);

	}
}