// threeContext.js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

export function createThreeContext() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  // Lights
  RectAreaLightUniformsLib.init();
  const rectLight = new THREE.RectAreaLight(0xffffff, 1, 5, 5);
  rectLight.position.set(1, 1, 0);
  rectLight.lookAt(0, 0, 0);
  scene.add(rectLight);
  scene.add(new THREE.AmbientLight(0xffffff, 0.2));

  // Render loop
  const clock = new THREE.Clock();

  function startRenderLoop(onUpdate) {
    renderer.setAnimationLoop(() => {
      const dt = clock.getDelta();
      if (typeof onUpdate === "function") {
        onUpdate(dt);
      }
      renderer.render(scene, camera);
    });
  }

  // Responsive
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return {
    scene,
    camera,
    renderer,
    controls,
    startRenderLoop,
  };
}
