class Drawable {
    constructor(drawFunc) {
        this.drawFunc = drawFunc;
    }

    draw(renderer){
        this.drawFunc(renderer);
    }
};