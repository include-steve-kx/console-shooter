class Explosion extends GameObject {
    constructor(x, y, color = Pixel.emptyColor(), id = '', type = 'Explosion') {
        super(x, y, color, id, type);

        this.duration = 4;
        this.time = 0;
    }

    createShape() {
        let str = '.';
        this.shape = new Shape(str, this.color);
    }

    delete() {
        explosionPool.delete(this.id);
    }

    updateShape() {
        let str = '';
        switch (this.time) {
            case 0:
                break;
            case 1:
                str = '';
                str += '  .  \n';
                str += '-   -\n';
                str += '  .  ';
                this.shape = new Shape(str, this.color);
                break;
            case 2:
                str = '';
                str += '\\  |  /\n';
                str += '-     -\n';
                str += '/  |  \\';
                this.shape = new Shape(str, this.color);
                break;
            case 3:
                str = '';
                str += '     |     \n';
                str += '  \\     /  \n';
                str += '--       --\n';
                str += '  /     \\  \n';
                str += '     |     ';
                this.shape = new Shape(str, this.color);
                break;
            case 4:
                str = '';
                str += '     .     \n';
                str += '  .     .  \n';
                str += '.         .\n';
                str += '  .     .  \n';
                str += '     .     ';
                this.shape = new Shape(str, this.color);
                break;
            default:
                break;
        }
    }

    update() {
        if (this.time > this.duration) this.delete();
        this.time++;
        this.updateShape();
    }
}