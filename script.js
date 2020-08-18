var inputNode;
var outputNode;

var refreshElements = function() {
	inputNode = document.getElementById("inputArea");
	outputNode = document.getElementById("hexOutputTable");
}
refreshElements();

var interpretHex = function(hexString) {
	hexString = hexString.toUpperCase();
	var index = "0123456789ABCDEF";
	var hexOne = index.indexOf(hexString.charAt(0)) * 16;
	var hexTwo = index.indexOf(hexString.charAt(1));
	return (hexOne + hexTwo) / 255;
}


var roundBit = function(value) {
	return Math.round(value * 255);	
}


/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
 
var hueToRGB = function(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) { t += 1 }
            if(t > 1) { t -= 1 }
            if(t < 1/6) { 
				return p + (q - p) * 6 * t 
			}
            if(t < 1/2) { return q } 
            if(t < 2/3) { 
				return p + (q - p) * (2/3 - t) * 6 
			}
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

	return "rgb(" + Math.round(r * 255).toString() + "," + Math.round(g * 255).toString() + "," + Math.round(b * 255).toString() + ")";
}

/*

var hueToRGB = function(h) {
	
	var rgbtemp = [h + .666, h, h - .666];
	var rgb = [];
	
	for (x = 0; x < 3; x++) {
		
		if (rgbtemp[x] > 1) {
			rgbtemp[x] -= 1;
		} else if (rgbtemp [x] < 0) {
			rgbtemp[x] += 1;
		}
		
		if ((rgbtemp[x] * 3) < 2) {
			rgb.push(roundBit((.666 - rgbtemp[x]) * 6));
		} else {
			rgb.push(roundBit(rgbtemp[x]));
		}
		
	}
	console.log(rgb);
	return "rgb(" + rgb[0].toString() + "," + rgb[1].toString() + "," + rgb[2].toString() + ")";
}

*/


var updateHex = function() {
	var nodes = [];
	refreshElements();
	outputNode.innerHTML = "";
	var invalidChars = /^((([0123456789ABCDEF]){2}\s)|(([0123456789ABCDEF]){2}$))+$/g;
	var hexInput = inputNode.value.toUpperCase();
	var hexArray = [];
	var colors = [];
	var validator = !invalidChars.test(hexInput);
	if (validator) {
		nodes.push(document.createElement("TR"));
		nodes[0].className = "output";
		nodes[0].appendChild(document.createElement("TD"));
		nodes[0].appendChild(document.createTextNode("Invalid input"));
		nodes[0].style.color = "red";
		outputNode.appendChild(nodes[0]);
	} else {
		if (hexInput.charAt(hexInput.length) != " ") {
			hexInput += " ";
		}
		hexInput = hexInput.replace(/\s/g, "__");
		for (i = 0; i < hexInput.length; i += 2) {
			var currentSlice = hexInput.slice(i, i + 2);
			if (!((i / 4).toString().includes("."))) {
				hexArray.push(currentSlice);
			}
		}
		console.log("hexInput = " + hexInput);
		console.log("hexArray = " + hexArray);
		for (var b = 0; b < hexArray.length; b++) {
			colors.push(interpretHex(hexArray[b]));
		}
		var rows = Math.floor((colors.length / 16) + 1);
		var currentNode;
		for (var c = 0; c < rows; c++) {
			nodes.push(document.createElement("TR"));
			nodes[c].className = "output";
			currentNode = nodes[c];
			for (var n = 0; n < 16; n++) {
				console.log("left side of comp: " + (n + (c * 16)));
				console.log("right side of comp: " + hexArray.length);
				console.log("outer n =" + n);
				console.log((n + (c * 16)) < hexArray.length);
				var currentTDNode;
				var currentSpanNode;
				if (!((n / 4).toString().includes("."))) {
					currentTDNode = document.createElement("TD");
				}
				if ((n + (c * 16)) < hexArray.length) {
					console.log("n = " + n);
					console.log(hexArray[n + (c * 16)]);
					currentSpanNode = document.createElement("SPAN");
					currentSpanNode.appendChild(document.createTextNode(hexArray[n + (c * 16)]));
					console.log(hueToRGB(colors[n + (c * 16)]));
					console.log(currentSpanNode.style.backgroundColor);
					if (hexArray[n + (c * 16)] == "00") {
						currentSpanNode.style.backgroundColor = "rgb(255,255,255)";
						currentSpanNode.style.color = "black";
					} else if (hexArray[n + (c * 16)] == "FF") {
						currentSpanNode.style.backgroundColor = "rgb(0,0,0)";
						currentSpanNode.style.color = "white";
					} else {
						currentSpanNode.style.backgroundColor = hueToRGB(colors[n + (c * 16)], 0.85, 0.5);
						currentSpanNode.style.color = "white";	
					}
					currentTDNode.appendChild(currentSpanNode);	
				}
				currentNode.appendChild(currentTDNode);
			}
			outputNode.appendChild(currentNode);
		}
	}
}

document.addEventListener("keyup", updateHex);