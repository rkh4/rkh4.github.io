//-------------------------------------------------------------
//------------------------INITIALISATION-----------------------
//-------------------------------------------------------------
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth-5, window.innerHeight-5);
renderer.setClearColor(0x778899, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = false;
renderer.shadowMapTye = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

var doors = [];
var KeysPressed = [];

//PointerLockControls
var blocker = document.getElementById('blocker');
var instructions = document.getElementById( 'instructions' );
var interact = document.getElementById( 'interact' );
var controlsEnabled = false;

//Raycaster
var cursorPos = new THREE.Vector2();
function onMouseMove(mouseMove){
    cursorPos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	cursorPos.y = - ( event.clientY / window.innerHeight ) * 2 + 1;}
var raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, 50);

//Enabling PointerLockControls and checking users browser is compatible
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
if ( havePointerLock ) {
    
    var element = document.body;
    var pointerlockchange = function ( event ) {

        if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
            controlsEnabled = true;
            controls.enabled = true;
            blocker.style.display = 'none';
        } else {
            controls.enabled = false;
            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';
            instructions.style.display = '';
        }
    };

    var pointerlockerror = function ( event ) {
        instructions.style.display = '';
    };

    // Hook pointer lock state change events
    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

    instructions.addEventListener( 'click', function ( event ) {
        instructions.style.display = 'none';

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

        if ( /Firefox/i.test( navigator.userAgent ) ) {
            var fullscreenchange = function ( event ) {
                if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
                    document.removeEventListener( 'fullscreenchange', fullscreenchange );
                    document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
                    element.requestPointerLock();
                }
            };

            document.addEventListener( 'fullscreenchange', fullscreenchange, false );
            document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
            element.requestFullscreen();
        } else {
            element.requestPointerLock();
        }
    }, false );
} else {
    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}

// Hook mouse move events
document.addEventListener("mousemove", this.moveCallback, false);

//Scene and camera definition
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight, 0.1, 1000);
var controls = new THREE.PointerLockControls( camera );
controls.getObject().position.set(0, 18, 70);
scene.add(controls.getObject());


//-------------------------------------------------------------
//--------------------------LIGHTS-----------------------------
//-------------------------------------------------------------
var ambLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambLight);

var porchLight = new THREE.SpotLight(0xffffff, 2, 100, 1, 0.25);
porchLight.position.set(0, 25, 85);
porchLight.shadowMapWidth = 2048;
porchLight.shadowMapHeight = 2048;
porchLight.castShadow = true;
porchLight.target.position.set(0,0,85);
porchLight.target.updateMatrixWorld();
scene.add(porchLight);

var studyLight = new THREE.SpotLight(0xffffff, 1, 100, 1.4, 0.5);
studyLight.position.set(55,24,45);
studyLight.castShadow = true;
studyLight.target.position.set(55,0,45);
studyLight.target.updateMatrixWorld();
studyLight.shadowMapWidth = 2048;
studyLight.shadowMapHeight = 2048;
scene.add(studyLight);

var hallwayLight = new THREE.SpotLight(0xffffff, 1, 100, 1.4, 0.5);
hallwayLight.position.set(-10,24,10);
hallwayLight.target.position.set(-10,0,10);
hallwayLight.castShadow = true;
hallwayLight.shadowMapWidth = 2048;
hallwayLight.shadowMapHeight = 2048;
hallwayLight.target.updateMatrixWorld();
scene.add(hallwayLight);

var diningLight = hallwayLight.clone();
diningLight.position.set(-55,24,55);
diningLight.target.position.set(-55,0,55);
diningLight.target.updateMatrixWorld();
diningLight.shadowMapWidth = 4096;
diningLight.shadowMapHeight = 4096;
scene.add(diningLight);

var toiletLight = hallwayLight.clone();
toiletLight.position.set(-50, 24, 12);
toiletLight.target.position.set(-50, 0, 12);
toiletLight.target.updateMatrixWorld();
toiletLight.shadowMapWidth = 4096;
toiletLight.shadowMapHeight = 4096;
scene.add(toiletLight);

//Living room light
var tvLight =  new THREE.SpotLight(0xffffff, 3, 100, 1, 0.5);
tvLight.position.set(70, 10, -72);
tvLight.target.position.set(58, 10, -50);
tvLight.target.updateMatrixWorld();
tvLight.castShadow = true;
tvLight.shadowMapWidth = 4096;
tvLight.shadowMapHeight = 4096;
scene.add(tvLight);

