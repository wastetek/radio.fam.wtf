import Circle from './circle';

export default class Visualiser {
    /**
     * Create a new Visualiser.
     *
     * @param audio
     * @param canvas
     */
    constructor(audio, canvas) {
        this.audio = audio;
        this.canvas = canvas;

        this.context = this.canvas.getContext('2d');

        this.circle = new Circle(this.canvas, this.context);
        this.circle.draw('paused');
    }

    /**
     * Initialise audio analyser array.
     */
    initArray() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = audioContext.createAnalyser();

        const source = audioContext.createMediaElementSource(this.audio);
        source.connect(this.analyser);

        this.analyser.connect(audioContext.destination);
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    }

    /**
     * Stop visualisation animations.
     */
    stop() {
        this.circle.draw('paused');
        window.cancelAnimationFrame(this.requestID);
    }

    /**
     * Animate.
     * https://www.kkhaydarov.com/audio-visualizer/
     */
    animate() {
        if (!this.dataArray) {
            this.initArray();
        }

        if (this.audio && this.audio.readyState < 3) {
            this.circle.draw('loading');
        } else {
            this.circle.draw('playing');
        }

        this.analyser.getByteFrequencyData(this.dataArray);

        const bars = 200;
        const barWidth = 2;
        const radius = 100;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        for (let i = 0; i < bars; i++) {
            const rads = Math.PI * 2 / bars;
            const barHeight = this.dataArray[i] * 0.7;
            const x = centerX + Math.cos(rads * i) * (radius);
            const y = centerY + Math.sin(rads * i) * (radius);
            const xEnd = centerX + Math.cos(rads * i) * (radius + barHeight);
            const yEnd = centerY + Math.sin(rads * i) * (radius + barHeight);
            this.drawBar(x, y, xEnd, yEnd, barWidth, this.dataArray[i]);
        }

        this.requestID = window.requestAnimationFrame(this.animate.bind(this));
    }

    /**
     * Draw a single bar.
     */
    drawBar(x1, y1, x2, y2, width, frequency) {
        const lineColor = `rgb(${frequency}, ${frequency}, 255)`;
        this.context.strokeStyle = lineColor;
        this.context.lineWidth = width;
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
    }
}
