import Sprite from './Sprite.js';

class Box extends Sprite {
    constructor({ position, color, name, width, height, health, context }) {
        super({ position, imageSrc: undefined, context });
        this.name = name;
        this.color = color;
        this.width = width;
        this.height = height;
        this.health = health;
        this.velocity = {
            x: 0,
            y: 0
        };
        this.keys = {
            a: { pressed: false },
            d: { pressed: false }
        };
        this.speed = 5;
        this.context = context;
    }

    draw() {
        this.context.fillStyle = this.color;
        this.context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    move() {
        if (this.keys.a.pressed) this.position.x -= this.speed;
        if (this.keys.d.pressed) this.position.x += this.speed;
    }

    update() {
        this.move();
        this.draw();
    }
}

export default Box; 