//kitchenLight
var kitchenLight = hallwayLight.clone();
kitchenLight.position.set(-50, 24, -45);
kitchenLight.target.position.set(-50, 0, -45);
kitchenLight.target.updateMatrixWorld();
kitchenLight.shadowMapWidth = 4096;
kitchenLight.shadowMapHeight = 4096;
scene.add(kitchenLight);


//-------------------------------------------------------------
//-------------------------OBJECTS-----------------------------
//-------------------------------------------------------------

//==================FLOORS====================

//Floor Textures
var floorTexture = THREE.ImageUtils.loadTexture('images/carpet3.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(10,10);

var tileTexture = THREE.ImageUtils.loadTexture('images/tile.png');
tileTexture.wrapS = tileTexture.wrapT = THREE.RepeatWrapping;
tileTexture.repeat.set(10,6);

var bathTileTexture = THREE.ImageUtils.loadTexture('images/bathroomTile.png');
bathTileTexture.wrapS = bathTileTexture.wrapT = THREE.RepeatWrapping;
bathTileTexture.repeat.set(25,15);

//Main carpetted floor
var floorGeo = new THREE.PlaneGeometry(160, 162, 5, 8);
var floorMat = new THREE.MeshPhongMaterial({map: floorTexture, side: THREE.DoubleSide});
var bottomFloor = new THREE.Mesh(floorGeo, floorMat);
bottomFloor.rotation.x = Math.PI * 90 / 180;
bottomFloor.receiveShadow = true;

//Kitchen Floor
var kitchenFloor = new THREE.Mesh(new THREE.PlaneGeometry(95, 70, 5, 8), new THREE.MeshPhongMaterial({map: tileTexture, side: THREE.DoubleSide, shininess: 50}));
kitchenFloor.position.set(-32, 0.1, -45);
kitchenFloor.rotation.x = Math.PI * 90 / 180;
kitchenFloor.receiveShadow = true;

//Bathroom Floor
var bathroomFloor = new THREE.Mesh(new THREE.PlaneGeometry(60, 40, 5, 8), new THREE.MeshPhongMaterial({map: bathTileTexture, side: THREE.DoubleSide, shininess: 50}));
bathroomFloor.position.set(-50, 0.1, 10);
bathroomFloor.rotation.x = Math.PI * 90 / 180;
bathroomFloor.receiveShadow = true;

scene.add(bottomFloor, kitchenFloor, bathroomFloor);



//==================DOORS====================

//Front Door [0]
var frontLeft = new THREE.Mesh(new THREE.CubeGeometry(3,20,1).translate(1,0,0), new THREE.MeshPhongMaterial({color:0xffffff}));
frontLeft.position.set(20,10,0);
var frontRight = frontLeft.clone();
frontRight.position.set(9,0,0);
frontLeft.add(frontRight);
var bottom = new THREE.Mesh(new THREE.CubeGeometry(6,4,1), new THREE.MeshPhongMaterial({color:0xffffff}));
bottom.position.set(5.5,-8,0);
frontLeft.add(bottom);
var glassPanel1 = new THREE.Mesh(new THREE.CubeGeometry(6,12,1), new THREE.MeshPhongMaterial({color: 0x8DEEEE, transparent: true, opacity: 0.8}));
glassPanel1.position.set(5.5, 0, 0);
frontLeft.add(glassPanel1);
var topPanel = new THREE.Mesh(new THREE.CubeGeometry(6,4,1), new THREE.MeshPhongMaterial({color: 0xffffff}));
topPanel.position.set(5.5, 8, 0);
frontLeft.add(topPanel);
frontLeft.position.set(-5.5, 10, 80);
bottom.castShadow = true;
topPanel.castShadow = true;
frontRight.castShadow = true;
frontRight.castShadow = true;
frontLeft.name = "0";
frontLeft.open = "closed";
doors.push(frontLeft);

var doorMaterial = new THREE.MeshFaceMaterial([
                new THREE.MeshPhongMaterial({color: 0xffffff}),
                new THREE.MeshPhongMaterial({color: 0xffffff}),
                new THREE.MeshPhongMaterial({color: 0xffffff}),
                new THREE.MeshPhongMaterial({color: 0xffffff}),
                new THREE.MeshPhongMaterial({map:THREE.ImageUtils.loadTexture('images/door.png')}), //Front
                new THREE.MeshPhongMaterial({map:THREE.ImageUtils.loadTexture('images/doorFlip.png')}) //Back
              ]);

//Bedroom Door [1]
var bedroomDoor = new THREE.Mesh(new THREE.CubeGeometry(12, 20, 1).translate(5.5,0,0), doorMaterial);
bedroomDoor.rotation.y = Math.PI * 90/180;
bedroomDoor.position.set(32.5, 10, 71.5);
bedroomDoor.name = "1";
bedroomDoor.open = "closed";
doors.push(bedroomDoor);

// Living room to front corridor [2]
var livingRoomDoor1 = new THREE.Mesh(new THREE.CubeGeometry(12, 20, 1).translate(5.5,0,0), doorMaterial);
livingRoomDoor1.position.set(16, 10, 49.5);
livingRoomDoor1.name = "2";
livingRoomDoor1.open = "closed";
doors.push(livingRoomDoor1);

//Dining room door [3]
var diningRoomDoor = livingRoomDoor1.clone();
diningRoomDoor.rotation.y += Math.PI * 90/180;
diningRoomDoor.position.set(-20, 10, 48.5);
diningRoomDoor.name = "3";
diningRoomDoor.open = "closed";
doors.push(diningRoomDoor);

//Downstairs toilet door [4]
var toiletDoor = livingRoomDoor1.clone();
toiletDoor.rotation.y += Math.PI * 270/180;
toiletDoor.position.set(-20, 10, 10);
toiletDoor.name = "4";
toiletDoor.open = "closed";
doors.push(toiletDoor);

//Hallway to Kitchen Door [5]
var kitchen01 = livingRoomDoor1.clone();
kitchen01.position.set(-16.5, 10, -10);
kitchen01.name = "5";
kitchen01.open = "closed";
doors.push(kitchen01);

//Kitchen to outside door
var backDoor = frontLeft.clone();
backDoor.position.set(-5, 10, -80);
backDoor.name = "6";
backDoor.open = "closed";
doors.push(backDoor);


//==================WALLS====================

var wallTexture = THREE.ImageUtils.loadTexture('images/wallPlaster.jpg');
wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(6,2);

var outerWallMat = new THREE.MeshFaceMaterial([
                        new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('images/bricks.jpg')}),
                        new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('images/bricks.jpg')}),
                        new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('images/bricks.jpg')}),
                        new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('images/bricks.jpg')}),
                        new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('images/bricks.jpg')}), //Front
                        new THREE.MeshPhongMaterial({map: wallTexture}) //Back
                    ]);

