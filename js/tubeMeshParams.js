var TubeMeshParams = function(){
	var inchConversion = 0.0393701;
	var that = this;
	
	this['Scale'] = .66;
	this['Modify'] = 5;
	this['Depth'] = 1;
	this['Stretch'] = 1;
	this['Loops'] = 2;
	this['Starting Shape'] = 1;
	this['Thickness'] = 1.5;
	this['Material'] = 'Brass gold plated polished';
	this['Face Index'] = -1;
	this['Face Index Incrementor'] = 0;
	this['Torus Rotation'] = 0;
	this['Torus 90 Rotations'] = 0;
	this['Rotation X'] = 0;
	this['Rotation Y'] = 0;
	this['Description'] = '';
	
	this.figure;
	this.xDim = 0;
	this.yDim = 0;
	this.zDim = 0;
	this.officialName = 'Gold-Plated Solid Brass';
	
	this.create = function()
	{
		try
		{
			var parseme = savedShape.split("|");
			var transformations = ['Scale', 'Modify', 'Depth', 'Stretch', 'Loops', 'Starting Shape', 'Thickness', 'Material', 'Face Index', 'Face Index Incrementor', 'Torus Rotation', 'Torus 90 Rotations', 'Rotation X', 'Rotation Y', 'Description'];
			for (var x=0; x<transformations.length; x++)
			{
				if (transformations[x] == 'Material' || transformations[x] == 'Description')
					this[transformations[x]] = parseme[x];
				else
					this[transformations[x]] = parseFloat(parseme[x]);
				
				if (parseme[x].indexOf("undefined") != -1)
					throw "invalid";
			}

			if (parseme == "")
				throw "invalid";
			return this;
		}
		catch(e){}
		this['Scale'] = .66;
		this['Modify'] = 5;
		this['Depth'] = 1;
		this['Stretch'] = 1;
		this['Loops'] = 2;
		this['Starting Shape'] = 1;
		this['Thickness'] = 1.5;
		this['Material'] = 'Brass gold plated polished';
		this['Face Index'] = -1;
		this['Face Index Incrementor'] = 0;
		this['Torus Rotation'] = 0;
		this['Torus 90 Rotations'] = 0;
		this['Rotation X'] = 0;
		this['Rotation Y'] = 0;
		this['Description'] = '';
		
		return this;
	}
	
	
	
	function resetAllParams()
	{
		currentMesh['Modify'] = 5;
		currentMesh['Depth'] = 1;
		currentMesh['Stretch'] = 1;
		currentMesh['Loops'] = 2;
		currentMesh['Thickness'] = 1.5;
		if (view.targetX === 0 && view.targetY === 0)
		{
			currentMesh['Rotation Y'] = 6.28318531/2;
			view.targetY = 6.28318531/2;
		}
		else
		{
			currentMesh['Rotation X'] = 0;
			currentMesh['Rotation Y'] = 0;
			view.targetX = 0;
			view.targetY = 0;
		}
		
		that.updateShapeSliders();
		sceneWrapper.redrawMesh();
		that.calculateDimensions('xyz');
	}

	this.updateShapeSliders = function()
	{
		$( "#thicknessguislider" ).slider( "value", currentMesh['Thickness'] );
		$( "#depthguislider" ).slider( "value", currentMesh['Depth'] );
		$( "#stretchguislider" ).slider( "value", currentMesh['Stretch'] );
		$( "#modifyguislider" ).slider( "value", currentMesh['Modify'] );
		$( "#loopsguislider" ).slider( "value", currentMesh['Loops'] );
		
		$( "#thickslider" ).slider( "value", currentMesh['Thickness'] );
		$( "#depthslider" ).slider( "value", currentMesh['Depth'] );
	}
	
	this.calculateDimensions = function(variables)
	{
		xMin = 999999999999999;
		yMin = 999999999999999;
		zMin = 999999999999999;
		xMax = -999999999999999;
		yMax = -999999999999999;
		zMax = -999999999999999;
		
		for (var i = 0; i < currentMesh.figure.children.length; i++)
		{
			for (var j = 0; j < currentMesh.figure.children[i].children.length; j++)
			{
				currentMesh.figure.children[i].children[j].geometry.computeBoundingBox();
				var boundingBox = currentMesh.figure.children[i].children[j].geometry.boundingBox;
				
				var dimensions = [];
				var scale = currentMesh.figure.children[i].scale.x;
				
				var tmpXMin = boundingBox.min.x * scale;
				var tmpYMin = boundingBox.min.y * scale;
				var tmpZMin = boundingBox.min.z * scale;
				var tmpXMax = boundingBox.max.x * scale;
				var tmpYMax = boundingBox.max.y * scale;
				var tmpZMax = boundingBox.max.z * scale;
				
				if (tmpXMin < xMin)
					xMin = tmpXMin;
				if (tmpYMin < yMin)
					yMin = tmpYMin;
				if (tmpZMin < zMin)
					zMin = tmpZMin;
				if (tmpXMax > xMax)
					xMax = tmpXMax;
				if (tmpYMax > yMax)
					yMax = tmpYMax;
				if (tmpZMax > zMax)
					zMax = tmpZMax;
			}
		}
		
		var xVal, yVal, zVal;
		this.xDim = (xMax - xMin); //May need to be adjusted, used for printability checks
		this.yDim = (yMax - yMin);
		this.zDim = (zMax - zMin);
		
		if (loop.torusDefined)
		{
			loop.loopMesh.geometry.computeBoundingBox();
			var torusBox = loop.loopMesh.geometry.boundingBox;
			var torusScale = loop.loopMesh.scale.x;
			
			var torusxMin = torusBox.min.x * torusScale;
			var torusyMin = torusBox.min.y * torusScale;
			var toruszMin = torusBox.min.z * torusScale;
			var torusxMax = torusBox.max.x * torusScale;
			var torusyMax = torusBox.max.y * torusScale;
			var toruszMax = torusBox.max.z * torusScale;
			
			if (torusxMin < xMin)
				xMin = torusxMin;
			if (torusyMin < yMin)
				yMin = torusyMin;
			if (toruszMin < zMin)
				zMin = toruszMin;
			if (torusxMax > xMax)
				xMax = torusxMin;
			if (torusyMax > yMax)
				yMax = torusyMax;
			if (toruszMax > zMax)
				zMax = toruszMax;
		}
		
		xDimSize = (xMax - xMin) * inchConversion;
		yDimSize = (yMax - yMin) * inchConversion;
		zDimSize = (zMax - zMin) * inchConversion;
		
		xVal = xDimSize.toFixed(2);
		yVal = yDimSize.toFixed(2);
		zVal = zDimSize.toFixed(2);
		
		if (variables === 'xyz')
		{
			document.getElementById('idCostDim').innerHTML = this.figure.children[0].children[0].material.name + '<br>' + xVal + ' (w) x '  + yVal + ' (h) x ' + zVal + ' (d)<br> <span style="font-size:12px">(Dimensions in Inches)</span>';
			document.getElementById('idVShapeDiv').innerHTML = '<span class="largeDimText">' + yVal + ' H</span><br><span class="smallDimText">(Inches high)<span>';
			document.getElementById('idHShapeDiv').innerHTML = '<span class="largeDimText">' + xVal + ' W</span><br><span class="smallDimText">(Inches wide)<span>';
			document.getElementById('idDShapeDiv').innerHTML = '<span class="largeDimText">' + zVal + ' D</span><br><span class="smallDimText">(Inches deep)<span>';	
		}
		else if (variables === 'xy')
		{
			document.getElementById('idVShapeDiv').innerHTML = '<span class="largeDimText">' + yVal + ' H</span><br><span class="smallDimText">(Inches high)<span>';
			document.getElementById('idHShapeDiv').innerHTML = '<span class="largeDimText">' + xVal + ' W</span><br><span class="smallDimText">(Inches wide)<span>';	
			document.getElementById('idDShapeDiv').innerHTML = '<span class="largeDimText">' + zVal + ' D</span><br><span class="smallDimText">(Inches deep)<span>';
		}
	}
	
	this.checkDimensions = function()
	{
		var dimensionsPrintable = 'success';
		var material = this.figure.children[0].children[0].material.name;
		var thicknessOfWire = currentMesh['Thickness'] * currentMesh.figure.scale.x;

		if (material.indexOf('Plastic') !== -1 || material.indexOf('Transparent resin') !== -1 || material.indexOf('Prime gray') !== -1 || material === 'Alumide regular')
		{
			if (!(thicknessOfWire > .675))
				dimensionsPrintable = 'small';
			else if (!(this.checkUpperDimensions()))
				dimensionsPrintable = 'large';
		}
		else if (material === 'Alumide polished')
		{
			if (!(thicknessOfWire > .875))
				dimensionsPrintable = 'small';
			else if (!(this.checkUpperDimensions()))
				dimensionsPrintable = 'large';
		}
		else if (material.indexOf('Stainless steel') !== -1)
		{
			if (!(thicknessOfWire > 1.5))
				dimensionsPrintable = 'small';
			else if (!(this.checkUpperDimensions()))
				dimensionsPrintable = 'large';
		}
		else //Precious metals and brass
		{
			if (!(thicknessOfWire > .65))
				dimensionsPrintable = 'small';
			else if (!(this.checkUpperDimensions()))
				dimensionsPrintable = 'large';
		}
		
		return dimensionsPrintable;
	}
	
	this.checkUpperDimensions = function()
	{
		var fitsBounds;
		var material = this.figure.children[0].children[0].material.name;
		
		if (material === 'Plastic regular white' || material === 'Plastic regular black')
			fitsBounds = (this.xDim < 220 && this.yDim < 170 && this.zDim < 300);
		else if (material.indexOf('Plastic regular' !== -1))
			fitsBounds = (this.xDim < 140 && this.yDim < 140 && this.zDim < 140);
		else if (material.indexOf('Plastic detail' !== -1))
			fitsBounds = (this.xDim < 240 && this.yDim < 240 && this.zDim < 190);
		else if (material.indexOf('Prime gray' !== -1))
			fitsBounds = (this.xDim < 240 && this.yDim < 240 && this.zDim < 225);
		else if (material.indexOf('Transparent resin' !== -1))
			fitsBounds = (this.xDim < 2090 && this.yDim < 690 && this.zDim < 790);
		else if (material.indexOf('Alumide' !== -1))
			fitsBounds = (this.xDim < 300 && this.yDim < 220 && this.zDim < 170);
		else if (material.indexOf('Brass' !== -1))
			fitsBounds = (this.xDim < 85 && this.yDim < 60 && this.zDim < 120);
		else if (material.indexOf('Stainless steel' !== -1))
			fitsBounds = (this.xDim < 990	 && this.yDim < 440 && this.zDim < 170);
		else if (material === 'Silver regular' || material === 'Silver glossy')
			fitsBounds = (this.xDim < 105	 && this.yDim < 105 && this.zDim < 28);
		else if (material === 'Silver premium')	
			fitsBounds = (this.xDim < 95	 && this.yDim < 95 && this.zDim < 28);
		else if (material.indexOf('Titanium' !== -1))
			fitsBounds = (this.xDim < 240 && this.yDim < 240 && this.zDim < 390);
		else if (material.indexOf('Gold' !== -1))
			fitsBounds = (this.xDim < 85 && this.yDim < 60 && this.zDim < 120);

		return fitsBounds;
	}
};