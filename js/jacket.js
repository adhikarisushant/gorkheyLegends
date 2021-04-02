// variables for setup

let container;
let camera;
let scene;
let jacket;
let controls;
let spotLight;

var mouseX = 0;
var mouseY = 0;

var targetX = 0;
var targetY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
function init() {
  container = document.querySelector("#jacket");
  // Create scene (Surrounding)
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const fov = 28;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 1;
  const far = 20000;

  //Camera setup
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 0.2, 11);

  // Hemi Light
  //   const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x0880828, 5);
  //   scene.add(hemiLight);

  var pointLight = new THREE.PointLight(0xffffff, 10, 500);
  pointLight.position.set(10, 10, 15);
  scene.add(pointLight);

  //   var sphereSize = 1;
  //   var pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
  //   scene.add(pointLightHelper);

  // Renderer
  renderer = new THREE.WebGLRenderer({ anitialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  //Load Model
  let loader = new THREE.GLTFLoader();
  loader.load("./jacket/scene.gltf", function (gltf) {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());
    gltf.scene.position.x += gltf.scene.position.x - (center.x + 0.1);
    gltf.scene.position.y += gltf.scene.position.y - center.y;
    gltf.scene.position.z += gltf.scene.position.z - center.z;
    scene.add(gltf.scene);
    jacket = gltf.scene.children[0];
    animate();
  });
}

function animate() {
  requestAnimationFrame(animate);
  jacket.rotation.z += 0.02;
  render();
}

init();

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);
container.addEventListener("mousemove", onDocumentMouseMove, false);

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}
function render() {
  targetX = mouseX * 0.0005;
  targetY = mouseY * 0.0003;

  if (jacket) {
    // jacket.rotation.y += 0.5 * (targetY - jacket.rotation.y);
  }

  renderer.render(scene, camera);
}
