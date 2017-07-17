var container, stats;

var camera, scene, renderer, orbitControl, delta;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var tweenParameters = {};

var jointValue;
var jointNum = 0;
var target = {};

var big_arm = 157;
var small_arm = 181;
var center_offset = 60;
var head_offset = 50;

var lastX, lastY, lastZ;

var loader = new THREE.ColladaLoader();
//只要模型加载完成，回调函数就会被调用
// loader.load("models/testRobot.dae", function(collada) {
loader.load("models/robot_n.dae", function(collada) {
	dae = collada.scene;

	dae.traverse( function ( child ) {

		if ( child instanceof THREE.Mesh ) {

			child.geometry.computeFaceNormals();
			child.material.shading = THREE.FlatShading;

		}

	} );

	dae.scale.x = dae.scale.y = dae.scale.z = 10.0;
	dae.updateMatrix();

	kinematics = collada.kinematics;

	init();

	animate();
});

function init() {
	//container = document.createElement( 'div' );
	container = document.getElementById('output');
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera(45
		, window.innerWidth / window.innerHeight
		, 1, 2000);
	camera.position.x = 2;
	camera.position.y = 2;
	camera.position.z = 10;
	//camera.lookAt(new THREE.Vector3(10, -10, -10));

	scene = new THREE.Scene();

	var ambient = new THREE.AmbientLight( 0x444444 );
	scene.add( ambient );

	scene.add(dae);

	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 0, 0, 1 ).normalize();
	scene.add( directionalLight );

	renderer = new THREE.WebGLRenderer();

	//renderer.setClearColor(0xEEEEEE);
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(window.innerWidth * 2 / 3, window.innerHeight);
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

	orbitControl = new THREE.OrbitControls(camera
		, renderer.domElement);
	orbitControl.autoRotate = false;
	// 自动旋转时钟相关 
	// var clock = new THREE.Clock();
	// var delta = clock.getDelta();

	stats = new Stats();
	container.appendChild(stats.dom);

	setupTween();
  
}

function animate() {
	requestAnimationFrame( animate );	
	render();

	stats.update();
	TWEEN.update();
}

function render() {

	// camera.position.x += ( mouseX - camera.position.x ) * .05;
	// camera.position.y += ( - mouseY - camera.position.y ) * .05;

	camera.lookAt( scene.position );

	//orbitControl.update(delta);

	renderer.render( scene, camera );

}

function setupTween() {

	//var duration = getRandomInt( 1000, 5000 );
	duration = 1000;
	jointNum = 0;
	lastX = 291;
	lastY = 0;
	lastZ = 157;

	for ( var i = 0; i < kinematics.joints.length; i ++ ) {

		var joint = kinematics.joints[ i ];

		var old = tweenParameters[ i ];
		// console.log(old);

		var position = old ? old : joint.zeroPosition;

		tweenParameters[ i ] = position;

		// target[ i ] = getRandomInt( joint.limits.min
		// 	, joint.limits.max );
		target[i] = 0;
		jointNum ++;
	}
	console.log(jointNum);
	jointValue = new Array(jointNum);

	// kinematicsTween = new TWEEN.Tween( 
	// 	tweenParameters ).to( target, duration ).easing( 
	// 	TWEEN.Easing.Quadratic.Out );
	kinematicsTween = new TWEEN.Tween( 
		tweenParameters ).to( target, duration ).easing( 
		TWEEN.Easing.Linear.None );

	kinematicsTween.onUpdate( function() {

		for ( var i = 0; i < kinematics.joints.length; i ++ ) {

			kinematics.setJointValue( i, this[ i ] );

		}

	} );

	kinematicsTween.start();

	//execute setupTween every duration
	//setTimeout( setupTween, duration );	
}

function getRandomInt( min, max ) {

	return Math.floor( Math.random() * ( max - min + 1 ) ) + min;

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth * 2 / 3, window.innerHeight );

}

function submit() {
	jointValue = new Array(jointNum);
	//joint1 & 4 & 5 & 9 : main joint
	jointValue[0] = document.getElementById('j1').value;	//joint1, base
	jointValue[1] = document.getElementById('j4').value;	//joint2
	jointValue[2] = 0;	//joint3
	jointValue[3] = document.getElementById('j4').value;	//joint4, big arm
	jointValue[4] = document.getElementById('j5').value;	//joint5, small arm
	jointValue[5] = document.getElementById('j5').value;	//joint6
	jointValue[6] = document.getElementById('j4').value;	//joint7
	jointValue[7] = 0;	//joint8
	jointValue[8] = - jointValue[3] - jointValue[4];	//joint9, head

	updateTween();
}

