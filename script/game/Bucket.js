class Bucket {
    constructor(position, width, height, score) {
        this.width = width;
        this.height = height;
        this.position = position;
        this.left = position.x;
        this.top = position.y;
        this.right = this.left + width;
        this.bottom = this.right + height;
        this.center = new Vector2(this.left + width / 2, this.top + height / 2);
        this.score = score;     
        this.createFont();   
    }

    createFont() {
        var fontSize = this.height / 2;
        this.font = fontSize + "px serif";
    }

    draw(renderer) {
        renderer.fillRectangle(this.position, this.width, this.height,
            "rgba(10, 104, 104, 1)");
        renderer.strokeRectangle(this.position, this.width, this.height,
            "rgba(0, 0, 0, 1)");
        renderer.font = this.font;
        renderer.putText(this.center, this.score, "rgba(0, 0, 0, 1)", true);
    }

    update() {

    }
};