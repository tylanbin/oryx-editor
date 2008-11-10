/** * Copyright (c) 2006 * Martin Czuchra, Nicolas Peters, Daniel Polak, Willi Tscheschner * * Permission is hereby granted, free of charge, to any person obtaining a * copy of this software and associated documentation files (the "Software"), * to deal in the Software without restriction, including without limitation * the rights to use, copy, modify, merge, publish, distribute, sublicense, * and/or sell copies of the Software, and to permit persons to whom the * Software is furnished to do so, subject to the following conditions: * * The above copyright notice and this permission notice shall be included in * all copies or substantial portions of the Software. * * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER * DEALINGS IN THE SOFTWARE. **//** * Init namespaces */if(!ORYX) {var ORYX = {};}if(!ORYX.Core) {ORYX.Core = {};}/** * @classDescription Top Level uiobject. * */ORYX.Core.Canvas = {	/**	 * Constructor	 */	construct: function(options) {		arguments.callee.$.construct.apply(this, arguments);		if(!(options && options.width && options.height)) {					ORYX.Log.fatal("Canvas is missing mandatory parameters options.width and options.height.");			return;		};					//TODO set document resource id		this.resourceId = options.id;		this.nodes = [];				this.edges = [];				//init svg document		this.rootNode = ORYX.Editor.graft("http://www.w3.org/2000/svg", options.parentNode,			['svg', {id: this.id, width: options.width, height: options.height},				['defs', {}]			]);					this.rootNode.setAttributeNS("xmlns", "xlink", "http://www.w3.org/1999/xlink");		this.rootNode.setAttributeNS("xmlns", "svg", "http://www.w3.org/2000/svg");		this._htmlContainer = ORYX.Editor.graft("http://www.w3.org/1999/xhtml", options.parentNode,			['div', {id: "oryx_canvas_htmlContainer", style:"position:absolute; top:5px"}]);				this.node = ORYX.Editor.graft("http://www.w3.org/2000/svg", this.rootNode,			['g', {},				['g', {"class": "stencils"},					['g', {"class": "me"}],					['g', {"class": "children"}],					['g', {"class": "edge"}]				],				['g', {"class":"svgcontainer"}]			]);				/*		var off = 2 * ORYX.CONFIG.GRID_DISTANCE;		var size = 3;		var d = "";		for(var i = 0; i <= options.width; i += off)			for(var j = 0; j <= options.height; j += off)				d = d + "M" + (i - size) + " " + j + " l" + (2*size) + " 0 m" + (-size) + " " + (-size) + " l0 " + (2*size) + " m0" + (-size) + " ";									ORYX.Editor.graft("http://www.w3.org/2000/svg", this.node.firstChild.firstChild,			['path', {d:d , stroke:'#000000', 'stroke-width':'0.15px'},]);		*/				//Global definition of default font for shapes		//Definitions in the SVG definition of a stencil will overwrite these settings for		// that stencil.		/*if(navigator.platform.indexOf("Mac") > -1) {			this.node.setAttributeNS(null, 'stroke', 'black');			this.node.setAttributeNS(null, 'stroke-width', '0.5px');			this.node.setAttributeNS(null, 'font-family', 'Skia');			//this.node.setAttributeNS(null, 'letter-spacing', '2px');			this.node.setAttributeNS(null, 'font-size', ORYX.CONFIG.LABEL_DEFAULT_LINE_HEIGHT);		} else {			this.node.setAttributeNS(null, 'stroke', 'none');			this.node.setAttributeNS(null, 'font-family', 'Verdana');			this.node.setAttributeNS(null, 'font-size', ORYX.CONFIG.LABEL_DEFAULT_LINE_HEIGHT);		}*/				this.node.setAttributeNS(null, 'stroke', 'black');		this.node.setAttributeNS(null, 'font-family', 'Verdana, sans-serif');		this.node.setAttributeNS(null, 'font-size-adjust', 'none');		this.node.setAttributeNS(null, 'font-style', 'normal');		this.node.setAttributeNS(null, 'font-variant', 'normal');		this.node.setAttributeNS(null, 'font-weight', 'normal');		this.node.setAttributeNS(null, 'line-heigth', 'normal');				this.node.setAttributeNS(null, 'font-size', ORYX.CONFIG.LABEL_DEFAULT_LINE_HEIGHT);					this.bounds.set(0,0,options.width, options.height);				this.addEventHandlers(this.rootNode.parentNode);				//disable context menu		this.rootNode.oncontextmenu = function() {return false;};	},		update: function() {				this.nodes.each(function(node) {			this._traverseForUpdate(node);		}.bind(this));				// call stencil's layout callback		// (needed for row layouting of xforms)		this.getStencil().layout(this);				this.nodes.invoke("_update");				this.edges.invoke("_update", true);				/*this.children.each(function(child) {			child._update();		});*/	},		_traverseForUpdate: function(shape) {		var childRet = shape.isChanged;		shape.getChildNodes(false, function(child) {			if(this._traverseForUpdate(child)) {				childRet = true;			}		}.bind(this));				if(childRet) {			shape.layout();			return true;		} else {			return false;		}	},		layout: function() {							},		/**	 * 	 * @param {Object} deep	 * @param {Object} iterator	 */	getChildNodes: function(deep, iterator) {		if(!deep && !iterator) {			return this.nodes.clone();		} else {			var result = [];			this.nodes.each(function(uiObject) {				if(iterator) {					iterator(uiObject);				}				result.push(uiObject);								if(deep && uiObject instanceof ORYX.Core.Shape) {					result = result.concat(uiObject.getChildNodes(deep, iterator));				}			});				return result;		}	},		/**	 * 	 * @param {Object} iterator	 */	getChildEdges: function(iterator) {		if(iterator) {			this.edges.each(function(edge) {				iterator(edge);			});		}				return this.edges.clone();	},		/**	 * Overrides the UIObject.add method. Adds uiObject to the correct sub node.	 * @param {UIObject} uiObject	 */	add: function(uiObject) {		//if uiObject is child of another UIObject, remove it.		if(uiObject instanceof ORYX.Core.UIObject) {			if (!(this.children.member(uiObject))) {				//if uiObject is child of another parent, remove it from that parent.				if(uiObject.parent) {					uiObject.parent.remove(uiObject);				}				//add uiObject to the Canvas				this.children.push(uiObject);				//set parent reference				uiObject.parent = this;				//add uiObject.node to this.node depending on the type of uiObject				if(uiObject instanceof ORYX.Core.Shape) {					if(uiObject instanceof ORYX.Core.Edge) {						uiObject.addMarkers(this.rootNode.getElementsByTagNameNS(NAMESPACE_SVG, "defs")[0]);						uiObject.node = this.node.childNodes[0].childNodes[2].appendChild(uiObject.node);						this.edges.push(uiObject);					} else {						uiObject.node = this.node.childNodes[0].childNodes[1].appendChild(uiObject.node);						this.nodes.push(uiObject);					}				} else {	//UIObject					uiObject.node = this.node.appendChild(uiObject.node);				}				uiObject.bounds.registerCallback(this._changedCallback);			} else {								ORYX.Log.warn("add: ORYX.Core.UIObject is already a child of this object.");			}		} else {			ORYX.Log.fatal("add: Parameter is not of type ORYX.Core.UIObject.");		}	},	/**	 * Overrides the UIObject.remove method. Removes uiObject.	 * @param {UIObject} uiObject	 */	remove: function(uiObject) {		//if uiObject is a child of this object, remove it.		if (this.children.member(uiObject)) {			//remove uiObject from children			this.children = this.children.without(uiObject);			//delete parent reference of uiObject			uiObject.parent = undefined;			//delete uiObject.node from this.node			if(uiObject instanceof ORYX.Core.Shape) {				if(uiObject instanceof ORYX.Core.Edge) {					uiObject.removeMarkers();					uiObject.node = this.node.childNodes[0].childNodes[2].removeChild(uiObject.node);					this.edges = this.edges.without(uiObject);				} else {					uiObject.node = this.node.childNodes[0].childNodes[1].removeChild(uiObject.node);					this.nodes = this.nodes.without(uiObject);				}			} else {	//UIObject					uiObject.node = this.node.removeChild(uiObject.node);			}			uiObject.bounds.unregisterCallback(this._changedCallback);		} else {			ORYX.Log.warn("remove: ORYX.Core.UIObject is not a child of this object.");		}	},	getRootNode: function() {		return this.rootNode;	},		getSvgContainer: function() {		return this.node.childNodes[1];	},		getHTMLContainer: function() {		return this._htmlContainer;	},		/**	 * Return all elements of the same highest level	 * @param {Object} elements	 */	getShapesWithSharedParent: function(elements) {		// If there is no elements, return []		if(!elements || elements.length < 1) { return [] }		// If there is one element, return this element		if(elements.length == 1) { return elements}		return elements.findAll(function(value){			var parentShape = value.parent;			while(parentShape){				if(elements.member(parentShape)) return false;				parentShape = parentShape.parent			}			return true;		});			},	setSize: function(size, dontSetBounds) {		if(!size || !size.width || !size.height){return}				if(this.rootNode.parentNode){			this.rootNode.parentNode.style.width = size.width + 'px';			this.rootNode.parentNode.style.height = size.height + 'px';		}				this.rootNode.setAttributeNS(null, 'width', size.width);		this.rootNode.setAttributeNS(null, 'height', size.height);		//this._htmlContainer.style.top = "-" + (size.height + 4) + 'px';				if( !dontSetBounds ){			this.bounds.set({a:{x:0,y:0},b:{x:size.width,y:size.height}})				}	},		/**	 * Returns an SVG document of the current process.	 * @param {Boolean} escapeText Use true, if you want to parse it with an XmlParser,	 * 					false, if you want to use the SVG document in browser on client side.	 */	getSVGRepresentation: function(escapeText) {		// Get the serialized svg image source        var svgClone = this.getRootNode().cloneNode(true);				var x1, y1, x2, y2;		this.getChildShapes(true).each(function(shape) {			var absBounds = shape.absoluteBounds();			var ul = absBounds.upperLeft();			var lr = absBounds.lowerRight();			if(x1 == undefined) {				x1 = ul.x;				y1 = ul.y;				x2 = lr.x;				y2 = lr.y;			} else {				x1 = Math.min(x1, ul.x);				y1 = Math.min(y1, ul.y);				x2 = Math.max(x2, lr.x);				y2 = Math.max(y2, lr.y);			}		});				var margin = 10;				var width, height, tx, ty;		if(x1 == undefined) {			width = 0;			height = 0;			tx = 0;			ty = 0;		} else {			width = x2 - x1;			height = y2 - y1;			tx = -x1+margin/2;			ty = -y1+margin/2;		}		 				        // Set the width and height        svgClone.setAttributeNS(null, 'width', width + margin);        svgClone.setAttributeNS(null, 'height', height + margin);				svgClone.childNodes[1].firstChild.setAttributeNS(null, 'transform', 'translate(' + tx + ", " + ty + ')');				//remove scale factor		svgClone.childNodes[1].removeAttributeNS(null, 'transform');				try{			var svgCont = svgClone.childNodes[1].childNodes[1];			svgCont.parentNode.removeChild(svgCont);		} catch(e) {}		if(escapeText) {			$A(svgClone.getElementsByTagNameNS(ORYX.CONFIG.NAMESPACE_SVG, 'tspan')).each(function(elem) {				elem.textContent = elem.textContent.escapeHTML();			});						$A(svgClone.getElementsByTagNameNS(ORYX.CONFIG.NAMESPACE_SVG, 'text')).each(function(elem) {				if(elem.childNodes.length == 0)					elem.textContent = elem.textContent.escapeHTML();			});		}		        return svgClone;	},	_delegateEvent: function(event) {		if(this.eventHandlerCallback && ( event.target == this.rootNode || event.target == this.rootNode.parentNode )) {			this.eventHandlerCallback(event, this);		}	},		toString: function() { return "Canvas " + this.id } } ORYX.Core.Canvas = ORYX.Core.AbstractShape.extend(ORYX.Core.Canvas);