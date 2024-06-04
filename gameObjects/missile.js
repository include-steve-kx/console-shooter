class Missile extends GameObject {
    constructor(x, y, color = Pixel.emptyColor(), id = '', type = 'missile') {
        super(x, y, color, id, type);

        this.duration = 15;
        this.time = 0;
        this.target = null; // type enemy, the target of this missile

        this.speed = 4;
        this.velocity = new Vector2(0, -1);
        this.velocity.normalize().makeVisuallyEqual().multiplyScalar(this.speed);
    }

    createShape() {
        let str = '!';

        this.shape = new Shape(str, this.color);
    }

    delete() {
        if (this.target && this.target.isActive) this.target.released();
        missilePool.delete(this.id);
    }

    update() {
        if (this.time > this.duration || buffer.isOutOfBound(this.position.x, this.position.y)) {
            this.isActive = false;
            this.delete();
            return;
        }

        this.time++;
        let smoke = new Smoke(this.positionInt.x, this.positionInt.y, '.', 'goldenrod');

        if (this.target !== null) {
            this.adjustAim();
        }
        this.position.add(this.velocity);
        this.positionInt = this.position.clone().round();
    }

    aim(target) {
        this.target = target;
        this.target.aimed(this); // 双向奔赴, bi-directionally referenced
    }

    release() {
        this.target = null;
    }

    adjustAim() { // change velocity to aim for world space coords (tx, ty)
        let dx = this.target.position.x - this.position.x;
        let dy = this.target.position.y - this.position.y;
        this.velocity.set(dx, dy);
        this.velocity.normalize().makeVisuallyEqual().multiplyScalar(this.speed);
    }
}