// main.js
import * as THREE from "three";
import { createThreeContext } from "./threeContext.js";
import { loadMousetrap } from "./mousetrapLoader.js";
import { createTrapGame } from "./trapGame.js";

async function init() {
  const { scene, camera, renderer, controls, startRenderLoop } =
    createThreeContext();

  const progressElement = document.getElementById("progressValue");
  const resetButton = document.getElementById("resetBtn");
  const timerElement = document.getElementById("timer");

  try {
    const { model, mixer, actions, center, size } = await loadMousetrap(scene);

    // Kamera’yı model etrafına güzelce yerleştir
    controls.target.copy(center);
    camera.position
      .copy(center)
      .add(new THREE.Vector3(size * 1, size * 1, size * -1));
    camera.near = size * 0.001;
    camera.far = size * 10;
    camera.lookAt(center);
    camera.updateProjectionMatrix();

    // Oyun/interaction modülü
    const trapGame = createTrapGame({
      renderer,
      camera,
      model,
      actions,
      triggerObjectName: "button",
      progressElement,
      resetButton,
      timerElement,
    });

    // Render loop’ta animasyon update
    startRenderLoop((dt) => {
      if (mixer) mixer.update(dt);
      controls.update();
    });

    // İstersen ileride cleanup:
    // window.addEventListener("beforeunload", () => trapGame.dispose());
  } catch (err) {
    console.error("Failed to load mousetrap:", err);
  }
}

init();
