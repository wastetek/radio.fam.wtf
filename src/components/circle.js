export default class Circle {
    /**
     * Create a new Circle.
     *
     * @param canvas
     * @param context
     */
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.radius = 100;

        document.addEventListener('mousemove', e => {
            e.preventDefault();
            e.stopPropagation();

            this.context.beginPath();
            this.context.arc(this.center_x, this.center_y, this.radius, 0, 2 * Math.PI);

            if (this.context.isPointInPath(e.clientX, e.clientY)){
                this.canvas.style.cursor = 'pointer';
            } else {
                this.canvas.style.cursor = 'default';
            }
        });
    }

    /**
     * Draw a circle with the supplied text in the center.
     *
     * @param text
     */
    draw(text) {
        this.initCanvas();

        this.context.beginPath();
        this.context.arc(this.center_x, this.center_y, this.radius, 0, 2 * Math.PI);
        this.context.strokeStyle = 'white';
        this.context.stroke();

        if (!text || text === 'paused') {
            text = "\uf04b";
        } else if (text === 'playing') {
            text = '\uf04c';
        } else if (text === 'loading') {
            text = "Loading";
        }

        document.fonts.ready.then(() => {
            this.context.font = '900 24pt "Font Awesome 5 Free"';
            this.context.fillStyle = 'white'
            this.context.textAlign = 'center';
            this.context.fillText(text, this.center_x, this.center_y + 15);
        })
    }

    /**
     * Set the canvas to the window width and get the center point.
     */
    initCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.center_x = this.canvas.width / 2;
        this.center_y = this.canvas.height / 2;
    }
}
