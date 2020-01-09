import * as THREE from "three";

// User Input
// ==========

var mouse = {
  x: 0,
  y: 0
};

// Scene & Camera
// ===============

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  // Field of view: bigger = wide lens
  75,
  // Camera?/Pixel? Aspect ratio
  window.innerWidth / window.innerHeight,
  // Near & far-clipping planes
  // Ensures good level of detail for web browsers
  0.1,
  1000
);
camera.position.z = 5;

// Renderer
// ========

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Update Viewport on Resize
window.addEventListener("resize", function() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

// Utilities
// =========

function addCube(material) {
  let geometry = new THREE.BoxGeometry(1, 1, 1);
  let cube = new THREE.Mesh(geometry, material);

  scene.add(cube);

  return cube;
}

// Textures
// ========

var texture = new THREE.TextureLoader().load("textures/corgi.jpg");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;

// Tiling Settings
texture.repeat.set(1, 1);

// Materials
// =========

var basicMaterial = new THREE.MeshBasicMaterial({
  map: texture
});

var standardMaterial = new THREE.MeshStandardMaterial({
  map: texture
});

// Objects
// ========

var pointerCube = addCube(basicMaterial);
var centerCube = addCube(standardMaterial);

// Initialize Object positions
// ---------------------------

centerCube.position.x = 2.0;

// Lights
// ======

// White directional light at half intensity shining from the top.
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);

let pointLight = new THREE.PointLight(new THREE.Color("red"), 0.5);
scene.add(pointLight);
pointLight.position.set(0.0, 0.0, 5.0);

// When the mouse moves, call the given function
document.addEventListener("mousemove", onMouseMove, false);

// On mouse click, call the given function
document.addEventListener("click", spawnAtCursor);

function spawnAtCursor(event) {
  var spawnedCube = pointerCube.clone();
  scene.add(spawnedCube);
}

function updateMousePosition(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Make the sphere follow the mouse
  var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
  vector.unproject(camera);
  var dir = vector.sub(camera.position).normalize();
  var distance = -camera.position.z / dir.z;
  var pos = camera.position.clone().add(dir.multiplyScalar(distance));

  return pos;
}

// Follows the mouse event
function onMouseMove(event) {
  // Update the mouse variable

  event.preventDefault();

  var pos = updateMousePosition(event);

  pointerCube.position.copy(pos);

  pointLight.position.copy(pos);
}

// Animate
// ========

var animate = function() {
  requestAnimationFrame(animate);

  // Animate cube
  pointerCube.rotation.x += 0.01;
  pointerCube.rotation.y += 0.01;

  // Animate cube2
  centerCube.rotation.x -= 0.01;
  centerCube.rotation.y -= 0.01;

  renderer.render(scene, camera);
};

animate();
