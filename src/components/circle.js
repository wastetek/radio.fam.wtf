export default class Circle {
    /**
     * Create a new Circle.
     *
     * @param canvas
     * @param context
     * @param radius
     */
    constructor(canvas, context, radius = 100) {
        this.canvas = canvas;
        this.context = context;
        this.radius = radius;

        this.icon = document.getElementById('icon');
    }

    /**
     * Draw a circle with the supplied icon in the center.
     *
     * @param icon
     */
    draw(state = 'paused') {
        this.initCanvas();

        this.context.beginPath();
        this.context.arc(this.center_x, this.center_y, this.radius, 0, 2 * Math.PI);
        this.context.strokeStyle = 'white';
        this.context.stroke();

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
