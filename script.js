const CONFIG = {
  eventName: "DOORS ACCESS GRANTED UPDATE",
  eventSubtitle: "When Does The Next DOORS Update Happen?",
  eventDate: "2026-10-02", 
  eventHour12: 8,
  eventMinute: 0,
  eventAmPm: "PM",
  eventTimeZone: "America/New_York"
};

document.addEventListener("DOMContentLoaded", () => {
  const eventTitleEl = document.getElementById("event-title");
  const eventSubtitleEl = document.getElementById("event-subtitle");
  const statusEl = document.getElementById("status");
  const dateEl = document.getElementById("date");
  const countdownEl = document.getElementById("countdown");
  const daysEl = document.getElementById("d");
  const hoursEl = document.getElementById("h");
  const minsEl = document.getElementById("m");
  const secsEl = document.getElementById("s");
  
  const tzSelect = document.getElementById("tz");
  const hhInput = document.getElementById("hh");
  const mmInput = document.getElementById("mm");
  const ampmSelect = document.getElementById("ampm");
  const fullscreenBtn = document.getElementById("fullscreen-btn");

  eventTitleEl.textContent = CONFIG.eventName;
  eventSubtitleEl.textContent = CONFIG.eventSubtitle;
  hhInput.value = CONFIG.eventHour12;
  mmInput.value = CONFIG.eventMinute.toString().padStart(2, '0');
  ampmSelect.value = CONFIG.eventAmPm.toUpperCase();

  const timezones = Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone') : ['UTC'];
  const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  timezones.forEach(tz => {
    const opt = document.createElement("option");
    opt.value = tz;
    opt.textContent = tz;
    if (tz === userTz) opt.selected = true;
    tzSelect.appendChild(opt);
  });

  function getTargetDate() {
    let hour24 = CONFIG.eventHour12 % 12;
    if (CONFIG.eventAmPm.toUpperCase() === "PM") hour24 += 12;

    const [year, month, day] = CONFIG.eventDate.split("-").map(Number);
    const dateStr = `${CONFIG.eventDate}T${String(hour24).padStart(2, '0')}:${String(CONFIG.eventMinute).padStart(2, '0')}:00`;
    return new Date(dateStr);
  }

  const targetDate = getTargetDate();

  function updateDateDisplay() {
    const selectedTz = tzSelect.value;
    try {
      const formatted = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeStyle: 'long',
        timeZone: selectedTz
      }).format(targetDate);

      dateEl.textContent = `Event Time (${selectedTz}): ${formatted}`;
    } catch (e) {
      dateEl.textContent = `Target: ${targetDate.toString()}`;
    }
  }

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) {
      statusEl.textContent = "The event has started!";
      countdownEl.hidden = true;
      return;
    }

    statusEl.textContent = "Countdown to Update:";
    countdownEl.hidden = false;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days;
    hoursEl.textContent = hours;
    minsEl.textContent = minutes;
    secsEl.textContent = seconds;
  }

  tzSelect.addEventListener("change", updateDateDisplay);

  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        alert(`Error attempting to enable fullscreen: ${err.message}`);
      });
      fullscreenBtn.textContent = "Exit Streamer Fullscreen";
    } else {
      document.exitFullscreen();
      fullscreenBtn.textContent = "Enter Streamer Fullscreen";
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
      fullscreenBtn.textContent = "Enter Streamer Fullscreen";
    }
  });

  updateDateDisplay();
  updateCountdown();
  setInterval(updateCountdown, 1000);
});
