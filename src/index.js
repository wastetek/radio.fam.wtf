import Radio from "./components/radio";

// Initialize radio
document.addEventListener("DOMContentLoaded", () => {
  new Radio(
    document.getElementById("audio"),
    document.getElementById("renderer"),
    document.getElementById("button")
  );
});

// Checks if var is object
function isObject(a) {
  return !!a && a.constructor === Object;
}

// renders the lisntener stats
function renderStats(response) {
  var listenerCount = 0;
  // only one stream, continue as normal
  if (typeof response.icestats.source.listeners !== "undefined") {
    listenerCount = response.icestats.source.listeners;
  }

  // more than one stream has been listed
  if (
    typeof response.icestats.source[0] !== "undefined" &&
    isObject(response.icestats.source[0])
  ) {
    // loop through the streams
    response.icestats.source.forEach(item => {
      // add up all the listeners
      listenerCount += item.listeners;
    });
  }

  // Update the listener count
  document.getElementById("listeners").innerHTML = listenerCount;
}

// polls server for stats
function statsLoop() {
  // Promise resolves when 200 happens
  var networkPromise = fetch("https://radio.fam.wtf/status-json.xsl", {
    mode: "no-cors"
  })
    .then(blob => blob.json())
    .then(response => renderStats(response));

  // Promise resolves after 10 seconds
  var timeOutPromise = new Promise(function(resolve, reject) {
    setTimeout(resolve, 10000);
  });

  // Once all promises have resolved
  Promise.all([networkPromise, timeOutPromise]).then(function(values) {
    // Repeat
    statsLoop();
  });
}

// Start polling
statsLoop();
