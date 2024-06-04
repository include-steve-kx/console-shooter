class Pixel {
    constructor(c, color = 'black') {
        if (c.length > 1) c = c[0];
        if (c === ' ') {
            c = Pixel.emptyContent();
            color = Pixel.emptyColor();
        }
        this.c = c; // pixel content
        this.color = color;
    }

    static emptyPixel() {
        return new Pixel(this.emptyContent(), this.emptyColor());
    }

    static emptyContent() {
        return ' ';
    }

    static emptyColor() {
        return 'black';
    }

    set(c, color = 'black') {
        if (c.length > 1) c = c[0];
        this.c = c;
        this.color = color;
    }

    get() {
        return {
            c: this.c,
            color: this.color,
        };
    }

    getContent() {
        return this.c;
    }

    getColor() {
        return this.color;
    }

    setColor(color) {
        this.color = color;
    }
}
