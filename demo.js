
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
	let camspeed = 5;
	let camturn = 0.03;
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
	camera.translate(new Vector(500, 0, 0));
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
	var saturnring = ThreeJSToUVMesh(filemap['saturnringJSON'], 'saturn-texture', gl, uvProgram, true);

	// Importing the moons

	var earthmoon = ThreeJSToUVMesh(filemap['earthmoonJSON'], 'earthmoon-texture', gl, uvProgram, true);
	var marsmoon1 = ThreeJSToUVMesh(filemap['smallmoonJSON'], 'moon1-texture', gl, uvProgram, true);
	var marsmoon2 = ThreeJSToUVMesh(filemap['smallmoonJSON'], 'moon2-texture', gl, uvProgram, true);

	var jupitermoon1 =  ThreeJSToUVMesh(filemap['smallmoonJSON'], 'moon4-texture', gl, uvProgram, true);
	var jupitermoon2 =  ThreeJSToUVMesh(filemap['mooncolorJSON'], 'mercury-texture', gl, uvProgram, true);
	var jupitermoon3 =  ThreeJSToUVMesh(filemap['mooncoloriceJSON'], 'pluto-texture', gl, uvProgram, true);
	var jupitermoon4 =  ThreeJSToUVMesh(filemap['moontwoJSON'], 'moon2-texture', gl, uvProgram, true);
	var jupitermoon5 =  ThreeJSToUVMesh(filemap['smallmoonJSON'], 'moon4-texture', gl, uvProgram, true);
	var jupitermoon6 =  ThreeJSToUVMesh(filemap['smallmoonJSON'], 'io-texture', gl, uvProgram, true);

	var saturnmoon1 =  ThreeJSToUVMesh(filemap['smallmoonJSON'], 'pluto-texture', gl, uvProgram, true);
	var saturnmoon2 =  ThreeJSToUVMesh(filemap['earthmoonJSON'], 'moon1-texture', gl, uvProgram, true);
	var saturnmoon3 =  ThreeJSToUVMesh(filemap['mooncolorJSON'], 'mercury-texture', gl, uvProgram, true);
	var saturnmoon4 =  ThreeJSToUVMesh(filemap['mooncolorJSON'], 'cody-texture', gl, uvProgram, true);
	var saturnmoon5 =  ThreeJSToUVMesh(filemap['smallmoonJSON'], 'uranus-texture', gl, uvProgram, true);
	var saturnmoon6 =  ThreeJSToUVMesh(filemap['moontwoJSON'], 'pluto-texture', gl, uvProgram, true);

	var uranusmoon1 =  ThreeJSToUVMesh(filemap['smallmoonJSON'], 'pluto-texture', gl, uvProgram, true);
	var uranusmoon2 =  ThreeJSToUVMesh(filemap['earthmoonJSON'], 'moon1-texture', gl, uvProgram, true);
	var uranusmoon3 =  ThreeJSToUVMesh(filemap['mooncolorJSON'], 'mercury-texture', gl, uvProgram, true);
	var uranusmoon4 =  ThreeJSToUVMesh(filemap['mooncolorJSON'], 'cody-texture', gl, uvProgram, true);
	var uranusmoon5 =  ThreeJSToUVMesh(filemap['smallmoonJSON'], 'uranus-texture', gl, uvProgram, true);

	var neptunemoon1 = ThreeJSToUVMesh(filemap['moonfourJSON'], 'earthmoon-texture', gl, uvProgram, true);
	var neptunemoon2 = ThreeJSToUVMesh(filemap['moonfourJSON'], 'earthmoon-texture', gl, uvProgram, true);
	var neptunemoon3 = ThreeJSToUVMesh(filemap['moonfourJSON'], 'earthmoon-texture', gl, uvProgram, true);
	var neptunemoon4 = ThreeJSToUVMesh(filemap['moonfourJSON'], 'earthmoon-texture', gl, uvProgram, true);

	var plutomoon1 = ThreeJSToUVMesh(filemap['smallmoonJSON'], 'moon1-texture', gl, uvProgram, true);
	var plutomoon2 = ThreeJSToUVMesh(filemap['smallmoonJSON'], 'moon4-texture', gl, uvProgram, true);
	var plutomoon5 = ThreeJSToUVMesh(filemap['smallmoonJSON'], 'moon2-texture', gl, uvProgram, true);

	// Distances of the planets and moons

	mercury.translate(new Vector(25, 0, 0));

	venus.translate(new Vector(55, 0, 0));

	earth.translate(new Vector(85, 0, 0));
	earthmoon.translate(new Vector(95,0,0));

	mars.translate(new Vector(110, 0, 0));
	marsmoon1.translate(new Vector(115, 0, 0));
	marsmoon2.translate(new Vector(103, 0, 0));
	
	jupiter.translate(new Vector(230, 0, 0));
	jupitermoon1.translate(new Vector(250, 0, 3));
	jupitermoon2.translate(new Vector(210, 0, -3));
	jupitermoon3.translate(new Vector(233, 0, 20));
	jupitermoon4.translate(new Vector(227, 0, -20));
	jupitermoon5.translate(new Vector(255, 0, 7));
	jupitermoon6.translate(new Vector(247, 0, -7));

	saturn.translate(new Vector(320, 0, 0));
	saturnring.translate(new Vector(320, 0, 0));
	saturnmoon1.translate(new Vector(310, 0, 4));
	saturnmoon2.translate(new Vector(330, 0, -4));
	saturnmoon3.translate(new Vector(320, 20, 0));
	saturnmoon4.translate(new Vector(315, 0, -9));
	saturnmoon5.translate(new Vector(315, 0, 9));
	saturnmoon6.translate(new Vector(320, -20, 0));

	uranus.translate(new Vector(390, 0, 0));
	uranusmoon1.translate(new Vector(380, 0, 3));
	uranusmoon2.translate(new Vector(397, 0, 5));
	uranusmoon3.translate(new Vector(380, 0, -3));
	uranusmoon4.translate(new Vector(397, 0, -5));
	uranusmoon5.translate(new Vector(390, 12, 0));

	neptune.translate(new Vector(490, 0, 0));
	neptunemoon1.translate(new Vector(500, 0, 0));
	neptunemoon2.translate(new Vector(492, 0, 12));
	neptunemoon3.translate(new Vector(483, 12, 0));
	neptunemoon4.translate(new Vector(490, -12, 3));

	pluto.translate(new Vector(515, 0, 0));
	plutomoon1.translate(new Vector(515, 0, 3));
	plutomoon2.translate(new Vector(518, 0, 0));
	plutomoon5.translate(new Vector(521, 0, 0));

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
	var pos = new Vector(0,0,0);
	var earthmoonorbit = new Quaternion(angle/2, 1, 1, 1);
    

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
		mercury.rotateAround(origin, new Quaternion(angle*(365/88), 0, 1, 0));
		mercury.draw();

		venus.rotate(new Quaternion(Math.PI/1000, 0, 1, 0));
		venus.rotateAround(origin, new Quaternion(angle*(365/225), 0, 1, 0));
		venus.draw();

		earth.rotate(new Quaternion(Math.PI/1000, 0, 1, 0));
		earth.rotateAround(origin, new Quaternion(angle, 0, 1, 0));
		earth.draw();

		earthmoon.rotateAround(origin, new Quaternion(angle, 0, 1, 0));
    	earthmoon.rotateAround(earth.position, earthmoonorbit);
    	earthmoon.draw();

		mars.rotate(new Quaternion(Math.PI/1000, 0, 1, 0));
		mars.rotateAround(origin, new Quaternion(angle*(365/687), 0, 1, 0));
		mars.draw();

		marsmoon1.rotateAround(origin, new Quaternion(angle*(365/687), 0, 1, 0));
		marsmoon1.rotateAround(mars.position, earthmoonorbit);
		marsmoon1.draw();

		marsmoon2.rotateAround(origin, new Quaternion(angle*(365/687), 0, 1, 0));
		marsmoon2.rotateAround(mars.position, earthmoonorbit);
		marsmoon2.draw();

		jupiter.rotate(new Quaternion(Math.PI/1000, 0, 1, 0));
		jupiter.rotateAround(origin, new Quaternion(angle/12, 0, 1, 0));
		jupiter.draw();

		jupitermoon1.rotateAround(origin, new Quaternion(angle/12, 0, 1, 0));
		jupitermoon1.rotateAround(jupiter.position, earthmoonorbit);
		jupitermoon1.draw();

		jupitermoon2.rotateAround(origin, new Quaternion(angle/12, 0, 1, 0));
		jupitermoon2.rotateAround(jupiter.position, earthmoonorbit);
		jupitermoon2.draw();

		jupitermoon3.rotateAround(origin, new Quaternion(angle/12, 0, 1, 0));
		jupitermoon3.rotateAround(jupiter.position, earthmoonorbit);
		jupitermoon3.draw();

		jupitermoon4.rotateAround(origin, new Quaternion(angle/12, 0, 1, 0));
		jupitermoon4.rotateAround(jupiter.position, earthmoonorbit);
		jupitermoon4.draw();

		jupitermoon5.rotateAround(origin, new Quaternion(angle/12, 0, 1, 0));
		jupitermoon5.rotateAround(jupiter.position, earthmoonorbit);
		jupitermoon5.draw();

		jupitermoon6.rotateAround(origin, new Quaternion(angle/12, 0, 1, 0));
		jupitermoon6.rotateAround(jupiter.position, earthmoonorbit);
		jupitermoon6.draw();

		saturn.rotate(new Quaternion(Math.PI/1000, 0, 1, 0));
		saturn.rotateAround(origin, new Quaternion(angle/29, 0, 1, 0));
		saturn.draw();

		saturnring.rotateAround(origin, new Quaternion(angle/29, 0, 1, 0));
		saturnring.draw();

		saturnmoon1.rotateAround(origin, new Quaternion(angle/29, 0, 1, 0));
		saturnmoon1.rotateAround(saturn.position, earthmoonorbit);
		saturnmoon1.draw();

		saturnmoon2.rotateAround(origin, new Quaternion(angle/29, 0, 1, 0));
		saturnmoon2.rotateAround(saturn.position, earthmoonorbit);
		saturnmoon2.draw();

		saturnmoon3.rotateAround(origin, new Quaternion(angle/29, 0, 1, 0));
		saturnmoon3.rotateAround(saturn.position, earthmoonorbit);
		saturnmoon3.draw();

		saturnmoon4.rotateAround(origin, new Quaternion(angle/29, 0, 1, 0));
		saturnmoon4.rotateAround(saturn.position, earthmoonorbit);
		saturnmoon4.draw();

		saturnmoon5.rotateAround(origin, new Quaternion(angle/29, 0, 1, 0));
		saturnmoon5.rotateAround(saturn.position, earthmoonorbit);
		saturnmoon5.draw();

		saturnmoon6.rotateAround(origin, new Quaternion(angle/29, 0, 1, 0));
		saturnmoon6.rotateAround(saturn.position, earthmoonorbit);
		saturnmoon6.draw();

		uranus.rotate(new Quaternion(Math.PI/1000, 0, 1, 0));
		uranus.rotateAround(origin, new Quaternion(angle/84, 0, 1, 0));
		uranus.draw();

		uranusmoon1.rotateAround(origin, new Quaternion(angle/84, 0, 1, 0));
		uranusmoon1.rotateAround(uranus.position, earthmoonorbit);
		uranusmoon1.draw();

		uranusmoon2.rotateAround(origin, new Quaternion(angle/84, 0, 1, 0));
		uranusmoon2.rotateAround(uranus.position, earthmoonorbit);
		uranusmoon2.draw();

		uranusmoon3.rotateAround(origin, new Quaternion(angle/84, 0, 1, 0));
		uranusmoon3.rotateAround(uranus.position, earthmoonorbit);
		uranusmoon3.draw();

		uranusmoon4.rotateAround(origin, new Quaternion(angle/84, 0, 1, 0));
		uranusmoon4.rotateAround(uranus.position, earthmoonorbit);
		uranusmoon4.draw();

		uranusmoon5.rotateAround(origin, new Quaternion(angle/84, 0, 1, 0));
		uranusmoon5.rotateAround(uranus.position, earthmoonorbit);
		uranusmoon5.draw();

		neptune.rotate(new Quaternion(Math.PI/1000, 0, 1, 0));
		neptune.rotateAround(origin, new Quaternion(angle/165, 0, 1, 0));
		neptune.draw();

		neptunemoon1.rotateAround(origin, new Quaternion(angle/165, 0, 1, 0));
		neptunemoon1.rotateAround(neptune.position, earthmoonorbit);
		neptunemoon1.draw();

		neptunemoon2.rotateAround(origin, new Quaternion(angle/165, 0, 1, 0));
		neptunemoon2.rotateAround(neptune.position, earthmoonorbit);
		neptunemoon2.draw();

		neptunemoon3.rotateAround(origin, new Quaternion(angle/165, 0, 1, 0));
		neptunemoon3.rotateAround(neptune.position, earthmoonorbit);
		neptunemoon3.draw();

		neptunemoon4.rotateAround(origin, new Quaternion(angle/165, 0, 1, 0));
		neptunemoon4.rotateAround(neptune.position, earthmoonorbit);
		neptunemoon4.draw();

		pluto.rotate(new Quaternion(Math.PI/1000, 0, 1, 0));
		pluto.rotateAround(origin, new Quaternion(angle/248, 0, 1, 0));
		pluto.draw();

		plutomoon1.rotateAround(origin, new Quaternion(angle/248, 0, 1, 0));
		plutomoon1.rotateAround(pluto.position, new Quaternion(angle/2, 2, 1, 0));
		plutomoon1.draw();

		plutomoon2.rotateAround(origin, new Quaternion(angle/248, 0, 1, 0));
		plutomoon2.rotateAround(pluto.position, new Quaternion(angle/2, 2, 0, 1));
		plutomoon2.draw();

		plutomoon5.rotateAround(origin, new Quaternion(angle/248, 0, 1, 0));
		plutomoon5.rotateAround(pluto.position, new Quaternion(angle/2, 1, 2, 1));
		plutomoon5.draw();

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
		'models/earthmoon.json',
		'models/saturnring.json',
		'models/mooncolorsmall.json',
		'models/moonfour.json',
		'models/mooncolor.json',
		'models/mooncolorice.json',
		'models/moontwo.json'
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
		'earthmoonJSON',
		'saturnringJSON',
		'smallmoonJSON',
		'moonfourJSON',
		'mooncolorJSON',
		'mooncoloriceJSON',
		'moontwoJSON',
		'moonfourJSON'
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