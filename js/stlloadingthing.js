var loader = new THREE.STLLoader();
loader.addEventListener( 'load', function ( event ) {

	var geometry = event.content;
	var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x6F6F6F } ) ) ;
    sceneWrapper.scene.remove(currentMesh.figure);
	currentMesh.figure = mesh;
	sceneWrapper.scene.add(currentMesh.figure);
     } );
     loader.load( 'test.stl' );