function loadData() {
  const data = localStorage.getItem('dripData');
  return data ? JSON.parse(data) : {};
}

function saveData(data) {
  localStorage.setItem('dripData', JSON.stringify(data));
}

function getDateKey(date) {
  return date.toISOString().split('T')[0];
}

function renderCalendar() {
  const calendarEl = document.getElementById('calendar');
  calendarEl.innerHTML = '';
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const start = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (start.getDay() + 6) % 7; // Monday first
  const data = loadData();

  for (let i = 0; i < offset; i++) {
    const empty = document.createElement('div');
    calendarEl.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const key = getDateKey(date);
    const div = document.createElement('div');
    div.className = 'day';
    if (data[key]) {
      div.classList.add('marked');
      div.textContent = '💦';
    } else {
      div.textContent = day;
    }
    div.addEventListener('click', () => {
      data[key] = !data[key];
      saveData(data);
      renderCalendar();
      updateStats();
    });
    calendarEl.appendChild(div);
  }
}

function updateStats() {
  const now = new Date();
  const year = now.getFullYear();
  const start = new Date(year, 0, 1);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const data = loadData();
  let count = 0;
  let streak = 0;
  let maxStreak = 0;
  let currentStreak = 0;
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const key = getDateKey(d);
    if (data[key]) {
      count++;
      if (streak > maxStreak) maxStreak = streak;
      streak = 0;
    } else {
      streak++;
    }
    if (d.getTime() === today.getTime()) {
      currentStreak = streak;
    }
  }
  if (streak > maxStreak) maxStreak = streak;
  document.getElementById('yearly-count').textContent = count;
  document.getElementById('current-streak').textContent = currentStreak;
  document.getElementById('max-streak').textContent = maxStreak;
}

document.getElementById('share').addEventListener('click', () => {
  navigator.clipboard.writeText(location.href).then(() => {
    alert('Ссылка скопирована!');
  });
});

renderCalendar();
updateStats();