/*var wallTexture = THREE.ImageUtils.loadTexture('images/bricks.jpg');
wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(2,2);

var outerWallMat = new THREE.MeshBasicMaterial({map: wallTexture});*/


//Front-left outside wall
var frontWallLeft = new THREE.Mesh(new THREE.CubeGeometry(15,24,2), outerWallMat);
frontWallLeft.position.set(-72.5,12,80);
var flWallpt2 = new THREE.Mesh(new THREE.CubeGeometry(30, 24, 2), outerWallMat);
flWallpt2.position.set(51.5, 0, 0);
var diningWindow = new THREE.Mesh(new THREE.CubeGeometry(32, 12, 1), new THREE.MeshPhongMaterial({color: 0x8DEEEE, transparent: true, opacity: 0.8}));
diningWindow.position.set(23, 3, 0);
var flWallpt3 = new THREE.Mesh(new THREE.CubeGeometry(30, 10, 2), outerWallMat);
flWallpt3.position.set(22, -7, 0);
var flWallpt4 = new THREE.Mesh(new THREE.CubeGeometry(30, 3, 2), outerWallMat);
flWallpt4.position.set(22, 10.5, 0);
frontWallLeft.add(flWallpt2, diningWindow, flWallpt3, flWallpt4);

//Front-right outside wall
var frontWallRight = new THREE.Mesh(new THREE.CubeGeometry(35,24,2), outerWallMat);
frontWallRight.position.set(23.5,12,80);
var frWallpt2 = new THREE.Mesh(new THREE.CubeGeometry(10, 24, 2), outerWallMat);
frWallpt2.position.set(52, 0, 0);
var BedroomWindow = new THREE.Mesh(new THREE.CubeGeometry(32, 12, 1), new THREE.MeshPhongMaterial({color: 0x8DEEEE, transparent: true, opacity: 0.8}));
BedroomWindow.position.set(33, 3, 0);
var frWallpt3 = new THREE.Mesh(new THREE.CubeGeometry(30, 10, 2), outerWallMat);
frWallpt3.position.set(32, -7, 0);
var frWallpt4 = new THREE.Mesh(new THREE.CubeGeometry(30, 3, 2), outerWallMat);
frWallpt4.position.set(32, 10.5, 0);
var frWallpt5 = new THREE.Mesh(new THREE.CubeGeometry(12, 4, 2), outerWallMat);
frWallpt5.position.set(-23.5, 10, 0);
frontWallRight.add(frWallpt2, BedroomWindow, frWallpt3, frWallpt4, frWallpt5);

