var INTERSECTED, HIGHLIGHTED;
var svgShape = new THREE.Object3D();

var SvgMeshBuilder = function(materialsLibrary)
{
	this.matLib = materialsLibrary;
	this.m = materialsLibrary.getMaterial( "Brass gold plated polished" );
	this.m.name = 'Brass gold plated polished';
	
	this.dimensions = 2;
	var that = this;
	
	this.build = function()
	{
		svgCanvas.getSvgString()(function(data, error) 
		{
			currentMesh['Scale'] = .12;
			svgShape = new THREE.Object3D();
			shapes = svgToThreeD(data);
			
			for (var i = 0; i < shapes.length; i++)
				addShape(shapes[i], 0xFF0000, .12, i);
			
			sceneWrapper.redrawMesh();
		}) 
	}
	
	function addShape( shape, color, s, id ) {
		var extrudeSettings = shape.extrudeSettings;
		var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
		var mesh = THREE.SceneUtils.createMultiMaterialObject( geometry, [  materialsLibrary.getMaterial(currentMesh['Material']), materialsLibrary.getMaterial(currentMesh['Material']) ] );
		mesh.scale.set( s, s, s );
		mesh.idNumber = id;
		// if (typeof INTERSECTED !== 'undefined' && INTERSECTED !== 'null' &&  INTERSECTED.svgShape.idNumber === id)
		// {
			// mesh.children[0].material.color.g = .35;
			// INTERSECTED = mesh.children[0];
		// }
		svgShape.add( mesh );
	}
	
	document.getElementById('idDimChange').onclick = function()
	{
		if (that.dimensions === 2)
		{
			this.innerHTML = 'View 2D';
			$('#svgedit').fadeOut(450);
			that.dimensions = 3;
			that.build();
		}
		else
		{
			this.innerHTML = 'Make 3D';
			$('#svgedit').fadeIn(450);
			that.dimensions = 2;
		}
	}
}