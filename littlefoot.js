'use-strict';

function LittleFoot(options){
	options = options || {}
	return {
		footnoteContainer: options.footnoteContainer || ".footnotes",
		footnoteSelector: options.footnoteSelector || "li",
		footnotePrefix: options.footnotePrefix || "#fn:",
		inlinePrefix: options.inlinePrefix || "#fnref:",
		inlineDepth: options.inlineDepth || 1,
		removeInner: options.removeInner || [".reversefootnote"],

		stomp: function(){
			var footnotes = (this.footnoteContainer ? this._domSelector(this.footnoteContainer) : document);
			if(footnotes instanceof HTMLCollection){
				if(footnotes.length == 0){ return; }
				footnotes = footnotes[0];
			}
			if(!footnotes){ return;	}

			var footnoteCount = this._domSelector(this.footnoteSelector, footnotes).length;
			for(var i = 1; i <= footnoteCount; i++){
				var footnote = this._domSelector(this.footnotePrefix + i);
				for(var j = 0; j < this.removeInner.length; j++){
					var remove = this._domSelector(this.removeInner[j], footnote);
					if(!remove){ continue; }

					if(remove instanceof HTMLCollection){
						for(var k = 0; k < remove.length; k++){
							remove[k].parentNode.removeChild(remove[k]);
						}
					} else {
						footnote.removeChild(remove);
					}
				}

				var footnoteContent = footnote.innerHTML;

				var footnoteInline = this._domSelector(this.inlinePrefix + i);
				var footnoteInlineParent = footnoteInline;
				for(var j = 0; j < this.inlineDepth; j++){
					footnoteInlineParent = footnoteInlineParent.parentNode;
				}
				if(!footnoteInlineParent){ continue; }

				var littlefoot = document.createElement("span");
				littlefoot.className = "fn";

				var that = this;
				littlefoot.addEventListener("click", function(event){ that.locate(event.currentTarget); that.toggle(event.currentTarget); });
				littlefoot.innerHTML = '<span class="fn-ellipse" unselectable="on" onselectstart="return false" onmousedown="return false"><span>&bull;&bull;&bull;</span></span><span class="fn-note">' + footnoteContent + '</span>';
				footnoteInlineParent.replaceChild(littlefoot, footnoteInline);
			}

			footnotes.parentNode.removeChild(footnotes);
			var that = this;
			window.addEventListener("resize", function(){
				var footnotes = document.getElementsByClassName("fn");
				for(var i = 0; i < footnotes.length; i++){
					var littlefoot = footnotes[i];
					if(littlefoot.getAttribute("showing") == "true"){
						that.locate(littlefoot);
					}
				}
			});
		},

		toggle: function(footnote){
			footnote.setAttribute("showing", (footnote.getAttribute("showing") != "true"));
		},

		locate: function(footnote){
			var x = footnote.offsetLeft;
			var space = window.innerWidth - x;

			var leftRoom = (x > 160);
			var rightRoom = (space > 160);

			footnote.className = "fn";
			if(leftRoom){ footnote.className += " right"; }
			if(rightRoom){ footnote.className += " left"; }
		},

		_domSelector: function(str, context){
			context = context || document;
			var selector = str.charAt(0);
			if(selector == "#"){
				return context.getElementById(str.substring(1));
			} else if(selector == "."){
				return context.getElementsByClassName(str.substring(1));
			} else {
				return context.getElementsByTagName(str);
			}
		}
	}
}