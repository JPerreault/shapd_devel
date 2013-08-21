var currentPoint, numberLength;
var descArray = [];

function svgToThreeD(svgString)
{
	var toop = [];
	var shapes = [];
	var svgIndexer = svgString;
	var shapeNumber = 0;
	
	while (svgIndexer.indexOf('d="m') !== -1)
	{
		toop[shapeNumber] = addToString (svgIndexer.indexOf('d="m') + 4, svgIndexer);
		svgIndexer = svgIndexer.substr(svgIndexer.indexOf('d="m') + 4, svgIndexer.length);
		shapeNumber++;
	}
		
	for (var i = 0; i < toop.length; i++)
	{
		shapes[i] = svgDescToThreejs(toop[i]);
	}
	
	return shapes;
}

function svgDescToThreejs(lines)
{
	var weLoveJason = new THREE.Shape();
	weLoveJason.moveTo(lines[0].x, lines[0].y)
	for (var i = 1; i < lines.length; i++)
	{
		if (lines[i].type === 'lineTo')
			weLoveJason.lineTo(lines[i].x, lines[i].y);
		else
			weLoveJason.bezierCurveTo(lines[i].cp1x, lines[i].cp1y, lines[i].cp2x, lines[i].cp2y, lines[i].x, lines[i].y);
	}
	
	return weLoveJason;
}

function addToString(startingIndex, svgString)
{
	currentPoint = startingIndex;
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
	
	return descArray;
}

function parseMoveTo(desc, svgString)
{
	while (svgString[currentPoint + numberLength] !== ',')
	{
		numberLength++;
	}
		
	desc.x = parseInt(svgString.substr(currentPoint, numberLength));
	desc.x += 550;
	currentPoint += numberLength + 1;
	numberLength = 0;

	while (svgString[currentPoint + numberLength] !== 'l' && svgString[currentPoint + numberLength] !== 'z' && svgString[currentPoint + numberLength] !== 'c')
	{
		numberLength++;
	}
	
	desc.y = parseInt(svgString.substr(currentPoint, numberLength));
	desc.y += 145;
	desc.y /= -1.75;
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