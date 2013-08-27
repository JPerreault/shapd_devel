var currentPoint, numberLength;
var descArray = [];
var shapes = [];

function svgToThreeD(svgString)
{
	var toop = [];
	var oldShapes = shapes;
	shapes = [];
	var svgIndexer = svgString;
	var shapeNumber = 0;
	var nextShape = getNextShape(svgIndexer);
	
	while (nextShape !== 'end')
	{
		toop[shapeNumber] = parseShape (svgIndexer, nextShape);
		svgIndexer = svgIndexer.substr(currentPoint + 10, svgIndexer.length);
		nextShape = getNextShape(svgIndexer);
		shapeNumber++;
	}
	
	for (var i = 0; i < toop.length; i++)
	{
		var extrudeSettings;
		var idOfSvg = toop[i].svgId;
		
		if (typeof oldShapes[i] !== 'undefined' && idOfSvg === oldShapes[i].svgId)
			extrudeSettings = oldShapes[i].extrudeSettings;
		else
		{
			extrudeSettings = { amount: 20 };
			extrudeSettings.bevelEnabled = true;
			extrudeSettings.bevelSegments = 2;
			extrudeSettings.steps = 2;
		}
		
		shapes[i] = svgDescToThreejs(toop[i]);
		shapes[i].svgId = idOfSvg;
		shapes[i].extrudeSettings = extrudeSettings;
		//console.log(extrudeSettings.amount);
	}
	
	return shapes;
}

function getNextShape(svgString)
{
	for (var i = 0; i < svgString.length; i ++)
	{
		var pathIndex = svgString.indexOf('path');
		var rectIndex = svgString.indexOf('rect');
		var circleIndex = svgString.indexOf('circle');
		var ellipseIndex = svgString.indexOf('ellipse');

		var nextIndex = pathIndex;
		var nextType = 'path';
		
		if ((circleIndex < nextIndex || nextIndex == -1) && circleIndex > -1)
		{
			nextIndex = circleIndex;
			nextType = 'circle';
		}
		if ((ellipseIndex < nextIndex || nextIndex == -1) && ellipseIndex > -1)
		{
			nextIndex = ellipseIndex;
			nextType = 'ellipse';
		}
		if ((rectIndex < nextIndex || nextIndex === -1) && rectIndex > -1)
		{
			nextIndex = rectIndex;
			nextType = 'rect';
		}
		
		if (nextIndex === -1)
		{
			nextType = 'end';
			return nextType;
		}
		else
		{
			currentPoint = nextIndex;
			return nextType;
		}
	}
}

function svgDescToThreejs(lines)
{
	var weLoveJason = new THREE.Shape();
	weLoveJason.moveTo(lines[0].x, lines[0].y)
	for (var i = 1; i < lines.length; i++)
	{
		if (lines[i].type === 'lineTo')
			weLoveJason.lineTo(lines[i].x, lines[i].y);
		else if (lines[i].type === 'bezierCurveTo')
			weLoveJason.bezierCurveTo(lines[i].cp1x, lines[i].cp1y, lines[i].cp2x, lines[i].cp2y, lines[i].x, lines[i].y);
		else if (lines[i].type === 'ellipseCurveTo')
			weLoveJason.absellipse( lines[0].x - lines[i].rx, lines[0].y, lines[i].rx, lines[i].ry, 0, Math.PI*2.0, true );
	}
	
	return weLoveJason;
}

function parseShape(svgString, type)
{
	var parsedShape;
	if (type === 'path')
		parsedShape = parsePath(svgString);
	else if (type === 'circle')
		parsedShape = parseCircle(svgString);
	else if (type === 'ellipse')
		parsedShape = parseEllipse(svgString);
	else if (type === 'rect')
		parsedShape = parseRect(svgString);
		
	var svgId = '';
	var numberLength = 0;
	var tempString = svgString.substr(svgString.indexOf(type), svgString.length);

	while (tempString[tempString.indexOf('svg_') + 4 + numberLength] !== '"')
	{
		svgId += tempString[tempString.indexOf('svg_') + 4 + numberLength];
		numberLength++;
	}
	var id = parseInt(svgId);
		
	parsedShape.svgId = id;
	return parsedShape;
}

function parsePath(svgString)
{
	currentPoint = svgString.indexOf('d="m') + 4;
	var endPoint, type, desc;
	desc = new svgDesc();
	descArray = [];
	numberLength = 0;
	
	for (var i = currentPoint; i < svgString.length; i++)
		if (svgString[i] == "z")
		{
			endPoint = i;
			break;
		}
	
	desc = parseMoveTo(desc, svgString);
	descArray.push(desc);
	
	if (svgString[currentPoint-1] === 'l')
		type = 'lineTo';
	else if (svgString[currentPoint-1] === 'c')
		type = 'bezierCurveTo';
	
	while (currentPoint < endPoint)
	{	
		desc = new svgDesc();
		if (type === 'lineTo')
		{
			desc = parseLineTo(desc, svgString);
			descArray.push(desc);
		}
		else if (type === 'bezierCurveTo')
		{
			desc = parseBezierCurveTo(desc, svgString);
			descArray.push(desc);
		}
		
		if (svgString[currentPoint-1] === 'l')
			type = 'lineTo';
		else if (svgString[currentPoint-1] === 'c')
			type = 'bezierCurveTo';
	}
	
	//currentPoint = svgString.indexOf('path') + 4;
	return descArray;
}

