const speedValueEl = document.getElementById("speedValue");
export function increase(currentSpeed) {
  return currentSpeed + 10;
}

export function update(currentSpeed) {
  speedValueEl.style.height = `${currentSpeed}%`;
  if (currentSpeed >= 100) currentSpeed = 90;
  currentSpeed -= 1;
  if (currentSpeed < 0) currentSpeed = 0;
  return currentSpeed;
}
