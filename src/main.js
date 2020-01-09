import * as THREE from "three";
import TerrainLoader from "./TerrainLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Set up the scene, camera, and renderer as global variables.
var scene, camera, renderer;

// Sets up the scene.
function init() {
  // Create the scene and set the scene size.
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  //scene.background = new THREE.Color(0x8fbcd4);
  camera = new THREE.PerspectiveCamera(
    // Field of view: bigger  = wide lens
    45,
    // Camera?/Pixel? Aspect ratio
    window.innerWidth / window.innerHeight,
    // Near & far-clipping planes
    // Ensures good level of detail for web browsers
    0.1,
    1000
  );

  camera.position.set(0, -30, 30);

  // Create a renderer and add it to the DOM.
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Create an event listener that resizes the renderer with the browser window.
  window.addEventListener("resize", function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });
}

// Add OrbitControls so that we can pan around with the mouse.
function createControls() {
  let controls = new OrbitControls(camera, renderer.domElement);
}

// Create a light, set its position, and add it to the scene.
function createLight() {
  const color = 0xffffff;
  const intensity = 0.75;
  const dLight = new THREE.DirectionalLight(color, intensity);
  dLight.position.set(0, 10, 5);
  dLight.target.position.set(-5, 0, 0);
  scene.add(dLight);
  scene.add(dLight.target);

  const intensityHem = 0.55;
  const skyColor = 0xb1e1ff;
  const groundColor = 0xb97a20;
  const hemLight = new THREE.HemisphereLight(
    skyColor,
    groundColor,
    intensityHem
  );

  scene.add(dLight);
  scene.add(hemLight);
}

function createGround() {
  // const loader = new THREE.TextureLoader();
  // const texture = loader.load("jotunheimen_tex.jpg");

  var terrainLoader = new THREE.TerrainLoader();
  terrainLoader.load("textures/jotunheimen.bin", function(data) {
    const ground = new THREE.PlaneGeometry(60, 60, 199, 199);

    for (var i = 0, l = ground.vertices.length; i < l; i++) {
      ground.vertices[i].z = (data[i] / 65535) * 5;
    }

    scene.add(new THREE.AmbientLight(0xeeeeee));

    var groundMat = new THREE.MeshPhongMaterial({
      map: THREE.ImageUtils.loadTexture("textures/jotunheimen_tex.jpg"),
      //color: 0x000000,
      wireframe: false
    });

    var plane = new THREE.Mesh(ground, groundMat);
    scene.add(plane);
  });
}

function main() {
  init();
  createControls();
  createGround();

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001; // convert to seconds

    resizeRendererToDisplaySize(renderer);

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
