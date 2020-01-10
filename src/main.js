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

  camera.position.z = 20;

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
  //   scene.add(new THREE.AmbientLight(0x333333));

  //   const dLight2 = new THREE.DirectionalLight(0xffffff, 1);
  //   dLight2.position.set(5, 3, 5);
  //   scene.add(dLight2);

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

function vertexShader() {
  return `
  varying vec3 vUv; 

  void main() {
    vUv = position; 

    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition; 
  }
  `;
}

function fragmentShader() {
  return `
  uniform vec3 colorA; 
  varying vec3 vUv;

  void main() {
    gl_FragColor = vec4(colorA, 1.0);
  }
`;
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
    bumpScale: 0.015
  });

  let uniforms = {
    colorA: { type: "vec3", value: new THREE.Color(0xff7700) }
  };

  let shaderMat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: fragmentShader(),
    vertexShader: vertexShader()
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

  const mercurySphere = new THREE.SphereGeometry(0.025, 32, 32);
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

  const venusSphere = new THREE.SphereGeometry(0.05, 32, 32);
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

  const venusAtmosSphere = new THREE.SphereGeometry(0.0505, 32, 32);
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

  const earthSphere = new THREE.SphereGeometry(0.04505, 32, 32);
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

  const cloudSphere = new THREE.SphereGeometry(0.0451, 32, 32);
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

  const marsSphere = new THREE.SphereGeometry(0.035, 32, 32);
  const marsMat = new THREE.MeshPhongMaterial({
    map: mars_tex,
    bumpMap: mars_tex,
    bumpScale: 0.0015
  });

  var mars = new THREE.Mesh(marsSphere, marsMat);

  scene.add(mars);

  return mars;
}

function createJupiter() {
  // Jupiter
  const jupiter_tex = new THREE.TextureLoader().load(
    "textures/jupiter_tex.jpg"
  );

  const jupiterSphere = new THREE.SphereGeometry(0.15, 64, 64);
  const jupiterMat = new THREE.MeshPhongMaterial({
    map: jupiter_tex,
    bumpMap: jupiter_tex,
    bumpScale: 0.0025
  });

  var jupiter = new THREE.Mesh(jupiterSphere, jupiterMat);

  scene.add(jupiter);

  return jupiter;
}

function createSaturn() {
  // Saturn
  const saturn_tex = new THREE.TextureLoader().load("textures/saturn_tex.jpg");

  const saturnSphere = new THREE.SphereGeometry(0.1, 64, 64);
  const saturnMat = new THREE.MeshPhongMaterial({
    map: saturn_tex,
    bumpMap: saturn_tex,
    bumpScale: 0.005
  });

  var saturn = new THREE.Mesh(saturnSphere, saturnMat);
  saturn.rotation.x = 12.25;

  scene.add(saturn);

  return saturn;
}

function createRing() {
  // Ring
  const ring_tex = new THREE.TextureLoader().load("textures/saturn_ring.jpg");

  const ringTorus = new THREE.TorusGeometry(0.175, 0.025, 64, 64);
  const ringMat = new THREE.MeshPhongMaterial({
    map: ring_tex,
    bumpMap: ring_tex,
    bumpScale: 0.005
  });

  var ring = new THREE.Mesh(ringTorus, ringMat);
  ring.rotation.x = 130;
  ring.scale.set(1, 1, 0.25);
  //   ring.position.set(5, 0, 0);

  scene.add(ring);

  return ring;
}

function createUranus() {
  // Uranus
  const uranus_tex = new THREE.TextureLoader().load("textures/uranus_tex.jpg");

  const uranusSphere = new THREE.SphereGeometry(0.055, 64, 64);
  const uranusMat = new THREE.MeshPhongMaterial({
    map: uranus_tex,
    bumpMap: uranus_tex,
    bumpScale: 0.005
  });

  var uranus = new THREE.Mesh(uranusSphere, uranusMat);

  scene.add(uranus);

  return uranus;
}

