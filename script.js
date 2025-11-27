let scene, camera, renderer, controls;
let carModel;
let lightsOn = false;

init();
animate();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    500
  );
  camera.position.set(2.5, 1.2, 4);

  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("scene"),
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1;

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  const directional = new THREE.DirectionalLight(0xffffff, 1);
  directional.position.set(5, 10, 5);
  scene.add(directional);

  const loader = new THREE.GLTFLoader();
  loader.load(
    "models/yourModel.gltf",
    gltf => {
      carModel = gltf.scene;
      scene.add(carModel);
    }
  );

  document.getElementById("toggleLights").addEventListener("click", toggleLights);

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
}

function toggleLights() {
  if (!carModel) return;

  lightsOn = !lightsOn;

  carModel.traverse(obj => {
    if (obj.isMesh && obj.material) {
      if (obj.name.toLowerCase().includes("light")) {
        if (lightsOn) {
          obj.material.emissive = new THREE.Color(1, 1, 1);
          obj.material.emissiveIntensity = 6;
        } else {
          obj.material.emissive = new THREE.Color(0, 0, 0);
          obj.material.emissiveIntensity = 0;
        }
      }
    }
  });

  document.getElementById("toggleLights").textContent =
    lightsOn ? "Lights on" : "Lights off";
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
