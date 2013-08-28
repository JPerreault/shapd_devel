var INTERSECTED, HIGHLIGHTED;

init();

function init() {
	svgShape = new THREE.Object3D();

		// var sliderControls = document.createElement('div');
		// sliderControls.id = 'shapeSlidersContainer';
		// sliderControls.style.top = '10px';
		// sliderControls.style.left = '5px';
		// sliderControls.style.position = 'absolute';
		// sliderControls.style.zIndex = '1000';
		// document.body.appendChild(sliderControls);
		
		// var slider1 = document.createElement('div');
		// slider1.id = 'extrusionSlider';
		// slider1.style.width = '180px';
		// slider1.className = 'menuHeader';
		// slider1.style.position = 'relative';
		// slider1.style.display = 'inline-block';
		// slider1.style.marginTop = '12px';
		// slider1.style.marginLeft = '20px';
		// slider1.style.cssFloat = 'right';
		// sliderControls.appendChild(slider1);
	
	// $(function() {
		// $( "#extrusionSlider" ).slider({
			// value: 1,
			// min: 1,
			// max: 100,
			// step: 1,
			// slide: function(event, ui){
				// if (typeof INTERSECTED !== 'undefined' && INTERSECTED !== 'null')
				// {
					// shapes[INTERSECTED.svgShape.idNumber].extrudeSettings.amount = ui.value;
					// updateScene();
				// }
			// }
		// })});
}