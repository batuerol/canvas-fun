class Bell {
    constructor(center, radius, name, texture, sound) {
        this.center = center;
        this.radius = radius;
        this.name = name;
        this.texture = texture;        
        this.texturePosition = new Vector2();
        this.texturePosition.x = center.x - radius;
        this.texturePosition.y = center.y - radius;
        this.createFont();
    }

    draw(renderer) {
        renderer.drawImage(this.texture, this.texturePosition.x, this.texturePosition.y,
            this.texture.width, this.texture.height);
        // NOTE(batuhan): For debugging
        // renderer.strokeCircle(this.center, this.radius, "rgba(0, 0, 255, 1)");
        // renderer.font = this.font;
        // renderer.putText(this.textPosition, this.name, "rgba(0, 255, 0, 1)", true);
        // renderer.outlineText(this.textPosition, this.name, "rgba(0, 0, 0, 1)", true);
    }

    update() {
        // I was thinking of animating the bells.        
    }

    createFont() {
        var fontSize = this.radius * 0.05;
        this.font = fontSize + "em serif";
        this.textPosition = new Vector2(this.center.x - fontSize, this.center.y + fontSize);
    }

    checkClick(mousePosition) {
        if (MathHelper.inCircle(this.center, this.radius, mousePosition)) {            
            return true;
        }
        else {
            return false;
        }
    }

    // Create and drop a fireball object.
    dropFireball(path) {
        var fireball = new Fireball(this.center, this.radius * 0.3);
        fireball.drop(path);    
        return fireball;
    }
};