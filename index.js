import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './js/lib/OrbitControls.js'
import {PickHelper} from './js/pickHelper.js'


//1) Создан кубик Standard material
//2) Цвет куба регулируется
//3) 2 Сточника света, каждый регулируется по цвету и интенсивности
//4) Подключен OrbitControls
//5) Подключен Raycaster по клику на объект


window.onload = function (){

    let width = window.innerWidth;
    let height = window.innerHeight;

    let canvas = document.getElementById('c1');

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);


    let paramsCube = {
    color: 0xff00ff,
    rotationY: 0.002,
    rotationX: 0.000,
    };

    let paramsLight = {
    colorL1: 0xFFFFFF,
    colorL2: 0xFFFFFF,
    intensityL1: 0.5,
    intensityL2: 0.5,
    };

    //GUI
    let gui = new dat.GUI();
    gui.add(paramsCube,'rotationY').min(-0.1).max(0.1).step(0.001);
    gui.add(paramsCube,'rotationX').min(-0.1).max(0.1).step(0.001);


    const folderMaterial = gui.addFolder( 'MATERIAL' );
    const folderLight = gui.addFolder( 'LIGHT' );

    folderMaterial.addColor(paramsCube, 'color').onChange( function() { meshCube.material.color.set( paramsCube.color ); } );
    folderLight.addColor(paramsLight, 'colorL1').onChange( function() { light2.color.set( paramsLight.colorL1 ); } );
    folderLight.addColor(paramsLight, 'colorL2').onChange( function() { light3.color.set( paramsLight.colorL2 ); } );
    folderLight.add(paramsLight, 'intensityL1').min(0).max(3).step(0.001);
    folderLight.add(paramsLight, 'intensityL2').min(0).max(3).step(0.001);

    folderMaterial.open();
    folderLight.open();
    //GUI

    let renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setClearColor(0x000000);


    let camera = new THREE.PerspectiveCamera(30, width/height, 0.1, 10000);
    camera.position.set(0,100,2000);

    const controls = new OrbitControls(camera, canvas);
    controls.update();

    let light = new THREE.AmbientLight(0xFFFFFF, 0.2);
    let light2 = new THREE.DirectionalLight(0xFFFFFF, 0.5);
    let light3 = new THREE.DirectionalLight(0xFFFFFF, 2);
    light2.position.set(300, 300, 2000);
    light3.position.set(1000, 300, 2000);
    light2.castShadow = true;
    light2.shadow = true;


    light3.position.set(100, 300, 0);


    let geometryBox = new THREE.BoxGeometry(300, 300, 300);
    let material = new THREE.MeshStandardMaterial({color: 0x44aa88,});
    let material2 = new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true});
    let meshCube = new THREE.Mesh(geometryBox, material);
    meshCube.position.set(0, 150, 0);
    let geometryFloor = new THREE.PlaneGeometry(2000, 2000, 10, 10);
    let meshPlane = new THREE.Mesh(geometryFloor, material2);

    let scene = new THREE.Scene();
    scene.add(meshCube);
    scene.add(meshPlane);
    scene.add(camera);
    scene.add(light);
    scene.add(light2);
    scene.add(light3);
   
    //Raycaster
    const pickPosition = {x: 0, y: 0};
    clearPickPosition();
     
     
    function getCanvasRelativePosition(event) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (event.clientX - rect.left) * canvas.width  / rect.width,
        y: (event.clientY - rect.top ) * canvas.height / rect.height,
      };
    }
     
    function setPickPosition(event) {
      const pos = getCanvasRelativePosition(event);
      pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
      pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
    }
     
    function clearPickPosition() {

      pickPosition.x = -100000;
      pickPosition.y = -100000;
    }
     
    window.addEventListener('mousemove', setPickPosition);
    window.addEventListener('mouseout', clearPickPosition);
    window.addEventListener('mouseleave', clearPickPosition);

    const pickHelper = new PickHelper();


    function animate (){

        pickHelper.pick(pickPosition, scene, camera);
        
        meshCube.rotation.y += paramsCube.rotationY;
        meshCube.rotation.x += paramsCube.rotationX;
        meshPlane.rotation.x = -Math.PI / 2;

        light2.intensity = paramsLight.intensityL1;
        light3.intensity = paramsLight.intensityL2;


        renderer.render(scene, camera);
        requestAnimationFrame(function(){animate();});
        }
        animate();
}