//Rear outside walls
var rearWallRight = frontWallLeft.clone();
rearWallRight.rotation.y += Math.PI;
rearWallRight.position.set(72.5, 12, -81);
var rearWallLeft = frontWallRight.clone();
rearWallLeft.rotation.y += Math.PI;
rearWallLeft.position.set(-22.5, 12, -81);

//Left outdoor wall
var leftWall01 = new THREE.Mesh(new THREE.CubeGeometry(76, 24, 2), outerWallMat);
leftWall01.rotation.y = Math.PI * 270/180;
leftWall01.position.set(-79.5, 12, 43 );
var leftWall02 = new THREE.Mesh(new THREE.CubeGeometry(78, 24, 2), outerWallMat);
leftWall02.position.set(-84.5, 0, 0);
var leftWall03 = new THREE.Mesh(new THREE.CubeGeometry(8, 2, 2), outerWallMat);
leftWall03.position.set(-42, 11, 0);
var leftWall04 = new THREE.Mesh(new THREE.CubeGeometry(8, 12, 2), outerWallMat);
leftWall04.position.set(-42, -6, 0);
leftWall01.add(leftWall02, leftWall03, leftWall04);

//Bathroom window (on left wall)
var bathroomWindow = new THREE.Mesh(new THREE.CubeGeometry(8, 10, 1), new THREE.MeshPhongMaterial({color: 0x8DEEEE, transparent: true, opacity: 0.8}));
bathroomWindow.rotation.y = Math.PI * 90/180;
bathroomWindow.position.set(-79.5, 17, 1);
scene.add(bathroomWindow);

//Right Outdoor Wall
var rightSideWall = new THREE.Mesh(new THREE.CubeGeometry(161, 24, 2), outerWallMat);
rightSideWall.position.set(80, 12, 0.5);
rightSideWall.rotation.y = Math.PI * 90/180;


//Inside wall Material
var wallMaterial = new THREE.MeshPhongMaterial({map: wallTexture})

//Dining room to Bathroom wall
var wall01 = new THREE.Mesh(new THREE.CubeGeometry(59, 24, 1), wallMaterial);
wall01.position.set(-50, 12, 29.5);

//Bedroom to Living room wall
var wall02 = wall01.clone();
wall02.scale.x = 0.8;
wall02.position.set(56,12,10.5);

//Bedroom to hallway wall
var wall03 = new THREE.Mesh(new THREE.CubeGeometry(50, 24, 1), wallMaterial); 
wall03.rotation.y = Math.PI * 90/180;
wall03.position.set(32.5,12,35);
var wall03Pt2 = new THREE.Mesh(new THREE.CubeGeometry(7, 24, 1), wallMaterial); 
wall03Pt2.position.set(-40.5, 0, 0);
var wall03pt3 = new THREE.Mesh(new THREE.CubeGeometry(12, 4, 1), wallMaterial);
wall03pt3.position.set(-31, 10, 0);
wall03.add(wall03Pt2, wall03pt3);

//Living room to kitchen/ hallway wall
var wall04 = new THREE.Mesh(new THREE.CubeGeometry(95, 24, 1), wallMaterial);
wall04.rotation.y = Math.PI * 90/180;
wall04.position.set(15, 12, 2.5);
var wall04Pt2 = new THREE.Mesh(new THREE.CubeGeometry(5, 24, 1), wallMaterial); 
wall04Pt2.position.set(30,12,49.5);
var wall04Pt3 = new THREE.Mesh(new THREE.CubeGeometry(12, 4, 1), wallMaterial);
wall04Pt3.position.set(21.5, 22, 49.5);
var wall04Pt4 =  new THREE.Mesh(new THREE.CubeGeometry(30, 4, 1), wallMaterial);
wall04Pt4.position.set(62.5, 10, 0);
var wall04Pt5 =  new THREE.Mesh(new THREE.CubeGeometry(5, 24, 1), wallMaterial);
wall04Pt5.position.set(80, 0, 0);
wall04.add(wall04Pt4, wall04Pt5);

//dining room to hallway
var wall05 = new THREE.Mesh(new THREE.CubeGeometry(30, 24, 1), wallMaterial);
wall05.rotation.y = Math.PI * 90/180;
wall05.position.set(-20,12,64);
var wall05pt2 = new THREE.Mesh(new THREE.CubeGeometry(12, 4, 1), wallMaterial);
wall05pt2.position.set(21, 10, 0);
wall05.add(wall05pt2);

