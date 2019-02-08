import Radio from './components/radio';

document.addEventListener('DOMContentLoaded', () => {
    new Radio(document.getElementById('audio'), document.getElementById('renderer'), document.getElementById('button'));
});