function parseCircle(svgString)
{
	var descArray = [];
	var numberLength = 0;
	var tempString = svgString.substr(currentPoint, svgString.length);

	var cx = cy = r = '';
	
	while (tempString[tempString.indexOf('cx="') + 4 + numberLength] !== '"')
	{
		cx += tempString[tempString.indexOf('cx="') + 4 + numberLength];
		numberLength++;
	}
	numberLength = 0;
	
	while (tempString[tempString.indexOf('cy="') + 4 + numberLength] !== '"')
	{
		cy += tempString[tempString.indexOf('cy="') + 4 + numberLength];
		numberLength++;
	}
	numberLength = 0;
	
	while (tempString[tempString.indexOf('r="') + 3 + numberLength] !== '"')
	{
		r += tempString[tempString.indexOf('r="') + 3 + numberLength];
		numberLength++;
	}
	
	var xCenter = parseInt(cx);
	var yCenter = parseInt(cy);
	var radiusX = parseFloat(r);
	
	desc = new svgDesc();
	desc.x = xCenter;
	desc.x -= 345;
	desc.y = yCenter;
	desc.y -= 300;
	desc.y /= -1;
	desc.type = 'moveTo';
	descArray.push(desc);
	
	desc = new svgDesc();
	desc.rx = radiusX;
	desc.ry = radiusX;
	desc.type = 'ellipseCurveTo';
	descArray.push(desc);
	
	return descArray;
}

function parseEllipse(svgString)
{
	var descArray = [];
	var numberLength = 0;
	var tempString = svgString.substr(currentPoint, svgString.length);
	var cx = cy = rx = ry = '';
	
	while (tempString[tempString.indexOf('cx="') + 4 + numberLength] !== '"')
	{
		cx += tempString[tempString.indexOf('cx="') + 4 + numberLength];
		numberLength++;
	}
	numberLength = 0;
	
	while (tempString[tempString.indexOf('cy="') + 4 + numberLength] !== '"')
	{
		cy += tempString[tempString.indexOf('cy="') + 4 + numberLength];
		numberLength++;
	}
	numberLength = 0;
	
	while (tempString[tempString.indexOf('rx="') + 4 + numberLength] !== '"')
	{
		rx += tempString[tempString.indexOf('rx="') + 4 + numberLength];
		numberLength++;
	}
	numberLength = 0;
	
	while (tempString[tempString.indexOf('ry="') + 4 + numberLength] !== '"')
	{
		ry += tempString[tempString.indexOf('ry="') + 4 + numberLength];
		numberLength++;
	}
	numberLength = 0;
	
	
	var xCenter = parseInt(cx);
	var yCenter = parseInt(cy);
	var radiusX = parseFloat(rx);
	var radiusY = parseFloat(ry);
	
	desc = new svgDesc();
	desc.x = xCenter;
	desc.x -= 345;
	desc.y = yCenter;
	desc.y -= 300;
	desc.y /= -1;
	desc.type = 'moveTo';
	descArray.push(desc);
	
	desc = new svgDesc();
	desc.rx = radiusX;
	desc.ry = radiusY;
	desc.type = 'ellipseCurveTo';
	descArray.push(desc);
	
	return descArray;
}

function parseRect(svgString)
{
	var descArray = [];
	var numberLength = 0;
	var tempString = svgString.substr(currentPoint, svgString.length);
	var x = y = height = width = '';
	
	while (tempString[tempString.indexOf('x="') + 3 + numberLength] !== '"')
	{
		x += tempString[tempString.indexOf('x="') + 3 + numberLength];
		numberLength++;
	}
	numberLength = 0;
	
	while (tempString[tempString.indexOf(' y="') + 4 + numberLength] !== '"')
	{
		y += tempString[tempString.indexOf(' y="') + 4 + numberLength];
		numberLength++;
	}
	numberLength = 0;
	
	while (tempString[tempString.indexOf('height="') + 8 + numberLength] !== '"')
	{
		height += tempString[tempString.indexOf('height="') + 8 + numberLength];
		numberLength++;
	}
	numberLength = 0;
	
	while (tempString[tempString.indexOf(' width="') + 8 + numberLength] !== '"')
	{
		width += tempString[tempString.indexOf(' width="') + 8 + numberLength];
		numberLength++;
	}
	
	var xPos = parseInt(x);
	var yPos = parseInt(y);
	var rectH = parseInt(height);
	var rectW = parseInt(width);
	
	desc = new svgDesc();
	desc.x = xPos;
	desc.x -= 345;
	desc.y = yPos;
	desc.y -= 300;
	desc.y /= -1;
	desc.type = 'moveTo';
	descArray.push(desc);
	
	desc = new svgDesc();
	desc.x = descArray[descArray.length-1].x + rectW;
	desc.y = descArray[descArray.length-1].y;
	desc.type = 'lineTo';
	descArray.push(desc);
	
	desc = new svgDesc();
	desc.x = descArray[descArray.length-1].x;
	desc.y = descArray[descArray.length-1].y - rectH;
	desc.type = 'lineTo';
	descArray.push(desc);
	
	desc = new svgDesc();
	desc.x = descArray[descArray.length-1].x - rectW;
	desc.y = descArray[descArray.length-1].y;
	desc.type = 'lineTo';
	descArray.push(desc);
	
	desc = new svgDesc();
	desc.x = descArray[descArray.length-1].x;
	desc.y = descArray[descArray.length-1].y + rectH;
	desc.type = 'lineTo';
	descArray.push(desc);

	return descArray;
}

