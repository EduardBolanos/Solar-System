
var RunDemo = function (filemap)
{
	console.log("Initializing Demo");

	// get canvas, set dimensions to fill browser window
	var canvas = document.getElementById('the_canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// get WebGL context, confirm...
	var gl = canvas.getContext('webgl');

	if (!gl)
	{
		console.log('Browser is using experimental webgl.');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('This requires a browser which supports WebGL; Yours does not.');
	}

	// set background color and clear
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// set up culling via depth and back face, set front face to CCW
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	// create shaders
	var uvProgram = createProgram(
		gl, 
		filemap['uvVertShaderText'],
		filemap['uvFragShaderText']
	);

	var rgbProgram = createProgram(
		gl, 
		filemap['rgbVertShaderText'],
		filemap['rgbFragShaderText']
	);

	var skyboxProgram = createProgram(
		gl,
		filemap['skyboxVertShaderText'],
		filemap['skyboxFragShaderText']
	);

	// set up camera
	let aspect = canvas.width / canvas.height;
	let fieldOfView = Math.PI / 4;
	let nearClip = 0.01;
	let farClip = 1000.0;
	let camspeed = 1.2;
	let camturn = 0.015;
	var camera = new FPSCamera(
		gl,
		[uvProgram, rgbProgram],
		aspect,
		fieldOfView,
		nearClip,
		farClip,
		camspeed,
		camturn
	);
	camera.translate(new Vector(300, 0, 0));
	camera.lookAt(new Vector(0,0,0), new Vector(0, 1, 0));

	// set ambient light parameters
	var ambientLight = new Vector(1.0, 1.0, 1.0);

	// set up point lights' parameters
	var pointLightPosition = new Vector(0, 0, 0);
	var pointLightDiffuse = new Vector(1, 1, 4);
	var pointLightSpecular = new Vector(1, 4, 1);

	// use light manager to create lights
	var lightManager = new LightManager(gl, [rgbProgram, uvProgram], ambientLight);
	lightManager.addPointLight(pointLightPosition, pointLightDiffuse, pointLightSpecular);
	lightManager.addPointLight(pointLightPosition, pointLightDiffuse, pointLightSpecular);
	lightManager.update();

	// set up directional light's parameters and create directional light
	var directionalLightDirection = new Vector(1, -4, 2);
	var directionalLightDiffuse = new Vector(0.4, 0.7, 0.6);
	var directionalLightSpecular = new Vector(0.4, 0.7, 0.6);
	lightManager.addDirectionalLight(directionalLightDirection, directionalLightDiffuse, directionalLightSpecular);
	lightManager.update();
	//////////////////////////////////////////////////////////////////////////////////////

	// Importing the sun and all the planets

	var sun = ThreeJSToUVMesh(filemap['sunJSON'], 'sun-texture', gl, uvProgram, true);
	var mercury = ThreeJSToUVMesh(filemap['mercuryJSON'], 'mercury-texture', gl, uvProgram, true);
	var venus = ThreeJSToUVMesh(filemap['venusJSON'], 'venus-texture', gl, uvProgram, true);
	var earth = ThreeJSToUVMesh(filemap['earthJSON'], 'earth-texture', gl, uvProgram, true);
	var mars = ThreeJSToUVMesh(filemap['marsJSON'], 'mars-texture', gl, uvProgram, true);
	var jupiter = ThreeJSToUVMesh(filemap['jupiterJSON'], 'jupiter-texture', gl, uvProgram, true)
	var saturn = ThreeJSToUVMesh(filemap['saturnJSON'], 'saturn-texture', gl, uvProgram, true);
	var uranus = ThreeJSToUVMesh(filemap['uranusJSON'], 'uranus-texture', gl, uvProgram, true);
	var neptune = ThreeJSToUVMesh(filemap['neptuneJSON'], 'neptune-texture', gl, uvProgram, true);
	var pluto = ThreeJSToUVMesh(filemap['plutoJSON'], 'pluto-texture', gl, uvProgram, true);
	var earthmoon = ThreeJSToUVMesh(filemap['earthmoonJSON'], 'earthmoon-texture', gl, uvProgram, true);
	// Importing the moons

	// This is the old distances of the planets

	// mercury.translate(new Vector(25, 0, 0));
	// venus.translate(new Vector(35, 0, 0));
	// earth.translate(new Vector(45, 0, 0));
	// mars.translate(new Vector(60, 0, 0));
	// jupiter.translate(new Vector(90, 0, 0));
	// saturn.translate(new Vector(120, 0, 0));
	// uranus.translate(new Vector(150, 0, 0));
	// neptune.translate(new Vector(180, 0, 0));
	// pluto.translate(new Vector(210, 0, 0));

	// New distances of the planets 

	mercury.translate(new Vector(25, 0, 0));
	venus.translate(new Vector(55, 0, 0));
	earth.translate(new Vector(85, 0, 0));
	mars.translate(new Vector(110, 0, 0));
	jupiter.translate(new Vector(130, 0, 0));
	saturn.translate(new Vector(160, 0, 0));
	uranus.translate(new Vector(210, 0, 0));
	neptune.translate(new Vector(250, 0, 0));
	pluto.translate(new Vector(290, 0, 0));
	earthmoon.translate(new Vector(95,0,0));

	// skybox aka the universe
	var skyboxImageIDs = [
		'skybox-right',
		'skybox-left',
		'skybox-top',
		'skybox-bottom',
		'skybox-back',
		'skybox-front'
	];
	var skybox = new Skybox(gl, skyboxProgram, skyboxImageIDs, camera);

	// textured earth material properties easter egg
	// var earthDiffuse = 0.7;
	// var earthSpecular = 0.3;
	// var earthAmbient = 0.2;
	// var earthShininess = 0.1;

	// // create textured earth (sphere)
	// uvEarth = new UVMesh(
	// 	gl,
	// 	uvProgram,
	// 	Sphere.positionArray(30,30),
	// 	Sphere.indexArray(30,30),
	// 	Sphere.positionArray(30,30),
	// 	Sphere.uvArray(30,30),
	// 	'earth-texture',
	// 	false,
	// 	earthDiffuse,
	// 	earthSpecular,
	// 	earthAmbient,
	// 	earthShininess
	// );

	// uvEarth.translate(new Vector(2, 0, 0));


	// set up some arbitrary constants for motion
	var startTime = Date.now();
	var time;
	let k_theta = 1/1000;
	let k_alpha = 1/3101;
	let hr = 5;
	let vr = 2;
	var theta;
	var alpha;
	var cosTheta;
	var lightPosition;// = new Vector(2, 0, 1.5);

	// some arbitrary constants for origins and orbits of the planets
	var angle = Math.PI / 100;
	var origin = new Vector();
	var orbit = new Quaternion(angle/2, 0, 1, 0, true);
	var pos = new Vector(0,0,0);
	var earthmoonorbit = new Quaternion(angle/2, 1, 1, 1);
    

	// moon orbits 
	// change camera startup
	// shadow mapping maybe

	var main = function()
	{
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

		time = Date.now() - startTime;
		theta = time * k_theta;
		alpha = time * k_alpha;
		cosTheta = Math.cos(theta);

		lightPosition = new Vector(
			hr*cosTheta*Math.sin(alpha),
			vr*Math.sin(2*theta),
			vr*cosTheta*Math.cos(alpha)
		);

		//lightManager.pointLights[0].setPosition(lightPosition);
		//lightManager.pointLights[1].setPosition(lightPosition.inverse())
		//lightManager.update();

		camera.update();

		sun.draw();

		mercury.rotate(new Quaternion(Math.PI/1000, 0, 1, 0));
		mercury.rotateAround(origin, new Quaternion(angle/2, 0, 1, 0, true));
		mercury.draw();

		venus.rotate(new Quaternion(Math.PI/1000, 0, 1, 0));
		venus.rotateAround(origin, new Quaternion(angle/2, 0, 0.8, 0, true));
		venus.draw();

		earth.rotate(new Quaternion(Math.PI/1000, 0, 1, 0));
		earth.rotateAround(origin, new Quaternion(angle/2, 0, 0.7, 0, true));
		earth.draw();

		earthmoon.rotateAround(origin, new Quaternion(angle/2, 0, 0.7, 0, true));
    	earthmoon.rotateAround(earth.position, earthmoonorbit);
    	earthmoon.draw();

		mars.rotate(new Quaternion(Math.PI/1000, 0, 1, 0));
		mars.rotateAround(origin, new Quaternion(angle/2, 0, 0.6, 0, true));
		mars.draw();

		jupiter.rotate(new Quaternion(Math.PI/1000, 0, 1, 0));
		jupiter.rotateAround(origin, new Quaternion(angle/2, 0, 0.5, 0, true));
		jupiter.draw();

		saturn.rotate(new Quaternion(Math.PI/1000, 0, 1, 0));
		saturn.rotateAround(origin, new Quaternion(angle/2, 0, 0.4, 0, true));
		saturn.draw();

		uranus.rotate(new Quaternion(Math.PI/1000, 0, 1, 0));
		uranus.rotateAround(origin, new Quaternion(angle/2, 0, 0.23, 0, true));
		uranus.draw();

		neptune.rotate(new Quaternion(Math.PI/1000, 0, 1, 0));
		neptune.rotateAround(origin, new Quaternion(angle/2, 0, 0.2, 0, true));
		neptune.draw();

		pluto.rotate(new Quaternion(Math.PI/1000, 0, 1, 0));
		pluto.rotateAround(origin, new Quaternion(angle/2, 0, 0.1, 0, true));
		pluto.draw();

		skybox.draw();

		requestAnimationFrame(main);
	}
	requestAnimationFrame(main);
}

var InitDemo = function()
{
	// locations of imported files
	var urls = [
		'shaders/vert.uv.glsl',
		'shaders/frag.uv.glsl',
		'shaders/vert.rgb.glsl',
		'shaders/frag.rgb.glsl',
		'shaders/vert.skybox.glsl',
		'shaders/frag.skybox.glsl',
		'models/sun.json',
		'models/mercury.json',
		'models/venus.json',
		'models/earth.json',
		'models/mars.json',
		'models/jupiter.json',
		'models/saturn.json',
		'models/uranus.json',
		'models/neptune.json',
		'models/pluto.json',
		'models/earthmoon.json'
	];

	// imported file keys for file key-value map, respective to locations
	var names = [
		'uvVertShaderText',
		'uvFragShaderText',
		'rgbVertShaderText',
		'rgbFragShaderText',
		'skyboxVertShaderText',
		'skyboxFragShaderText',
		'sunJSON',
		'mercuryJSON',
		'venusJSON',
		'earthJSON',
		'marsJSON',
		'jupiterJSON',
		'saturnJSON',
		'uranusJSON',
		'neptuneJSON',
		'plutoJSON',
		'earthmoonJSON'
	];

	// file types, respective to locations (text or JSON)
	var types = [
		'text',
		'text',
		'text',
		'text',
		'text',
		'text',
		'json',
		'json',
		'json',
		'json',
		'json',
		'json',
		'json',
		'json',
		'json',
		'json',
		'json',
		'json'
	];
	
	var importer = new resourceImporter(urls, names, types, RunDemo);
}