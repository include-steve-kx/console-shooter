class Bullet extends GameObject {
    constructor(x, y, angle = 0, color = Pixel.emptyColor(), id = '', type = 'bullet') {
        super(x, y, color, id, type);

        this.color = getIdColor(this.id, this.type);
        this.angle = angle;
        if (this.angle < 0 || this.angle > 315 || this.angle % 45 !== 0) console.error('Bullet angle error: cannot spawn such bullet');
        this.createShape(); // should call this again, b/c in super.createShape(), it doesn't know this.angle, so cannot create any bullet shapes

        this.speed = 3;
        let a = -degToRad(this.angle) + Math.PI / 2;
        this.velocity = new Vector2(Math.cos(a), -Math.sin(a));
        this.velocity.makeVisuallyEqual();
        this.velocity.multiplyScalar(this.speed);
    }

    createShape() {
        let str = '';
        switch (this.angle) {
            case 0:
            case 180:
                str = '|';
                break;
            case 45:
            case 225:
                str = '/';
                break;
            case 90:
            case 270:
                str = '-';
                break;
            case 135:
            case 315:
                str = '\\';
                break;
            default:
                break;
        }
        this.shape = new Shape(str, this.color);
    }

    delete() {
        bulletPool.delete(this.id);
    }

    update() {
        if (buffer.isOutOfBound(this.position.x, this.position.y)) {
            this.isActive = false;
            this.delete();
            return;
        }
        this.position.add(this.velocity);
        this.positionInt = this.position.clone().round();
    }
}

function generateBullet() {
    let bullet = new Bullet(40, 15);
    bulletPool.set(bullet.id, bullet);
}