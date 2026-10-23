const CONFIG = {
  eventName: "The Candy Vault 2026.10.22 Update",
  eventSubtitle: "The Candy Vault 2026 Update is out! Go play it!     ( No Update Scheduled at this moment, also ignore the glitched date )",     // When Does The Next DOORS Update Happen?
  eventDate: "2026-10-22", 
  eventHour12: 12,
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

  eventTitleEl.textContent = CONFIG.eventName;
  eventSubtitleEl.textContent = CONFIG.eventSubtitle;
  document.title = `${CONFIG.eventName} - Countdown`;

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

    const [year, month, day] = CONFIG.eventDate.split('-').map(Number);
    const targetUtcGuess = Date.UTC(year, month - 1, day, hour24, CONFIG.eventMinute, 0);

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: CONFIG.eventTimeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });

    const parts = formatter.formatToParts(new Date(targetUtcGuess));
    const p = {};
    for (const part of parts) {
      if (part.type !== 'literal') p[part.type] = parseInt(part.value, 10);
    }
    const targetHour = p.hour === 24 ? 0 : p.hour;
    const actualDateInTz = Date.UTC(p.year, p.month - 1, p.day, targetHour, p.minute, p.second);
    const offset = targetUtcGuess - actualDateInTz;

    return new Date(targetUtcGuess + offset);
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

    statusEl.textContent = "When Does The Next DOORS Update Happen?   -- Made By Bandana";
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

  updateDateDisplay();
  updateCountdown();
  setInterval(updateCountdown, 1000);
});
