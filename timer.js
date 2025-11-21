const timerEl = document.getElementById("timer");

let totalSteps = 1000; // 1000 steps = 10 seconds
let interval = null;

function formatTimer() {
  const seconds = Math.floor(totalSteps / 100);
  const centiseconds = totalSteps % 100;
  timerEl.textContent = `${String(seconds).padStart(2, "0")}:${String(
    centiseconds
  ).padStart(2, "0")}`;
}

export function resetTimer() {
  totalSteps = 1000;
  format();
}

export function startTimer() {
  if (interval) clearInterval(interval);

  totalSteps = 1000;
  interval = setInterval(() => {
    if (totalSteps > 0) {
      totalSteps--;
      format();
    } else {
      clearInterval(interval);
    }
  }, 10);
}
