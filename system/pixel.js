class Pixel {
    constructor(c, color = Pixel.emptyColor()) {
        if (c.length > 1) c = c[0];
        else if (c === ' ' || c.length < 1) {
            c = Pixel.emptyContent();
            color = Pixel.emptyColor();
        }
        this.c = c; // pixel content
        this.color = color;
    }

    static emptyPixel() {
        return new Pixel(this.emptyContent(), this.emptyColor());
    }

    static setEmptyContent(c) {
        if (c.length > 1) window.PIXEL_EMPTY_CONTENT = c[0];
        else if (c.length < 1) {
            window.PIXEL_EMPTY_CONTENT = ' ';
        }
        return window.PIXEL_EMPTY_CONTENT;
    }

    static emptyContent() {
        return Pixel.setEmptyContent(window.PIXEL_EMPTY_CONTENT);
    }

    static emptyColor() {
        return window.PIXEL_EMPTY_COLOR;
    }

    set(c, color = Pixel.emptyColor()) {
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
