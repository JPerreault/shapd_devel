var container, stats;

var camera, scene, renderer, raycaster, projector;

var text, plane;
var movePlz = false;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;
var INTERSECTED, HIGHLIGHTED;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

	container = document.createElement( 'div' );
	container.style.zIndex = '10';
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 4, window.innerWidth / window.innerHeight, 500, 100000 );
	camera.position.z = 1000;

	scene = new THREE.Scene();

	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 0, 1 );
	scene.add( light );
	
	projector = new THREE.Projector();
	raycaster = new THREE.Raycaster();

	parent = new THREE.Object3D();
	scene.add( parent );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );

	container.appendChild( renderer.domElement );

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );

	window.addEventListener( 'resize', onWindowResize, false );

		var sliderControls = document.createElement('div');
		sliderControls.id = 'shapeSlidersContainer';
		sliderControls.style.top = '10px';
		sliderControls.style.left = '5px';
		sliderControls.style.position = 'absolute';
		sliderControls.style.zIndex = '1000';
		document.body.appendChild(sliderControls);
		
		var slider1 = document.createElement('div');
		slider1.id = 'extrusionSlider';
		slider1.style.width = '180px';
		slider1.className = 'menuHeader';
		slider1.style.position = 'relative';
		slider1.style.display = 'inline-block';
		slider1.style.marginTop = '12px';
		slider1.style.marginLeft = '20px';
		slider1.style.cssFloat = 'right';
		sliderControls.appendChild(slider1);
	
	$(function() {
		$( "#extrusionSlider" ).slider({
			value: 1,
			min: 1,
			max: 100,
			step: 1,
			slide: function(event, ui){
				if (typeof INTERSECTED !== 'undefined' && INTERSECTED !== 'null')
				{
					shapes[INTERSECTED.parent.idNumber].extrudeSettings.amount = ui.value;
					updateScene();
				}
			}
		})});
}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseDown( event ) {
	event.preventDefault();
	
	if (event.target.id.indexOf('slider') === -1 && event.target.parentElement.id.indexOf('slider') === -1 && event.target.className.indexOf('slider') === -1)
	{
		movePlz = true;
		document.addEventListener( 'mouseup', onDocumentMouseUp, false );
		document.addEventListener( 'mouseout', onDocumentMouseOut, false );
		mouseXOnMouseDown = event.clientX - windowHalfX;
		targetRotationOnMouseDown = targetRotation;
		
		var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
		projector.unprojectVector( vector, camera );
		raycaster.set( camera.position, vector.sub( camera.position ).normalize() );
		var intersects = raycaster.intersectObjects( parent.children, true );
		
		if ( intersects.length > 0 ) 
		{
			if (typeof INTERSECTED !== 'undefined' && INTERSECTED !== 'null')
				INTERSECTED.material.color.g = 0;
			INTERSECTED = intersects[0].object;
			$("#extrusionSlider").slider("value", shapes[INTERSECTED.parent.idNumber].extrudeSettings.amount);
			INTERSECTED.material.color.g = .35;
		}
		else if (typeof INTERSECTED !== 'undefined' && INTERSECTED !== 'null')
		{
			INTERSECTED.material.color.g = 0;
			INTERSECTED = 'null';
		}
	}
}

function onDocumentMouseMove( event ) {
	if (movePlz)
	{
		mouseX = event.clientX - windowHalfX;
		targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
	}
	
	var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
	projector.unprojectVector( vector, camera );
	raycaster.set( camera.position, vector.sub( camera.position ).normalize() );
	var intersects = raycaster.intersectObjects( parent.children, true );
	
	if ( intersects.length > 0 ) 
	{		
		if ( HIGHLIGHTED != intersects[ 0 ].object ) 
		{
			HIGHLIGHTED = intersects[ 0 ].object;
			HIGHLIGHTED.material.opacity = 0.7;
		}
	} 
	else 
	{
		if ( HIGHLIGHTED ) 
			HIGHLIGHTED.material.opacity = 1;
		HIGHLIGHTED = null;
	}
}

function onDocumentMouseUp( event ) {
	movePlz = false;
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onDocumentMouseOut( event ) {
	movePlz = false;
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onDocumentTouchStart( event ) {

	if ( event.touches.length == 1 ) {
		event.preventDefault();
		mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
		targetRotationOnMouseDown = targetRotation;
	}
}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;
	}
}

function animate() {

	requestAnimationFrame( animate );
	render();
}

function render() {
	parent.rotation.y += ( targetRotation - parent.rotation.y ) * 0.05;
	renderer.render( scene, camera );
}

function addShape( shape, color, s, id ) {
		var extrudeSettings = shape.extrudeSettings;
		var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
		var mesh = THREE.SceneUtils.createMultiMaterialObject( geometry, [ new THREE.MeshLambertMaterial( { color: color } ), new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true } ) ] );
		//var mesh = THREE.SceneUtils.createMultiMaterialObject( geometry, [ new THREE.MeshLambertMaterial( { color: 0x666666, emissive: 0x000000, ambient: 0xffffff, shading: THREE.SmoothShading } ), new THREE.MeshLambertMaterial( { color: 0x666666, emissive: 0x000000, ambient: 0x000000, shading: THREE.SmoothShading } )] );
		mesh.scale.set( s, s, s );
		mesh.idNumber = id;
		if (typeof INTERSECTED !== 'undefined' && INTERSECTED !== 'null' &&  INTERSECTED.parent.idNumber === id)
		{
			mesh.children[0].material.color.g = .35;
			INTERSECTED = mesh.children[0];
		}
		parent.add( mesh );
}