function plan() {
	var toDeg = 360 / (2 * Math.PI);

	var angle_base = jointValue[0];
	var angle_big = jointValue[3];
	var angle_small = jointValue[4];

	//正解过程。写错了，应该用弧度制代入三角函数。
	// var x = (Math.sin(-angle_big) * big_arm - (1 - Math.cos(angle_small)) * small_arm) * Math.cos(angle_base) + center_offset + head_offset;
	// var y = x * tan(angle_base);
	// var z = Math.sin(angle_small) * small_arm - (1 - Math.cos(angle_big)) * big_arm;

	var des_x = document.getElementById('dx').value;
	var des_y = document.getElementById('dy').value;
	var des_z = document.getElementById('dz').value;

	var arm_xy = Math.sqrt(Math.pow(des_x, 2) + Math.pow(des_y, 2)) - center_offset - head_offset;
	var arm_xyz = Math.sqrt(Math.pow(arm_xy, 2) + Math.pow(des_z, 2));
	var delta_arms = Math.acos((Math.pow(small_arm, 2) + Math.pow(big_arm, 2) - Math.pow(arm_xyz, 2)) / (2 * small_arm * big_arm)); //大臂小臂间夹角，弧度制
	var delta_big_arm = Math.acos((Math.pow(arm_xyz, 2) + Math.pow(big_arm, 2) - Math.pow(small_arm, 2)) / (2 * arm_xyz * big_arm))
			+ Math.acos((Math.pow(arm_xyz, 2) + Math.pow(arm_xy, 2) - Math.pow(des_z, 2)) / (2 * arm_xyz * arm_xy));
	var delta_rotation = Math.atan(des_y / des_x);

	//jointValue = new Array(jointNum);
	//joint1 & 4 & 5 & 9 : main joint
	jointValue[0] = delta_rotation * toDeg;	//joint1, base
	jointValue[1] = delta_big_arm * toDeg - 90;	//joint2
	jointValue[2] = 0;	//joint3
	jointValue[3] = jointValue[1];	//joint4, big arm
	//jointValue[4] = (delta_arms + delta_big_arm) * toDeg - 180;	//joint5, small arm
	jointValue[4] = delta_arms * toDeg - 90;	//joint5, small arm
	jointValue[5] = jointValue[4];	//joint6
	jointValue[6] = jointValue[1];	//joint7
	jointValue[7] = 0;	//joint8
	jointValue[8] = - jointValue[3] - jointValue[4];	//joint9, head

	updateTween();

}

function updateTween() {

	duration = 200;

	let times = 5;

	for (var j = 0; j < times; j ++) {

		for ( var i = 0; i < kinematics.joints.length; i ++ ) {

			var joint = kinematics.joints[ i ];

			var old = tweenParameters[ i ];
			// console.log(old);

			var position = old ? old : joint.zeroPosition;

			tweenParameters[ i ] = position;

			// target[ i ] = getRandomInt( joint.limits.min
			// 	, joint.limits.max );
			target[i] = jointValue[i] / times * (j + 1);

			//console.log(target[i]);

		}

		// kinematicsTween = new TWEEN.Tween( 
		// 	tweenParameters ).to( target, duration ).easing( 
		// 	TWEEN.Easing.Quadratic.Out );
		kinematicsTween = new TWEEN.Tween( 
			tweenParameters ).to( target, duration ).easing( 
			TWEEN.Easing.Linear.None );

		kinematicsTween.onUpdate( function() {

			for ( var i = 0; i < kinematics.joints.length; i ++ ) {

				//角度值，非弧度
				let base = this[0];
				let barm = this[3];
				let arms = this[4] + 90;
				//let head = this[8];	
				let toRad = 2 * Math.PI / 360;

				kinematics.setJointValue( i, this[ i ] );

				let x = (small_arm * Math.cos(toRad * (arms - 90 +barm))
					 - big_arm * Math.sin(toRad * barm) + head_offset + center_offset)
					 * Math.cos(toRad * base);
				let y = x * Math.tan(toRad * base);
				let z = small_arm * Math.sin(toRad * (arms - 90 +barm))
					 + big_arm * Math.cos(toRad * barm);

				document.getElementById('sx').value = x;
				document.getElementById('sy').value = y;
				document.getElementById('sz').value = z;
				document.getElementById('j1').value = base;
				document.getElementById('j4').value = barm;
				document.getElementById('j5').value = arms - 90;			

				let material = new THREE.LineBasicMaterial({color:0xFF0000});
				let geometry = new THREE.Geometry();
				geometry.vertices.push(new THREE.Vector3(-lastX / 100, -lastY / 100, lastZ / 100 +0.8));
	        	geometry.vertices.push(new THREE.Vector3(-x / 100, -y / 100, z /100 + 0.8));
	        	lastX = x;
	        	lastY = y;
	        	lastZ = z;
	        	let line = new THREE.Line(geometry,material);
	        	scene.add(line);
	        	renderer.render(scene,camera);
			}

		} );

		kinematicsTween.start();
	}

	//execute setupTween every duration
	//setTimeout( setupTween, duration );	
}




function print() {
	document.getElementById('dz').value = 0;
	plan();
	document.getElementById('dx').value += 1;
	plan();
}