//kitchen to Bathroom
var wall06 = new THREE.Mesh(new THREE.CubeGeometry(61, 24, 1), wallMaterial);
wall06.position.set(-47.5, 12, -10);

//Bathroom to hallway
var wall07 = new THREE.Mesh(new THREE.CubeGeometry(20, 24, 1), wallMaterial);
wall07.rotation.y += Math.PI * 90/180;
wall07.position.set(-20, 12, -0.5);
var wall07pt2 = new THREE.Mesh(new THREE.CubeGeometry(15.5, 24, 1), wallMaterial);
wall07pt2.position.set(-29.9, 0, 0);
var wall07pt3 = new THREE.Mesh(new THREE.CubeGeometry(12, 4, 1), wallMaterial);
wall07pt3.position.set(-16, 10, 0);
wall07.add(wall07pt2, wall07pt3);

//Hallway to kitchen
var wall08 =  new THREE.Mesh(new THREE.CubeGeometry(20, 24, 1), wallMaterial);
wall08.position.set(5, 12, -10);
var wall08pt2 = new THREE.Mesh(new THREE.CubeGeometry(12, 4, 1), wallMaterial);
wall08pt2.position.set(-16, 10, 0);
wall08.add(wall08pt2);

//Array of walls, for adding to scene & adding properties
var mainWalls = [frontWallLeft, frontWallRight, rightSideWall, leftWall01, wall01, wall02, wall03, wall04, wall04Pt2, wall04Pt3, wall05, wall06, wall07, wall08, rearWallRight, rearWallLeft];

var wallPartials = [flWallpt2, flWallpt3, flWallpt4, frWallpt2, frWallpt3, frWallpt4, frWallpt5, leftWall02, leftWall03, leftWall04, wall03Pt2, wall03pt3, wall04Pt4, wall04Pt5, wall05pt2, wall07pt2, wall07pt3];


var plugTexture = new THREE.MeshPhongMaterial({map:THREE.ImageUtils.loadTexture('images/plugSocket.png')});

var plug01 = new THREE.Mesh(new THREE.CubeGeometry(3, 0.1, 2), plugTexture);
plug01.rotation.x += Math.PI * 90/180;
plug01.position.set(60,5,-79.5);
var plug02 = plug01.clone();
plug02.position.set(79, 5, -10);
plug02.rotation.z += Math.PI * 90/180;
var plug03 = plug01.clone();
plug03.position.set(50, 5, 11);
var plug04 = plug01.clone();
plug04.position.set(45, 5, 79);
plug04.rotation.z = Math.PI;
var plug05 = plug01.clone();
plug05.position.set(-78.5, 5, 40);
plug05.rotation.z -= Math.PI * 90/180;
var plug06 = plug01.clone();
plug06.position.set(-15, 5, 79);
plug06.rotation.z = Math.PI;
var plug07 = plug01.clone();
plug07.position.set(-78.5, 12, -30);
plug07.rotation.z = Math.PI * 270/180;
var plug08 = plug01.clone();
plug08.position.set(-78.5, 12, -60);
plug08.rotation.z = Math.PI * 270/180;
var plug09 = plug01.clone();
plug09.position.set(14.5, 5, 0);
plug09.rotation.z = Math.PI * 90/180;

var plugs = [plug01, plug02, plug03, plug04, plug05, plug06, plug07, plug08, plug09];

//Saves repetition when applying to many objects
function addObjectsToScene(){
    for (i = 0; i< mainWalls.length; i++){
        mainWalls[i].castShadow = true;
        mainWalls[i].receiveShadow = true;
        scene.add(mainWalls[i]);
    }
    for (i = 0; i < doors.length; i++){
        doors[i].castShadow = true;
        doors[i].receiveShadow = true;
        scene.add(doors[i]);        
    }
    for (i = 0; i < wallPartials.length; i++){
        wallPartials[i].castShadow = true;
        wallPartials[i].receiveShadow = true;
    }
    for (i = 0; i < plugs.length; i++){
        plugs[i].castShadow = true;
        plugs[i].receiveShadow = true;
        scene.add(plugs[i]);
    }
}
addObjectsToScene();


//==================SCENE=OBJECTS====================

