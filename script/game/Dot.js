class Dot {
    constructor(center, radius, color) {
        this.center = center;
        this.radius = radius;
        this.color = color;        
    }

    draw(renderer) {
        renderer.fillCircle(this.center, this.radius, this.color);

    }

    update() {
    }
};