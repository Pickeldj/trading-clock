// Use modern fake timers for setTimeout
jest.useFakeTimers('modern');

// Mock the global Audio object
const mockAudio = { play: jest.fn(), pause: jest.fn(), currentTime: 0 };
global.Audio = jest.fn(() => mockAudio);

// Import the functions to be tested from renderer.js
const renderer = require('./renderer.js');
const isMarketOpen = renderer.isMarketOpen;
const playAlarmSound = renderer.playAlarmSound;
const updateClock = renderer.updateClock;

// Mock the electron module
jest.mock('electron', () => {
  const path = require('path');
  return {
    app: {
      getPath: jest.fn().mockReturnValue(path.resolve(__dirname, './release-builds/trading-clock-win32-x64/trading-clock.exe')),
      whenReady: jest.fn().mockResolvedValue(),
    },
    BrowserWindow: jest.fn().mockImplementation(() => ({
      loadFile: jest.fn(),
      on: jest.fn(),
      setAutoHideMenuBar: jest.fn(),
      webContents: {
        on: jest.fn(),
        insertCSS: jest.fn(),
      },
    })),
  };
}, { virtual: true });

// Mock the global document object
global.document = {
  getElementById: jest.fn().mockReturnValue({
    textContent: '',
    classList: {
      add: jest.fn(),
      remove: jest.fn()
    }
  })
};

// Mock the global Date object
global.Date = class extends Date {
  constructor(date) {
    if (date) {
      // If a date string is provided, pass it to the real Date constructor
      super(date);
    } else {
      // If no date string is provided, return a fixed date
      return new Date('2022-01-01T00:00:00Z');
    }
  }

  static now() {
    return new Date('2022-01-01T00:00:00Z').getTime();
  }
};

// Set up JSDOM to simulate a browser environment
const { JSDOM } = require('jsdom');
const dom = new JSDOM(`<!doctype html><html><body><div id="london-time"></div><div id="new-york-time"></div><div id="tokyo-time"></div><div id="sydney-time"></div></body></html>`);
global.window = dom.window;
global.document = dom.window.document;

// Test that the alarm bell plays for 10 seconds
test('Alarm bell plays for 10 seconds', () => {
    // Spy on global.setTimeout
    jest.spyOn(global, 'setTimeout');

    // Set the system time to a fixed date
    jest.setSystemTime(new Date('2022-01-01T00:00:00Z'));
  
    playAlarmSound();
  
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10000);
  
    // Advance the timers by 10 seconds
    jest.advanceTimersByTime(10000);
  
    expect(mockAudio.pause).toHaveBeenCalled();
    expect(mockAudio.currentTime).toBe(0);
});

// Test that the updateClock function updates the time correctly
test('updateClock updates the time correctly', () => {
    jest.resetAllMocks();
    // Call the updateClock function
    updateClock();
  
    // Check that the textContent of each div has been updated correctly
    expect(document.getElementById('london-time').textContent).toBe('London: 00:00:00');
    expect(document.getElementById('new-york-time').textContent).toBe('New York: 19:00:00');
    expect(document.getElementById('tokyo-time').textContent).toBe('Tokyo: 09:00:00');
    expect(document.getElementById('sydney-time').textContent).toBe('Sydney: 11:00:00');
});

// Helper function to generate tests for each city
function testCity(city, openHour, closeHour) {
  // Test that the alarm bell plays on market open
  test(`Alarm bell plays on market open for ${city}`, () => {
    jest.resetAllMocks();
    const currentTime = new Date('2022-01-01T00:00:00Z');
    currentTime.setUTCHours(openHour);
    currentTime.setUTCMinutes(1);  // Set the time to one minute after the opening hour

    if (isMarketOpen(currentTime, openHour, closeHour)) {
      playAlarmSound();
    }

    expect(mockAudio.play).toHaveBeenCalled();
  });

  // Test that the alarm bell plays on market close
  test(`Alarm bell plays on market close for ${city}`, () => {
    jest.resetAllMocks();
    const currentTime = new Date('2022-01-01T00:00:00Z');
    currentTime.setUTCHours(closeHour);
    currentTime.setUTCMinutes(1);  // Set the time to one minute after the closing hour

    if (!isMarketOpen(currentTime, openHour, closeHour)) {
      playAlarmSound();
    }

    expect(mockAudio.play).toHaveBeenCalled();
  });
}

// Test each city
testCity('London', 8, 16.5);
testCity('New York', 16.5, 21);
testCity('Tokyo', 0, 6);
testCity('Sydney', 22, 5);
