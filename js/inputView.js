var InputView = function(sW, rend, tMP) {		
	var sceneWrapper = sW;
	var renderer = rend;
	var rotShape = false;

	if (typeof tMP === 'undefined')
	{
		this.targetX = 0;
		this.targetY = 0;
	}
	else
	{
		this.targetX = tMP['Rotation X'];
		this.targetY = tMP['Rotation Y'];
	}

	var targetYRotationOnMouseDown = 0;
	var targetXRotationOnMouseDown = 0;

	var mouseX = 0, mouseY = 0;
	var mouseXOnMouseDown = 0, mouseYOnMouseDown =0;

	this.currentWindowX = window.innerWidth ;
	this.currentWindowY = window.innerHeight;

	var that = this;
	
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	document.addEventListener( 'mousewheel', onDocumentMouseWheel, false);
	document.addEventListener( 'DOMMouseScroll', onDocumentMouseWheel, false);
	window.addEventListener( 'resize', onWindowResize, false );
	
	function onDocumentMouseDown(event)
	{
		if (typeof freeze !== 'undefined' && freeze)
            return;
        
        event.preventDefault();

		if (event.target.id.indexOf('slider') === -1 && event.target.parentElement.id.indexOf('slider') === -1 && event.target.className.indexOf('slider') === -1 && event.target.className.indexOf('scrollbar') === -1)
		{
			mouseXOnMouseDown = event.clientX - that.currentWindowX;
			mouseYOnMouseDown = event.clientY - that.currentWindowY;
			targetYRotationOnMouseDown = that.targetY;
			targetXRotationOnMouseDown = that.targetX;
			rotShape = true;
		}
		
		
		if (state === 'loops')
		{
			var projector = new THREE.Projector();
			
			event.preventDefault();
			var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
			projector.unprojectVector(vector, sceneWrapper.camera);
			var raycaster = new THREE.Raycaster (sceneWrapper.camera.position, vector.sub(sceneWrapper.camera.position).normalize());

			var inBounds = loop.addLoop(raycaster);
			if (inBounds === true)
			{
				loop.torusDefined = true;
				loop.faceIndexIncrementor = 0;
				loop.torusRotation = 0;
				sceneWrapper.redrawTorus();
				$('#idLoopRotContainer').fadeIn(0);
				tutorial.tut6();
			}
		}
		
		
		
		
		var projector = new THREE.Projector();
		var raycaster = new THREE.Raycaster();
		
		var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
		projector.unprojectVector( vector, sceneWrapper.camera );
		raycaster.set( sceneWrapper.camera.position, vector.sub( sceneWrapper.camera.position ).normalize() );
		var intersects = raycaster.intersectObjects( svgShape.children, true );
		
		if ( intersects.length > 0 ) 
		{
			if (typeof INTERSECTED !== 'undefined' && INTERSECTED !== 'null')
			{
				INTERSECTED.material.color.g = 0;
				console.log('test');
			}
			INTERSECTED = intersects[0].object;
			$("#extrusionSlider").slider("value", shapes[INTERSECTED.parent.idNumber].extrudeSettings.amount);
			INTERSECTED.material.color.g = .35;
		}
		else if (typeof INTERSECTED !== 'undefined' && INTERSECTED !== 'null')
		{
			INTERSECTED.material.color.g = 0;
			console.log(INTERSECTED.material.color.g);
			INTERSECTED = 'null';
		}
	}
	
	function onDocumentMouseWheel ( event ) {
        
        if (typeof freeze !== 'undefined' && freeze)
            return;
			
		if (event.target.parentElement.id == 'idShapeLibrary' || event.target.id == 'idShapeLibrary')
        {
            var wheelMovement;
            
            if (event.wheelDelta)
                wheelMovement = -.75*event.wheelDelta;
            else
                wheelMovement = 30*event.detail;
            
            document.getElementById('idShapeLibrary').scrollTop += wheelMovement;
            return;
        }
        
        if (event.target.parentElement.parentElement.id == "idSavedShapeLibrary")
        {
            var wheelMovement;
            
            if (event.wheelDelta)
                wheelMovement = -.75*event.wheelDelta;
            else
                wheelMovement = 30*event.detail;
            
            document.getElementById('idSavedShapeLibrary').scrollTop += wheelMovement;
            return;
        }
		var fovMAX = 80;
		var fovMIN = 1.05;

		if (event.wheelDelta)
                sceneWrapper.camera.fov -= event.wheelDeltaY * 0.014;
            else
                sceneWrapper.camera.fov += event.detail * .7;
		
		sceneWrapper.camera.fov = Math.max( Math.min( sceneWrapper.camera.fov, fovMAX ), fovMIN );
		sceneWrapper.camera.projectionMatrix = new THREE.Matrix4().makePerspective(sceneWrapper.camera.fov, window.innerWidth / window.innerHeight, sceneWrapper.camera.near, sceneWrapper.camera.far);
	}
	
	function onWindowResize() {
		that.currentWindowX = window.innerWidth / 4;
		that.currentWindowY = window.innerHeight / 4;

		sceneWrapper.updateCameraOnWindowResize();
		
		renderer.setSize( (window.innerWidth), (window.innerHeight) );
	}

	function onDocumentMouseMove( event ) {
		if (rotShape === true)
		{
			mouseX = event.clientX - that.currentWindowX;
			mouseY = event.clientY - that.currentWindowY;

			that.targetY = targetYRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.025;
			that.targetX = targetXRotationOnMouseDown + ( mouseY - mouseYOnMouseDown ) * 0.025; 
		}
		
		var projector = new THREE.Projector();
		var raycaster = new THREE.Raycaster();
		var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
		projector.unprojectVector( vector, sceneWrapper.camera );
		raycaster.set( sceneWrapper.camera.position, vector.sub( sceneWrapper.camera.position ).normalize() );
		var intersects = raycaster.intersectObjects( svgShape.children, true );
		
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
		rotShape = false;
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
	
	this.resetRotation = function()
	{
		this.targetX = 0;
		this.targetY = 0;
	}
	
	this.addMeshElement = function(domElement) {
		var demoSpace = document.getElementById('container');
		domElement.style.zIndex = '100';
		demoSpace.appendChild( domElement );
	};
}