function createNeptune() {
  // Neptune
  const neptune_tex = new THREE.TextureLoader().load(
    "textures/neptune_tex.jpg"
  );

  const neptuneSphere = new THREE.SphereGeometry(0.055, 64, 64);
  const neptuneMat = new THREE.MeshPhongMaterial({
    map: neptune_tex,
    bumpMap: neptune_tex,
    bumpScale: 0.005
  });

  var neptune = new THREE.Mesh(neptuneSphere, neptuneMat);

  scene.add(neptune);

  return neptune;
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
  const jupiter = createJupiter();
  const saturn = createSaturn();
  const ring = createRing();
  const uranus = createUranus();
  const neptune = createNeptune();

  //createLight();

  //Set the sphere's orbital radius, start angle, and angle increment value
  {
    var mercuryR = 2;
    var mercuryTheta = 0;
    var mercury_dTheta = (2 * Math.PI) / 880;

    var venusR = 2.375;
    var venusTheta = 0;
    var venus_dTheta = (2 * Math.PI) / 2250;

    var earthR = 2.75;
    var earthTheta = 0;
    var earth_dTheta = (2 * Math.PI) / 3650;

    var moonR = 0.1;
    var moonTheta = 0;
    var moon_dTheta = (2 * Math.PI) / 270;

    var marsR = 3;
    var marsTheta = 0;
    var mars_dTheta = (2 * Math.PI) / 6870;

    var jupiterR = 4.25;
    var jupiterTheta = 0;
    var jupiter_dTheta = (2 * Math.PI) / 43800;

    var saturnR = 5;
    var saturnTheta = 0;
    var saturn_dTheta = (2 * Math.PI) / 105850;

    var ringR = 5;
    var ringTheta = 0;
    var ring_dTheta = (2 * Math.PI) / 105850;

    var uranusR = 5.5;
    var uranusTheta = 0;
    var uranus_dTheta = (2 * Math.PI) / 306600;

    var neptuneR = 5.8;
    var neptuneTheta = 0;
    var neptune_dTheta = (2 * Math.PI) / 602250;
  }

  function render() {
    // Updating the rotation of each planet/star
    {
      sun.rotation.y += 0.0025;
      mercury.rotation.y += 0.0005;
      venus.rotation.y += 0.0005;
      earth.rotation.y += 0.0005;
      clouds.rotation.y += 0.0005;
      moon.rotation.y += 0.0025;
      mars.rotation.y += 0.0005;
      jupiter.rotation.y += 0.0015;
      saturn.rotation.y += 0.0015;
      uranus.rotation.y += 0.0015;
      neptune.rotation.y += 0.001;
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

    {
      jupiterTheta += jupiter_dTheta;
      jupiter.position.x = sun.position.x + jupiterR * Math.cos(jupiterTheta);
      jupiter.position.y =
        sun.position.y + (jupiterR * Math.cos(jupiterTheta)) / 5;
      jupiter.position.z = sun.position.z + jupiterR * Math.sin(jupiterTheta);
    }

    {
      saturnTheta += saturn_dTheta;
      saturn.position.x = sun.position.x + saturnR * Math.cos(saturnTheta);
      saturn.position.y =
        sun.position.y + (saturnR * Math.cos(saturnTheta)) / 5;
      saturn.position.z = sun.position.z + saturnR * Math.sin(saturnTheta);
      ringTheta += ring_dTheta;
      ring.position.x = sun.position.x + ringR * Math.cos(ringTheta);
      ring.position.y = sun.position.y + (ringR * Math.cos(ringTheta)) / 5;
      ring.position.z = sun.position.z + ringR * Math.sin(ringTheta);
    }

    {
      uranusTheta += uranus_dTheta;
      uranus.position.x = sun.position.x + uranusR * Math.cos(uranusTheta);
      uranus.position.y =
        sun.position.y + (uranusR * Math.cos(uranusTheta)) / 5;
      uranus.position.z = sun.position.z + uranusR * Math.sin(uranusTheta);
    }

    {
      neptuneTheta += neptune_dTheta;
      neptune.position.x = sun.position.x + neptuneR * Math.cos(neptuneTheta);
      neptune.position.y =
        sun.position.y + (neptuneR * Math.cos(neptuneTheta)) / 5;
      neptune.position.z = sun.position.z + neptuneR * Math.sin(neptuneTheta);
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
createLight();
