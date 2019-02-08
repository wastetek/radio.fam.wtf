import Visualiser from './visualiser';

export default class Radio {
    /**
     * Create a new Radio.
     *
     * @param audio
     * @param canvas
     * @param button
     */
    constructor(audio, canvas, button) {
        this.audio = audio;
        this.canvas = canvas;
        this.playing = false;

        this.visualiser = new Visualiser(this.audio, this.canvas);

        button.addEventListener('click', () => {
            if (this.playing === false) {
                this.play();
            } else {
                this.pause();
            }
        });
    }

    /**
     * Play the stream
     */
    play() {
        this.playing = true;
        this.audio.play();
        this.visualiser.animate();
    }

    /**
     * Pause the stream.
     */
    pause() {
        this.playing = false;
        this.audio.pause();
        this.visualiser.stop();
    }
}
