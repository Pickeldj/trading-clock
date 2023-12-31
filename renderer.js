// Define market opening and closing times for different cities
const londonOpenTime = 8;
const londonCloseTime = 16.5; // 4:30 PM
const newYorkOpenTime = 9.5; // 9:30 AM
const newYorkCloseTime = 16; // 4:00 PM
const sydneyOpenTime = 10;
const sydneyCloseTime = 16;
const tokyoOpenTime = 9;
const tokyoCloseTime = 15; // 3:00 PM

// Create an audio object for the alarm sound
const alarmSound = new Audio('./alerts/thinkorswim_bell.mp3');

// Function to check if the market is open based on the current time
function isMarketOpen(time, openHour, closeHour) {
  let currentHour = time.getHours();
  let currentMinute = time.getMinutes();
  let openMinute = (openHour % 1) * 60;
  let closeMinute = (closeHour % 1) * 60;

  openHour = Math.floor(openHour);
  closeHour = Math.floor(closeHour);

  if (openHour < closeHour) {
    // Market opens and closes on the same day
    if (currentHour > openHour && currentHour < closeHour) {
      return true;
    }
    if (currentHour === openHour && currentMinute >= openMinute) {
      return true;
    }
    if (currentHour === closeHour && currentMinute < closeMinute) {
      return true;
    }
  } else {
    // Market is open overnight
    if (currentHour > openHour || (currentHour === openHour && currentMinute >= openMinute)) {
      return true;
    }
    if (currentHour < closeHour || (currentHour === closeHour && currentMinute < closeMinute)) {
      return true;
    }
  }

  return false;
}

// Function to play the alarm sound
function playAlarmSound() {
  alarmSound.play();
  setTimeout(() => {
    alarmSound.pause();
    alarmSound.currentTime = 0;
  }, 10000); // stop after 10 seconds
}

// Function to update the clock and market status
function updateClock() {
  let currentTime = new Date();

  // Get the current time in different time zones
  let londonTime = new Date(currentTime.toLocaleString("en-US", {timeZone: "Europe/London"}));
  let newYorkTime = new Date(currentTime.toLocaleString("en-US", {timeZone: "America/New_York"}));
  let tokyoTime = new Date(currentTime.toLocaleString("en-US", {timeZone: "Asia/Tokyo"}));
  let sydneyTime = new Date(currentTime.toLocaleString("en-US", {timeZone: "Australia/Sydney"}));

  // Update the displayed times for each city
  document.getElementById('london-time').textContent = `London: ${londonTime.toLocaleTimeString()}`;
  document.getElementById('new-york-time').textContent = `New York: ${newYorkTime.toLocaleTimeString()}`;
  document.getElementById('tokyo-time').textContent = `Tokyo: ${tokyoTime.toLocaleTimeString()}`;
  document.getElementById('sydney-time').textContent = `Sydney: ${sydneyTime.toLocaleTimeString()}`;

    // Function to check if the alarm should be played
    function shouldPlayAlarm(time, marketTime) {
      let diff = Math.abs(time - marketTime);
      return diff <= 1000; // 1000 milliseconds = 1 second
    }

 // Check if the market is open and change the background color
 if (isMarketOpen(londonTime, londonOpenTime, londonCloseTime)) {
  document.getElementById('london-time').classList.add('open');
  if (shouldPlayAlarm(londonTime.getTime(), new Date(londonTime.getFullYear(), londonTime.getMonth(), londonTime.getDate(), Math.floor(londonOpenTime), (londonOpenTime % 1) * 60).getTime())) {
    playAlarmSound();
  }
  if (shouldPlayAlarm(londonTime.getTime(), new Date(londonTime.getFullYear(), londonTime.getMonth(), londonTime.getDate(), Math.floor(londonCloseTime), (londonCloseTime % 1) * 60).getTime())) {
    playAlarmSound();
  }
} else {
  document.getElementById('london-time').classList.remove('open');
}

if (isMarketOpen(newYorkTime, newYorkOpenTime, newYorkCloseTime)) {
  document.getElementById('new-york-time').classList.add('open');
  if (shouldPlayAlarm(newYorkTime.getTime(), new Date(newYorkTime.getFullYear(), newYorkTime.getMonth(), newYorkTime.getDate(), Math.floor(newYorkOpenTime), (newYorkOpenTime % 1) * 60).getTime())) {
    playAlarmSound();
  }
  if (shouldPlayAlarm(newYorkTime.getTime(), new Date(newYorkTime.getFullYear(), newYorkTime.getMonth(), newYorkTime.getDate(), Math.floor(newYorkCloseTime), (newYorkCloseTime % 1) * 60).getTime())) {
    playAlarmSound();
  }
} else {
  document.getElementById('new-york-time').classList.remove('open');
}

if (isMarketOpen(tokyoTime, tokyoOpenTime, tokyoCloseTime)) {
  document.getElementById('tokyo-time').classList.add('open');
  if (shouldPlayAlarm(tokyoTime.getTime(), new Date(tokyoTime.getFullYear(), tokyoTime.getMonth(), tokyoTime.getDate(), Math.floor(tokyoOpenTime), (tokyoOpenTime % 1) * 60).getTime())) {
    playAlarmSound();
  }
  if (shouldPlayAlarm(tokyoTime.getTime(), new Date(tokyoTime.getFullYear(), tokyoTime.getMonth(), tokyoTime.getDate(), Math.floor(tokyoCloseTime), (tokyoCloseTime % 1) * 60).getTime())) {
    playAlarmSound();
  }
} else {
  document.getElementById('tokyo-time').classList.remove('open');
}

if (isMarketOpen(sydneyTime, sydneyOpenTime, sydneyCloseTime)) {
  document.getElementById('sydney-time').classList.add('open');
  if (shouldPlayAlarm(sydneyTime.getTime(), new Date(sydneyTime.getFullYear(), sydneyTime.getMonth(), sydneyTime.getDate(), Math.floor(sydneyOpenTime), (sydneyOpenTime % 1) * 60).getTime())) {
    playAlarmSound();
  }
  if (shouldPlayAlarm(sydneyTime.getTime(), new Date(sydneyTime.getFullYear(), sydneyTime.getMonth(), sydneyTime.getDate(), Math.floor(sydneyCloseTime), (sydneyCloseTime % 1) * 60).getTime())) {
    playAlarmSound();
  }
} else {
  document.getElementById('sydney-time').classList.remove('open');
}
}

// Update the clock every second
setInterval(updateClock, 1000);

// Export the necessary functions
module.exports = {
isMarketOpen,
playAlarmSound,
updateClock
};