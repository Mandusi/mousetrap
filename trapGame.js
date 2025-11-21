// trapGame.js
import * as THREE from "three";
import * as Speed from "./speed.js";
import * as Timer from "./timer.js";
import { time } from "three/tsl";

const INITIAL_PROGRESS = 10000;

export function createTrapGame({
  renderer,
  camera,
  model,
  actions,
  triggerObjectName = "button",
  progressElement,
  resetButton,
  timerElement,
}) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  let speed = 0;
  let progress = INITIAL_PROGRESS;
  let canTrigger = true;
  let progressIntervalId = null;
  let timerIntervalId = null;
  let totalSteps = 1000;

  if (progressElement) {
    progressElement.style.height = "100%";
  }

  function formatTimer() {
    const seconds = Math.floor(totalSteps / 100);
    const centiseconds = totalSteps % 100;
    timerElement.textContent = `${String(seconds).padStart(2, "0")}:${String(
      centiseconds
    ).padStart(2, "0")}`;
  }

  function resetTimer() {
    totalSteps = 1000;
    formatTimer();
  }

  function stopTimer() {
    if (timerIntervalId) clearInterval(timerIntervalId);
  }

  function startTimer() {
    if (timerIntervalId) clearInterval(timerIntervalId);

    totalSteps = 1000;
    timerIntervalId = setInterval(() => {
      if (totalSteps > 0) {
        totalSteps--;
        formatTimer();
      } else {
        clearInterval(timerIntervalId);
      }
    }, 10);
  }

  // Progress & speed update loop
  function startProgressLoop() {
    if (progressIntervalId) clearInterval(progressIntervalId);

    progressIntervalId = setInterval(() => {
      speed = Speed.update(speed);
      progress -= speed;
      if (progress < 0) progress = 0;

      if (progressElement) {
        progressElement.style.height = `${Math.ceil(progress / 100)}%`;
      }
    }, 100);
  }

  startProgressLoop();

  // Animasyonları oynat
  function playAllAnimations() {
    actions.forEach((a) => {
      a.reset();
      a.paused = false;
      a.play();
    });
  }

  // Reset logic
  function resetGame() {
    progress = INITIAL_PROGRESS;
    speed = 0;
    resetTimer();
    canTrigger = true;

    actions.forEach((a) => {
      a.reset();
      a.paused = true;
    });

    if (progressElement) {
      progressElement.style.height = "100%";
    }
  }

  // Canvas click handler
  function onCanvasClick(e) {
    if (!canTrigger || !model || !actions.length) return;

    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const trapTrigger = model.getObjectByName(triggerObjectName);
    if (!trapTrigger) return;

    const hits = raycaster.intersectObject(trapTrigger, true);
    if (!hits.length) return;

    speed = Speed.increase(speed);

    if (totalSteps === 1000) startTimer();
    if (speed < 75) return;

    canTrigger = false;
    stopTimer();
    timerElement.style.color = "tomato";
    playAllAnimations();
  }

  renderer.domElement.addEventListener("click", onCanvasClick);

  resetButton.addEventListener("click", resetGame);

  // Dışarıya simple API döndürelim
  return {
    reset: resetGame,
    dispose() {
      renderer.domElement.removeEventListener("click", onCanvasClick);
      if (progressIntervalId) clearInterval(progressIntervalId);
      Timer.reset();
    },
  };
}