function parseMoveTo(desc, svgString)
{
	while (svgString[currentPoint + numberLength] !== ',')
	{
		numberLength++;
	}
		
	desc.x = parseInt(svgString.substr(currentPoint, numberLength));
	desc.x -= 345;
	currentPoint += numberLength + 1;
	numberLength = 0;

	while (svgString[currentPoint + numberLength] !== 'l' && svgString[currentPoint + numberLength] !== 'z' && svgString[currentPoint + numberLength] !== 'c')
	{
		numberLength++;
	}
	
	desc.y = parseInt(svgString.substr(currentPoint, numberLength));
	desc.y -= 300;
	desc.y /= -1;
	desc.type = 'moveTo';
	currentPoint += numberLength + 1;
	numberLength = 0;
	
	return desc;
}

function parseLineTo(desc, svgString)
{
	while (svgString[currentPoint + numberLength] !== ',')
	{
		numberLength++;
	}
		
	desc.x = parseInt(svgString.substr(currentPoint, numberLength));
	currentPoint += numberLength + 1;
	numberLength = 0;

	while (svgString[currentPoint + numberLength] !== 'l' && svgString[currentPoint + numberLength] !== 'z' && svgString[currentPoint + numberLength] !== 'c')
	{
		numberLength++;
	}
	
	desc.y = parseInt(svgString.substr(currentPoint, numberLength));
	desc.type = 'lineTo';
	currentPoint += numberLength + 1;
	numberLength = 0;
		 
	desc.x = descArray[descArray.length-1].x + desc.x;
	desc.y = descArray[descArray.length-1].y - desc.y;
	
	return desc;
}

function parseBezierCurveTo(desc, svgString)
{
	while (svgString[currentPoint + numberLength] !== ',')
	{
		numberLength++;	
	}
	desc.cp1x = parseInt(svgString.substr(currentPoint, numberLength));
	currentPoint += numberLength + 1;
	numberLength = 0;

	while (svgString[currentPoint + numberLength] !== ' ')
	{
		numberLength++;
	}

	desc.cp1y = parseInt(svgString.substr(currentPoint, numberLength));
	currentPoint += numberLength + 1;
	numberLength = 0;
	
	while (svgString[currentPoint + numberLength] !== ',')
	{
		numberLength++;	
	}
		
	desc.cp2x = parseInt(svgString.substr(currentPoint, numberLength));
	currentPoint += numberLength + 1;
	numberLength = 0;

	while (svgString[currentPoint + numberLength] !== ' ')
	{
		numberLength++;
	}
	
	desc.cp2y = parseInt(svgString.substr(currentPoint, numberLength));
	currentPoint += numberLength + 1;
	numberLength = 0;
	
	while (svgString[currentPoint + numberLength] !== ',')
	{
		numberLength++;	
	}
		
	desc.x = parseInt(svgString.substr(currentPoint, numberLength));
	currentPoint += numberLength + 1;
	numberLength = 0;

	while (svgString[currentPoint + numberLength] !== 'l' && svgString[currentPoint + numberLength] !== 'z' && svgString[currentPoint + numberLength] !== 'c')
	{
		numberLength++;
	}
	
	desc.y = parseInt(svgString.substr(currentPoint, numberLength));
	desc.type = 'bezierCurveTo';
	currentPoint += numberLength + 1;
	numberLength = 0;
	
	desc.cp1x = descArray[descArray.length-1].x + desc.cp1x;
	desc.cp1y = descArray[descArray.length-1].y - desc.cp1y;
	desc.cp2x = descArray[descArray.length-1].x + desc.cp2x;
	desc.cp2y = descArray[descArray.length-1].y - desc.cp2y;
	desc.x = descArray[descArray.length-1].x + desc.x;
	desc.y = descArray[descArray.length-1].y - desc.y;
	
	return desc;
}

var svgDesc = function(x, y, type, controlPointOneX, controlPointOneY, controlPointTwoX, controlPointTwoY)
{
	this.x = x;
	this.y = y;
	this.type = type;
	this.cp1x = controlPointOneX;
	this.cp1y = controlPointOneY;
	this.cp2x = controlPointTwoX;
	this.cp2y = controlPointTwoY;
}

//svgCanvas.getSvgString()(function(data, error) {test = data})
//svgToThreeD(test)