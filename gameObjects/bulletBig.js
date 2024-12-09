class BulletBig extends GameObject {
    constructor(x, y, color = Pixel.emptyColor(), id = '', type = 'bulletBig') {
        super(x, y, color, id, type);

        this.colors = ['red', 'green', 'blue'];
        this.colorIndex = 0;

        // this.color = getIdColor(this.id, this.type);
        this.color = this.colors[this.colorIndex];
        this.createShape(); // should call this again, b/c in super.createShape(), it doesn't know this.angle, so cannot create any bullet shapes

        this.speed = 1.5;
        this.velocity = new Vector2(0, -1);
        this.velocity.makeVisuallyEqual();
        this.velocity.multiplyScalar(this.speed);
    }

    createShape() {
        let str = '';
        str += '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n';
        str += '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n';
        str += '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%';

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

        // update color
        this.colorIndex = (this.colorIndex + 1) % this.colors.length;
        this.color = this.colors[this.colorIndex];
        this.color = getTrueRandomColor();
        this.shape.setColor(this.color);
    }
}