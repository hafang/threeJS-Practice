import * as THREE from "three";
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
  const farClip = 3000;

  camera = new THREE.PerspectiveCamera(fov, width / height, nearClip, farClip);

  camera.position.x = 5.5;
  camera.position.z = 5.5;

  // Create a renderer and add it to the DOM.
  const canvas = document.querySelector("#c");
  renderer = new THREE.WebGLRenderer({ canvas });
}

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

function createSun() {
  // Sun
  const sun_tex = new THREE.TextureLoader().load("textures/sun_tex.jpg");

  const sunSphere = new THREE.SphereGeometry(0.85, 64, 64);
  const sunMat = new THREE.MeshPhongMaterial({
    map: sun_tex,
    bumpMap: sun_tex,
    bumpScale: 0.0015
  });

  var sun = new THREE.Mesh(sunSphere, sunMat);

  scene.add(sun);

  return sun;
}

function createMercury() {
  // Mercury
  const mercury_tex = new THREE.TextureLoader().load(
    "textures/mercury_tex.jpg"
  );

  const mercurySphere = new THREE.SphereGeometry(0.025, 64, 64);
  const mercuryMat = new THREE.MeshPhongMaterial({
    map: mercury_tex,
    bumpMap: mercury_tex,
    bumpScale: 0.0015
  });

  var mercury = new THREE.Mesh(mercurySphere, mercuryMat);

  scene.add(mercury);

  return mercury;
}

function createVenus() {
  // Venus
  const venus_tex = new THREE.TextureLoader().load("textures/venus_tex.jpg");

  const venusSphere = new THREE.SphereGeometry(0.05, 64, 64);
  const venusMat = new THREE.MeshPhongMaterial({
    map: venus_tex,
    bumpMap: venus_tex,
    bumpScale: 0.0015
  });

  var venus = new THREE.Mesh(venusSphere, venusMat);

  scene.add(venus);

  return venus;
}

function createVenusAtmos() {
  const venus_atmos = new THREE.TextureLoader().load(
    "textures/venus_atmos.png"
  );

  const venusAtmosSphere = new THREE.SphereGeometry(0.0505, 64, 64);
  const venusAtmosMat = new THREE.MeshPhongMaterial({
    map: venus_atmos,
    transparent: true
  });

  var venusAtmos = new THREE.Mesh(venusAtmosSphere, venusAtmosMat);

  scene.add(venusAtmos);

  return venusAtmos;
}

function createEarth() {
  // Earth
  const earth_noClouds = new THREE.TextureLoader().load(
    "textures/earth_noClouds_4k.jpg"
  );

  const earthSphere = new THREE.SphereGeometry(0.0505, 64, 64);
  const earthMat = new THREE.MeshPhongMaterial({
    map: earth_noClouds,
    bumpMap: earth_noClouds,
    bumpScale: 0.0015
  });

  var earth = new THREE.Mesh(earthSphere, earthMat);

  scene.add(earth);

  return earth;
}

function createClouds() {
  // Add clouds to earth
  const cloud_tex = new THREE.TextureLoader().load(
    "textures/earth_clouds_4k.png"
  );

  const cloudSphere = new THREE.SphereGeometry(0.051, 64, 64);
  const cloudMat = new THREE.MeshPhongMaterial({
    map: cloud_tex,
    transparent: true
  });

  const clouds = new THREE.Mesh(cloudSphere, cloudMat);

  scene.add(clouds);
  return clouds;
}

function createMoon() {
  const moon_tex = new THREE.TextureLoader().load("textures/moon_tex.jpg");
  const moonSphere = new THREE.SphereGeometry(0.015, 32, 32);
  const moonMat = new THREE.MeshPhongMaterial({
    map: moon_tex,
    bumpMap: moon_tex,
    bumpScale: 0.0025
  });

  const moon = new THREE.Mesh(moonSphere, moonMat);

  scene.add(moon);

  return moon;
}