//Kitchen
var counterMaterial = new THREE.MeshFaceMaterial([
                new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('images/cupboard_front.png')}), //right
                new THREE.MeshLambertMaterial({color:0xf5f1de}), //left
                new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('images/cupboard_top.png')}), //top
                new THREE.MeshLambertMaterial({color:0xf5f1de}), //bottom
                new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('images/cupboard_side.png')}), //Front
                new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('images/cupboard_side.png')}) //Back
              ]);

var cupboardMaterial = new THREE.MeshFaceMaterial([
                new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('images/upper_cupboard_front.png')}), //right
                new THREE.MeshLambertMaterial({color:0xf5f1de}), //left
                new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('images/upper_cupboard_side.png')}), //top
                new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('images/upper_cupboard_side.png')}), //bottom
                new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('images/upper_cupboard_side.png')}), //Front
                new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('images/upper_cupboard_side.png')}) //Back
              ]);

var rightCounterMaterial = new THREE.MeshFaceMaterial([
                new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('images/cupboard_side.png')}), //right
                new THREE.MeshLambertMaterial({color:0xf5f1de}), //left
                new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('images/cupboard_top.png')}), //top
                new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('images/upper_cupboard_side.png')}), //bottom
                new THREE.MeshLambertMaterial({map:THREE.ImageUtils.loadTexture('images/right_cupboard_front.png')}), //Front
                new THREE.MeshLambertMaterial({color:0xf5f1de}) //Back
              ]);

//Kitchen counters and cupboards
var kitchenCounter = new THREE.Mesh(new THREE.CubeGeometry(10,10,30.5),  counterMaterial);
kitchenCounter.position.set(-75, 5, -25.5);
var counter02 = new THREE.Mesh(new THREE.CubeGeometry(10,10,28),  counterMaterial);
counter02.position.set(0,0,-40);
var counter03 = new THREE.Mesh(new THREE.CubeGeometry(40,10,9.5),  rightCounterMaterial);
counter03.position.set(25,0,-49.2);
var counter04 = new THREE.Mesh(new THREE.CubeGeometry(5,8,30.5), cupboardMaterial);
counter04.position.set(0,15,-0.5);
var counter05 = new THREE.Mesh(new THREE.CubeGeometry(5,8,30.5), cupboardMaterial);
counter05.position.set(0,15,-40);
kitchenCounter.add(counter02, counter03, counter04, counter05);
scene.add(kitchenCounter);


function loadOBJ(address, xPos, yPos, zPos, color, scale, rotation, castShadow=true){
    
    var loader = new THREE.OBJLoader(new THREE.LoadingManager());
    
    loader.load(address, function(object){
        object.position.set(xPos,yPos,zPos);
        object.scale.set(scale, scale, scale);
        object.rotation.y += Math.PI * rotation /180;
    
        object.traverse(function(child){
            if(child instanceof THREE.Mesh){
                child.material.color = new THREE.Color(color);
                child.castShadow = castShadow;
                child.receiveShadow = true;
                child.geometry.computeVertexNormals();
            } 
        })
        
        scene.add(object);
    });
}

//Loading an object and attaching material function
function loadObject(material, object, xPos, yPos, zPos, rotation, scale, castShadow=true){
    
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('objects/');
    mtlLoader.load(material, function(materials){
       
        materials.preload();
        
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('objects/');
        
        objLoader.load(object, function(object){
            object.position.set(xPos,yPos,zPos);
            object.scale.set(scale, scale, scale);
            object.rotation.y += Math.PI * rotation /180;
            
            object.traverse(function(child){
                if(child instanceof THREE.Mesh){
                    child.castShadow = castShadow;
                    child.receiveShadow = true;
                    child.geometry.computeVertexNormals();
                } 
            })
            
            scene.add(object);
        });
        
    });
}


//Bedroom
loadObject('chestOfDrawers.mtl','chestOfDrawers.obj', 33, 0, 50, 90, 0.5);
loadObject('desk.mtl','desk.obj', 55, 7, 75, 180, 0.1);
//loadOBJ('objects/officeChair.obj', 60, 6.5, 65, 0x000000, 0.015, -30);
loadObject('chair.mtl','chair.obj', 65, 0, 68, -30, 0.7);
loadObject('bed.mtl','bed.obj', 52, 0, 12, 0, 1);

