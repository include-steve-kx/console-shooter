class Enemy extends GameObject {
    constructor(x, y, color = Pixel.emptyColor(), id = '', type = 'enemy') {
        super(x, y, color, id, type);

        // this.color = getIdColor(this.id, this.type);
        this.color = getTrueRandomColor();
        this.createShape();

        this.targetMissile = null;

        this.speed = 1;
        let sx = remap(Math.random(), 0, 1, -1, 1);
        let sy = Math.random();
        this.velocity = new Vector2(sx, sy);
        this.velocity.makeVisuallyEqual();
        this.velocity.multiplyScalar(this.speed);
    }

    createShape() {
        let str = '';
        str += '{@@@}\n';
        str += '{@@@}';

        this.shape = new Shape(str, this.color);
    }

    delete() {
        if (this.targetMissile && this.targetMissile.isActive) this.targetMissile.release();
        enemyPool.delete(this.id);
    }

    update() {
        if (buffer.isOutOfBound(this.positionInt.x, this.positionInt.y)) {
            this.isActive = false;
            this.delete();
            return;
        }
        if (buffer.isOnBound(this.positionInt.x, this.positionInt.y)) {
            this.velocity.x = remap(Math.random(), 0, 1, -1, 1);
            // this.velocity.x = -this.velocity.x;
        }
        this.position.add(this.velocity);
        this.positionInt = this.position.clone().round();
    }

    aimed(missile) {
        this.targetMissile = missile;
    }

    released() {
        this.targetMissile = null;
    }
}

function generateEnemy(p = 0.1) { // probability
    let rdm = Math.random();
    if (rdm > p) return;
    let enemy = new Enemy(Math.random() * buffer.width, 0);
    // let enemy = new Enemy(40, 10);
    enemyPool.set(enemy.id, enemy);
}