function createMars() {
  // Mars
  const mars_tex = new THREE.TextureLoader().load("textures/mars_tex.jpg");

  const marsSphere = new THREE.SphereGeometry(0.25, 64, 64);
  const marsMat = new THREE.MeshPhongMaterial({
    map: mars_tex,
    bumpMap: mars_tex,
    bumpScale: 0.0015
  });

  var mars = new THREE.Mesh(marsSphere, marsMat);

  scene.add(mars);

  return mars;
}

function main() {
  init();

  createControls();
  createSpace();

  const sun = createSun();
  const mercury = createMercury();
  const venus = createVenus();
  const venusAtmos = createVenusAtmos();
  const earth = createEarth();
  const clouds = createClouds();
  const moon = createMoon();
  const mars = createMars();

  createLight();

  //Set the sphere's orbital radius, start angle, and angle increment value
  {
    var mercuryR = 2;
    var mercuryTheta = 0;
    var mercury_dTheta = (2 * Math.PI) / 6736;

    var venusR = 2.5;
    var venusTheta = 0;
    var venus_dTheta = (2 * Math.PI) / 11360;

    var earthR = 3.5;
    var earthTheta = 0;
    var earth_dTheta = (2 * Math.PI) / 20100;

    var moonR = 0.1;
    var moonTheta = 0;
    var moon_dTheta = (2 * Math.PI) / 700;

    var marsR = 0.05;
    var marsTheta = 0;
    var mars_dTheta = (2 * Math.PI) / 10000;
  }

  function render() {
    // Updating the rotation of each planet/star
    {
      sun.rotation.y += 0.00025;
      mercury.rotation.y += 0.0005;
      venus.rotation.y += 0.0005;
      earth.rotation.y += 0.0005;
      clouds.rotation.y += 0.0005;
      moon.rotation.y += 0.0025;
      mars.rotation.y += 0.0005;
    }

    //Increment theta, and update x and y
    //position based off new theta value
    {
      mercuryTheta += mercury_dTheta;
      mercury.position.x = sun.position.x + mercuryR * Math.cos(mercuryTheta);
      mercury.position.y =
        sun.position.y + (mercuryR * Math.cos(mercuryTheta)) / 5;
      mercury.position.z = sun.position.z + mercuryR * Math.sin(mercuryTheta);
    }

    {
      venusTheta += venus_dTheta;
      venus.position.x = sun.position.x + venusR * Math.cos(venusTheta);
      venus.position.y = sun.position.y + (venusR * Math.cos(venusTheta)) / 5;
      venus.position.z = sun.position.z + venusR * Math.sin(venusTheta);
      venusAtmos.position.x = sun.position.x + venusR * Math.cos(venusTheta);
      venusAtmos.position.y =
        sun.position.y + (venusR * Math.cos(venusTheta)) / 5;
      venusAtmos.position.z = sun.position.z + venusR * Math.sin(venusTheta);
    }

    {
      earthTheta += earth_dTheta;
      earth.position.x = sun.position.x + earthR * Math.cos(earthTheta);
      earth.position.y = sun.position.y + (earthR * Math.cos(earthTheta)) / 5;
      earth.position.z = sun.position.z + earthR * Math.sin(earthTheta);
      clouds.position.x = sun.position.x + earthR * Math.cos(earthTheta);
      clouds.position.y = sun.position.y + (earthR * Math.cos(earthTheta)) / 5;
      clouds.position.z = sun.position.z + earthR * Math.sin(earthTheta);

      moonTheta += moon_dTheta;
      moon.position.x = earth.position.x + moonR * Math.cos(moonTheta);
      moon.position.y = earth.position.y + (moonR * Math.cos(moonTheta)) / 5;
      moon.position.z = earth.position.z + moonR * Math.sin(moonTheta);
    }

    {
      marsTheta += mars_dTheta;
      mars.position.x = sun.position.x + marsR * Math.cos(marsTheta);
      mars.position.y = sun.position.y + (marsR * Math.cos(marsTheta)) / 5;
      mars.position.z = sun.position.z + marsR * Math.sin(marsTheta);
    }

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
