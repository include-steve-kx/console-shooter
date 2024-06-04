class Smoke extends GameObject {
    constructor(x, y, symbol = '.', color = Pixel.emptyColor(), duration = 3, velocity = new Vector2(0, 0), id = '', type = 'smoke') {
        super(x, y, color, id, type);

        this.symbol = symbol;
        this.createShape();

        this.duration = duration;
        this.time = 0;
        this.velocity = velocity;
        this.addToPool();
    }

    createShape() {
        let str = this.symbol ? this.symbol : '.';

        this.shape = new Shape(str, this.color);
    }

    addToPool() {
        missilePool.set(this.id, this);
    }

    delete() {
        missilePool.delete(this.id);
    }

    update() {
        if (this.time > this.duration) this.delete();
        this.time++;

        this.position.add(this.velocity);
        this.positionInt.copy(this.position.clone().round());
    }
}