//Living Room
loadObject('3sofa.mtl','3sofa.obj', 72, 0, 5.5, 180, 0.9);
loadObject('2sofa.mtl','2sofa.obj', 20, 0, -20, 90, 0.9);
loadObject('tvStand.mtl','tvStand.obj', 71.5, 0, -64.5, 150, 0.55);
loadOBJ('objects/TV.obj', 68.5, 4.8, -70, 0x000000, 0.05, 330, false);
loadObject('coffeeTable.mtl','coffeeTable.obj', 45, -0.5, -30, 90, 0.8);
var tvColor = new THREE.Mesh(new THREE.CubeGeometry(18,9,0.01),  new THREE.MeshPhongMaterial({color: 0x8DEEEE, transparent: true, opacity: 0.3}));
tvColor.position.set(68.4, 10.5, -69.8);
tvColor.rotation.y += Math.PI * 330/180;
tvColor.name = "tvColor";
scene.add(tvColor);
//loadOBJ('objects/banana.obj', 40, 10, -30, 0xffff00, 0.01, 0);

//Bathroom
loadOBJ('objects/toilet.obj', -75, 0, 1.1, 0xffffff, 0.4, 0);
loadOBJ('objects/CornerSink.obj', -19, 7.5, 27.5, 0xffffff, 0.5, 225);
loadObject('bath.mtl','bath.obj', -64, 0, 25, 270, 0.3);
loadObject('showerHead.mtl','showerHead.obj', -27, 20, -6, 0, 0.3);
var showerGlass = new THREE.Mesh(new THREE.CubeGeometry(12, 20, 0.5), 
                                            new THREE.MeshPhongMaterial({color: 0xffffff, transparent: true, opacity: 0.5}));
showerGlass.position.set(-26, 10, 2);
scene.add(showerGlass);
var showerToggle = new THREE.Mesh(new THREE.CubeGeometry(2, 2, 1), new THREE.MeshPhongMaterial({color: 0xd3d3d3}));
showerToggle.position.set(-28, 10, -8);
showerToggle.name = "showerToggle";
scene.add(showerToggle);


//Dining Room
loadObject('tableLegs.mtl','tableLegs.obj', -70, 0, 48, 0, 0.4);
var tableCounter1 = new THREE.Mesh(new THREE.CubeGeometry(30,1,15), new THREE.MeshPhongMaterial({color: 0xffffff, transparent: true, opacity: 0.7}));
tableCounter1.position.set(-55.5,10,55);
tableCounter1.castShadow = true;
scene.add(tableCounter1);
loadObject('chair.mtl','chair.obj', -60, 0, 48, 0, 0.7);
loadObject('chair.mtl','chair.obj', -70, 0, 55, 85, 0.7);
loadObject('chair.mtl','chair.obj', -63, 0, 70, 170, 0.7);
loadObject('chair.mtl','chair.obj', -50, 0, 65, 180, 0.7);
loadObject('chair.mtl','chair.obj', -26, 0, 70, 220, 0.7);
loadObject('chair.mtl','chair.obj', -50, 0, 48, 0, 0.7);

//Kitchen
loadObject('oven.mtl', 'oven.obj', -80, 0, -41.2, 90, 0.3335);
loadObject('kitchenTableLegs.mtl', 'kitchenTableLegs.obj', -40, 2.5, -30, 0, 0.5);
var tableCounter2 = new THREE.Mesh(new THREE.CylinderGeometry(8,8, 0.8, 20), 
                                   new THREE.MeshPhongMaterial({color: 0xffffff, transparent: true, opacity: 0.8}));
tableCounter2.position.set(-40, 8, -30);
tableCounter2.castShadow = true;
scene.add(tableCounter2);
loadObject('kitchenChair.mtl','kitchenChair.obj', -50, 0, -25, 180, 0.4);
loadObject('kitchenChair.mtl','kitchenChair.obj', -30, 0, -35, 0, 0.4);
loadObject('kitchenChair.mtl','kitchenChair.obj', -34, 0, -25, 270, 0.4);
loadObject('kitchenChair.mtl','kitchenChair.obj', -44, 0, -35, 90, 0.4);


var stats = new Stats();
stats.showPanel( 0 );
document.body.appendChild( stats.dom );


//-------------------------------------------------------------
//-------------------------ANIMATION---------------------------
//-------------------------------------------------------------
//var door.name = "closed";

//Opening and Closing Doors in the house
function doorInteract(door){
    if (doors[door].open == "closed"){
        doors[door].open = "moving";
        var i = 0;
        var doorAnimation = setInterval(
            function(){
                if (i < 90){
                    doors[door].rotation.y += Math.PI * 1/180;
                    i++;
                } else {
                    clearInterval(doorAnimation);
                    doors[door].open = "open";
                }
            }, 10);
    } else if(doors[door].open == "open"){
        doors[door].open = "moving";
        var i = 0;
        var doorAnimation = setInterval(
            function(){
                if (i < 90){
                    doors[door].rotation.y -= Math.PI * 1/180;
                    i++;
                } else {
                    clearInterval(doorAnimation);
                    doors[door].open = "closed";
                }
            }, 10);
    }
}


