document.addEventListener('DOMContentLoaded', () => {
    new Radio();
});

class Radio {
    /**
     * Create a new radio.
     */
    constructor() {
        this.playing = false;

        this.audio = document.getElementById('audio');
        this.canvas = document.getElementById('renderer');
        this.context = this.canvas.getContext('2d');

        this.drawCircle();

        document.addEventListener('mousemove', e => {
            e.preventDefault();
            e.stopPropagation();

            this.context.beginPath();
            this.context.arc(this.center_x, this.center_y, 100, 0, 2 * Math.PI);

            if (this.context.isPointInPath(e.clientX, e.clientY)){
                this.canvas.style.cursor = 'pointer';
            } else {
                this.canvas.style.cursor = 'default';
            }
        });

        this.canvas.addEventListener('click', () => {
            if (this.playing === false) {
                this.play();
            } else {
                this.pause();
            }
        });
    }

    /**
     * Draw a circle.
     */
    drawCircle() {
        let text;
        const radius = 100;

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.center_x = this.canvas.width / 2;
        this.center_y = this.canvas.height / 2;

        this.context.beginPath();
        this.context.arc(this.center_x, this.center_y, radius, 0, 2 * Math.PI);
        this.context.strokeStyle = 'white';
        this.context.stroke();

        if (this.playing === true) {
            text = "\uf04c";
            if (this.audio && this.audio.readyState < 3) {
                text = 'Loading';
            }
        } else {
            text = "\uf04b";
        }

        document.fonts.ready.then(() => {
            this.context.font = '900 24pt "Font Awesome 5 Free"';
            this.context.fillStyle = 'white'
            this.context.textAlign = 'center';
            this.context.fillText(text, this.center_x, this.center_y + 15);
        })
    }

    /**
     * Play the stream
     */
    play() {
        if (!this.dataArray) {
            this.initArray();
        }

        this.playing = true;
        this.audio.play();
        this.animate();
    }

    /**
     * Pause the stream.
     */
    pause() {
        window.cancelAnimationFrame(this.requestID);
        this.playing = false;
        this.drawCircle();
        this.audio.pause();
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
     * Animate.
     * https://www.kkhaydarov.com/audio-visualizer/
     */
    animate() {
        this.drawCircle();

        this.analyser.getByteFrequencyData(this.dataArray);

        const bars = 200;
        const bar_width = 2;
        const radius = 100;

        for (let i = 0; i < bars; i++) {
            const rads = Math.PI * 2 / bars;
            const bar_height = this.dataArray[i] * 0.7;
            const x = this.center_x + Math.cos(rads * i) * (radius);
            const y = this.center_y + Math.sin(rads * i) * (radius);
            const x_end = this.center_x + Math.cos(rads * i) * (radius + bar_height);
            const y_end = this.center_y + Math.sin(rads * i) * (radius + bar_height);
            this.drawBar(x, y, x_end, y_end, bar_width, this.dataArray[i]);
        }

        this.requestID = window.requestAnimationFrame(this.animate.bind(this));
    }

    /**
     * Draw a single bar.
     */
    drawBar(x1, y1, x2, y2, width,frequency) {
        const lineColor = `rgb(${frequency}, ${frequency}, 205)`;
        this.context.strokeStyle = lineColor;
        this.context.lineWidth = width;
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
    }
}
