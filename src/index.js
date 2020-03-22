import Radio from './components/radio';

// Initialize radio
document.addEventListener('DOMContentLoaded', () => {
  const radio = new Radio(
    document.getElementById('audio'),
    document.getElementById('renderer'),
  );

  radio.init(document.getElementById('button'));
});

// Checks if var is object
function isObject(a) {
  return !!a && a.constructor === Object;
}

// renders the listener stats
function renderStats(response) {
  let listenerCount = 0;
  // only one stream, continue as normal
  if (typeof response.icestats.source.listeners !== 'undefined') {
    listenerCount = response.icestats.source.listeners;
  }

  // more than one stream has been listed
  if (
    typeof response.icestats.source[0] !== 'undefined' && isObject(response.icestats.source[0])
  ) {
    // loop through the streams add up all the listeners
    listenerCount = response.icestats.source.reduce((total, source) => total + source.listeners, 0);
  }

  // Update the listener count
  document.getElementById('listeners').innerHTML = listenerCount;
}

// polls server for stats
function statsLoop() {
  // Promise resolves when 200 happens
  const networkPromise = fetch('https://radio.fam.wtf/status-json.xsl', {
    mode: 'no-cors',
  })
    .then(blob => blob.json())
    .then(response => renderStats(response));

  // Promise resolves after 10 seconds
  const timeOutPromise = new Promise((resolve) => {
    setTimeout(resolve, 10000);
  });

  // Once all promises have resolved
  Promise.all([networkPromise, timeOutPromise]).then(() => {
    // Repeat
    statsLoop();
  });
}

// Start polling
statsLoop();
