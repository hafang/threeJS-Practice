import * as THREE from "three";
import TerrainLoader from "./TerrainLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Set up global variables.
let scene, camera, renderer;
let width = window.innerWidth;
let height = window.innerHeight;

// Sets up the scene.
function init() {
  // Create the scene and set the scene size.
  scene = new THREE.Scene();
  //scene.background = new THREE.Color(0xffffff);

  const fov = 45;
  const nearClip = 0.01;
  const farClip = 1000;

  camera = new THREE.PerspectiveCamera(fov, width / height, nearClip, farClip);

  camera.position.z = 1.5;

  // Create a renderer and add it to the DOM.
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  // Create an event listener that resizes the renderer with the browser window.
  window.addEventListener("resize", function() {
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
  scene.add(new THREE.AmbientLight(0x333333));

  const dLight2 = new THREE.DirectionalLight(0xffffff, 1);
  dLight2.position.set(5, 3, 5);
  scene.add(dLight2);
}

function createSpace() {
  const starfield_tex = new THREE.TextureLoader().load(
    "textures/galaxy_starfield.png"
  );

  const galaxySphere = new THREE.SphereGeometry(90, 64, 64);

  const galaxyMat = new THREE.MeshBasicMaterial({
    map: starfield_tex,
    side: THREE.BackSide
  });

  const galaxy = new THREE.Mesh(galaxySphere, galaxyMat);
  scene.add(galaxy);
}

function createEarth() {
  // Earth
  const earth_noClouds = new THREE.TextureLoader().load(
    "textures/earth_noClouds_4k.jpg"
  );

  const earthSphere = new THREE.SphereGeometry(0.25, 32, 32);
  const earthMat = new THREE.MeshPhongMaterial({
    map: earth_noClouds,
    bumpMap: earth_noClouds,
    bumpScale: 0.0015
  });

  var earth = new THREE.Mesh(earthSphere, earthMat);

  scene.add(earth);

  // Add clouds to earth
  const cloud_tex = new THREE.TextureLoader().load(
    "textures/earth_clouds_4k.png"
  );

  const cloudSphere = new THREE.SphereGeometry(0.2503, 32, 32);
  const cloudMat = new THREE.MeshPhongMaterial({
    map: cloud_tex,
    transparent: true
  });

  const clouds = new THREE.Mesh(cloudSphere, cloudMat);

  scene.add(clouds);
}

function createMoon() {
  const moon_tex = new THREE.TextureLoader().load("textures/moon_tex.jpg");
  const moonSphere = new THREE.SphereGeometry(0.075, 32, 32);
  const moonMat = new THREE.MeshPhongMaterial({
    map: moon_tex,
    bumpMap: moon_tex,
    bumpScale: 0.005
  });

  const moon = new THREE.Mesh(moonSphere, moonMat);
  moon.position.set(0.5, 0, 0.5);
  scene.add(moon);
}

function main() {
  init();
  createControls();
  //createGround();
  createSpace();
  createEarth();
  createMoon();

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
    resizeRendererToDisplaySize(renderer);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
createLight();