//Water particles for shower
var showerMaterial = new THREE.PointCloudMaterial({color: 0x40a4df, size: 0.2});
var showerGeometry = new THREE.Geometry();
var x2, y2, z2;
for (i = 0; i < 1000; i++){
   x2 = (Math.random() * 6);
   y2 = (Math.random() * 20);
   z2 = (Math.random() * 6);
    
    showerGeometry.vertices.push(new THREE.Vector3(x2, y2, z2));
};

var shower = new THREE.PointCloud(showerGeometry, showerMaterial);
shower.position.set(-26, 0, -6);
scene.add(shower);





//-------------------------------------------------------------
//------------------------RENDER-LOOP--------------------------
//-------------------------------------------------------------
//Checking which keys are currently being pressed by user
window.onkeydown = function(e){
    KeysPressed[e.keyCode] = true;
}
window.onkeyup = function(e) {
    KeysPressed[e.keyCode] = false;
}

var tvFlicker = 0;
var flickerCount = 15;
var colour;
var showerOn = true;
var showerInteract = true;
var tvOn = true;
var tvInteract = true;
var interactions = [tvColor, showerToggle];

//Primary render loop
function RenderLoop(){
    stats.begin();
    renderer.render(scene, camera);
    
    
    for (i = 0; i < showerGeometry.vertices.length; i++){
        if (showerGeometry.vertices[i].y < 0 && showerOn){
            showerGeometry.vertices[i].y = 20;
        }
        showerGeometry.vertices[i].y -= 0.2;
    }
    showerGeometry.verticesNeedUpdate = true;
    
    
    //Raycaster update & collision detection
    raycaster.ray.origin.set(controls.getObject().position);
    raycaster.ray.direction.set(controls.getObject().rotation);
    raycaster.setFromCamera(cursorPos, camera);
    var rayCollision = raycaster.intersectObjects(doors);
    var rayInteraction = raycaster.intersectObjects(interactions);
    
    //"Press (E) to interact" notification
    interact.style.display = 'none';
    
    //Interacting with whichever door you are looking at
    for (i = 0; i < rayCollision.length; i++){
        interact.style.display = 'block';
        if (KeysPressed[69] && doors[rayCollision[i].object.name].name != "moving"){
            doorInteract(rayCollision[i].object.name); 
        }   
    }
    for (i = 0; i < rayInteraction.length; i++){
        interact.style.display = 'block';
        if (rayInteraction[i].object.name == "tvColor" && KeysPressed[69]  && tvInteract == true){
             if (tvOn){
                tvOn = false;
                tvLight.intensity = 0;
                tvInteract = false;
                setTimeout(function(){tvInteract = true;}, 500);
             } else {
                console.log(rayInteraction[i].object.name); 
                tvOn = true;
                tvLight.intensity = 1;
                tvInteract = false;
                setTimeout(function(){tvInteract = true;}, 500);
             }
        } else if (rayInteraction[i].object.name == "showerToggle" && KeysPressed[69]  && showerInteract == true){
            if (showerOn){
                showerOn = false;
                showerInteract = false;
                setTimeout(function(){showerInteract = true;}, 500);
            } else {
                showerOn = true;
                showerInteract = false;
                setTimeout(function(){showerInteract = true;}, 500);
            }
        }
        
        
    }
    
    //Changing colour of the TV light to simulate it being on
    if (tvFlicker == flickerCount){
        colour = '0x'+((1<<24)*Math.random()|0).toString(16);
        tvLight.color.setHex(colour);
        if (tvOn){
            tvColor.material.color.setHex(colour);
        } else {
            tvColor.material.color.setHex('#000');
        }
        
        tvFlicker = 0;
        flickerCount = Math.floor(Math.random() * (20 - 2)) + 2;
    } 
    tvFlicker++;

    
    //Character Movement
    if (KeysPressed[87]){ controls.getObject().translateZ( -2 ); }
    if (KeysPressed[83]){ controls.getObject().translateZ( 2 ); } 
    if (KeysPressed[68]){ controls.getObject().translateX( 2 ); }
    if (KeysPressed[65]){ controls.getObject().translateX( -2 ); }
    if (KeysPressed[32]){ controls.getObject().translateY( 2 ); }
    if (KeysPressed[16]){ controls.getObject().translateY( -2 ); }

    stats.end();
    requestAnimationFrame(RenderLoop);
}
RenderLoop();

