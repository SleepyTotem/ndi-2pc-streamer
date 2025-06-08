function showAlert(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.classList.add('show');
  setTimeout(() => {
    notification.classList.remove('show');
  }, 4000);
}

function updateStatusIconAndText(isRunning) {
  const icon = document.getElementById('status-icon');
  const text = document.getElementById('status-text');

  if (isRunning) {
    icon.textContent = '✅';
    text.textContent = 'Running';
  } else {
    icon.textContent = '⛔';
    text.textContent = 'Stopped';
  }
}

async function toggle() {
  const result = await window.api.invoke('toggle-process');
  showAlert(result.message);
}

setInterval(async () => {
  const isRunning = await window.api.invoke('get-status');
  updateStatusIconAndText(isRunning);
}, 200);

(async () => {
  const isRunning = await window.api.invoke('get-status');
  updateStatusIconAndText(isRunning);
})();