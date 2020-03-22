export default class Visualiser {
  /**
   * Create a new Visualiser.
   *
   * @param audio
   * @param canvas
   */
  constructor(audio, canvas, icon) {
    this.audio = audio;
    this.canvas = canvas;
    this.icon = icon;

    this.context = this.canvas.getContext('2d');
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
   * Set the canvas to the window width and get the center point.
   */
  initCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
  }

  /**
   * Stop visualisation animations.
   */
  stop() {
    this.setIcon('paused');
    this.initCanvas();
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
      this.setIcon('loading');
    } else {
      this.setIcon('playing');
    }

    this.initCanvas();

    this.analyser.getByteFrequencyData(this.dataArray);

    const bars = 200;
    const barWidth = 2;
    const radius = 100;

    for (let i = 0; i < bars; i += 1) {
      const rads = Math.PI * 2 / bars;
      const barHeight = this.dataArray[i] * 0.7;
      const x = this.centerX + Math.cos(rads * i) * (radius);
      const y = this.centerY + Math.sin(rads * i) * (radius);
      const xEnd = this.centerX + Math.cos(rads * i) * (radius + barHeight);
      const yEnd = this.centerY + Math.sin(rads * i) * (radius + barHeight);
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

  /**
   * Update the icon state.
   *
   * @param state
   */
  setIcon(state) {
    let icon;

    if (state === 'paused') {
      icon = 'fa-play';
    } else if (state === 'playing') {
      icon = 'fa-pause';
    } else if (state === 'loading') {
      icon = 'fa-spinner fa-pulse';
    }

    this.icon.className = `fas ${icon} fa-2x`;
  }
}
