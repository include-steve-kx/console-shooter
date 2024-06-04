class GameObject {
    constructor(x = 0, y = 0, color = Pixel.emptyColor(), id = '', type = 'go') {
        this.type = type; // game object abbreviation
        this.id = (id.length === 0) ? type + '_' + uuid() : type + '_' + id;
        this.color = color;
        this.position = new Vector2(x, y);
        this.positionInt = this.position.clone().round();
        this.shape = null;
        this.isActive = true;

        this.createShape();
    }

    isWithinBound(x, y) { // world space point coords (x, y)
        let myX = this.positionInt.x;
        let myY = this.positionInt.y;
        let hw = Math.floor(this.shape.width / 2); // half width
        let hh = Math.floor(this.shape.height / 2); // half height
        let fw = this.shape.width % 2 === 0; // if shape's width / height is an even number, shape center is shifted one grid cell towards bottom right of the shape
        let fh = this.shape.height % 2 === 0;
        let b1 = x >= myX - hw;
        let b2 = fw ? x <= myX + hw - 1 : x <= myX + hw;
        let b3 = y >= myY - hh;
        let b4 = fh ? y <= myY + hh - 1 : myY + hh;
        return b1 && b2 && b3 && b4;
    }

    isCollided(other) { // other --- another object
        let x = other.positionInt.x;
        let y = other.positionInt.y;
        for (let i = 0; i < other.shape.width; i++) {
            for (let j = 0; j < other.shape.height; j++) {
                let p = other.shape.localToWorld(i, j, x, y);
                let collided = this.isCollidedPoint(p.x, p.y);
                // let text = `Other shape center: (${x},${y}), local coords: (${i},${j}), world coords: (${p.x},${p.y}), collided: ${collided}.`;
                if (collided) {
                    return {
                        isCollided: true,
                        position: p.clone(),
                    };
                }
            }
        }
        return {
            isCollided: false,
            position: null,
        };
    }

    isCollidedPoint(x, y) { // world space point coords (x, y)
        if (!this.isWithinBound(x, y)) {
            return false;
        }
        let myX = this.positionInt.x; // shape center (myX, myY)
        let myY = this.positionInt.y;
        let ij = this.shape.worldToLocal(myX, myY, x, y);

        let content = this.shape.getContent(ij.x, ij.y);
        // let text = `Shape center: (${myX},${myY}), collided at (${x},${y}), shape local (${ij.x},${ij.y}), content: ${content}`;

        if (content === '?') return false;
        else if (content === ' ') return false;
        else return true;
    }

    createShape() {

    }

    delete() {

    }

    update() {

    }
}