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
        const bar_width = 2;
        const radius = 100;
        const center_x = this.canvas.width / 2;
        const center_y = this.canvas.height / 2;

        for (let i = 0; i < bars; i++) {
            const rads = Math.PI * 2 / bars;
            const bar_height = this.dataArray[i] * 0.7;
            const x = center_x + Math.cos(rads * i) * (radius);
            const y = center_y + Math.sin(rads * i) * (radius);
            const x_end = center_x + Math.cos(rads * i) * (radius + bar_height);
            const y_end = center_y + Math.sin(rads * i) * (radius + bar_height);
            this.drawBar(x, y, x_end, y_end, bar_width, this.dataArray[i]);
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
