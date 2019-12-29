import Radio from './components/radio';

document.addEventListener('DOMContentLoaded', () => {
    new Radio(document.getElementById('audio'), document.getElementById('renderer'), document.getElementById('button'));
});

fetch('https://radio.fam.wtf/status-json.xsl', { mode: 'no-cors' }).then(blob => blob.json())
    .then((response) => {
        document.getElementById('listeners').innerHTML = response.icestats.source.listeners;
    });
