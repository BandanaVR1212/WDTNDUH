const CONFIG = {
  eventName: "CANDY VAULT 2026 Update",
  eventSubtitle: "The update already dropped go play it!",
  eventDate: "2026-10-23", 
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

  eventTitleEl.textContent = CONFIG.eventName;
  eventSubtitleEl.textContent = CONFIG.eventSubtitle;

  function getTargetDateUTC(config) {
    let hour24 = config.eventHour12 % 12;
    if (config.eventAmPm.toUpperCase() === "PM") hour24 += 12;

    const [year, month, day] = config.eventDate.split('-').map(Number);
    const targetUtcGuess = Date.UTC(year, month - 1, day, hour24, config.eventMinute, 0);

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: config.eventTimeZone,
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

  const targetDate = getTargetDateUTC(CONFIG);

  const timezones = Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone') : ['UTC', CONFIG.eventTimeZone];
  const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  timezones.forEach(tz => {
    const opt = document.createElement("option");
    opt.value = tz;
    opt.textContent = tz.replace(/_/g, " ");
    if (tz === userTz) opt.selected = true;
    tzSelect.appendChild(opt);
  });

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
      dateEl.textContent = `Target: ${targetDate.toUTCString()}`;
    }
  }

  function updateCountdown() {
    const now = Date.now();
    const distance = targetDate.getTime() - now;

    if (distance <= 0) {
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

  updateDateDisplay();
  updateCountdown();
  setInterval(updateCountdown, 1000);
});
