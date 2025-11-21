// mousetrapLoader.js
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export async function loadMousetrap(scene) {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      "./mousetrap.glb",
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        // Kamera framing için bounding box
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());

        // AnimationMixer & actions
        const mixer = new THREE.AnimationMixer(model);
        const actions = gltf.animations.map((clip) => {
          const a = mixer.clipAction(clip);
          a.setLoop(THREE.LoopOnce, 1);
          a.clampWhenFinished = true;
          a.timeScale = 2.0;
          a.paused = true; // başta durgun
          a.enabled = true;
          a.reset();
          return a;
        });

        // Trigger objesini isme göre bulmak için helper
        const getTriggerMesh = (name = "button") => model.getObjectByName(name);

        resolve({
          model,
          mixer,
          actions,
          center,
          size,
          getTriggerMesh,
        });
      },
      undefined,
      (err) => {
        reject(err);
      }
    );
  });
}
