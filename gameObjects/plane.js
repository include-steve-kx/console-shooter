class Plane extends GameObject {
    constructor(x, y, color = Pixel.emptyColor(), id = '', type = 'plane') {
        super(x, y, color, id, type);

        this.speed = 2;
        this.velocity = new Vector2(0, 0);
        this.keys = {
            w: false,
            W: false,
            a: false,
            A: false,
            s: false,
            S: false,
            d: false,
            D: false,
            Shift: false,
            ' ': false,
            m: false, // command key on mac, windows key on windows
            M: false,
        };

        this.isWounded = false;
        this.woundedDuration = 8;
        this.woundedTime = 0;

        this.setupEventListeners();
    }

    createShape() {
        let str = '';
        str += '       |       \n';
        str += '       @       \n';
        str += '      {@}      \n';
        str += '     /@@@\\     \n';
        str += '!--!-@@@@@-!--!\n';
        str += '     _|||_     ';

        this.shape = new Shape(str, this.color);
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!e.key in this.keys) return;

            switch (e.key) {
                case 'w':
                case 'W':
                    this.keys['w'] = true;
                    this.keys['W'] = true;
                    this.keys['s'] = false;
                    this.keys['S'] = false;
                    break;
                case 'a':
                case 'A':
                    this.keys['a'] = true;
                    this.keys['A'] = true;
                    this.keys['d'] = false;
                    this.keys['D'] = false;
                    break;
                case 's':
                case 'S':
                    this.keys['s'] = true;
                    this.keys['S'] = true;
                    this.keys['w'] = false;
                    this.keys['W'] = false;
                    break;
                case 'd':
                case 'D':
                    this.keys['d'] = true;
                    this.keys['D'] = true;
                    this.keys['a'] = false;
                    this.keys['A'] = false;
                    break;
                case 'm':
                case 'M':
                    this.keys['m'] = true;
                    this.keys['M'] = true;
                    break;
                default:
                    break;
            }
            this.keys[`${e.key}`] = true;
        })

        document.addEventListener('keyup', (e) => {
            if (!e.key in this.keys) return;

            switch (e.key) {
                case 'w':
                case 'W':
                    this.keys['w'] = false;
                    this.keys['W'] = false;
                    break;
                case 'a':
                case 'A':
                    this.keys['a'] = false;
                    this.keys['A'] = false;
                    break;
                case 's':
                case 'S':
                    this.keys['s'] = false;
                    this.keys['S'] = false;
                    break;
                case 'd':
                case 'D':
                    this.keys['d'] = false;
                    this.keys['D'] = false;
                    break;
                case 'm':
                case 'M':
                    this.keys['m'] = false;
                    this.keys['M'] = false;
                    break;
                default:
                    break;
            }
            this.keys[e.key] = false;
        })
    }

    update() {
        let speedUpFlag = false;
        this.velocity.zeros(); // make sure to clear the velocity to (0, 0) on each frame
        for (let [key, value] of Object.entries(this.keys)) {
            switch (key) {
                case 'w':
                    this.velocity.y += value ? -1 : 0;
                    break;
                case 'a':
                    this.velocity.x += value ? -1 : 0;
                    break;
                case 's':
                    this.velocity.y += value ? 1 : 0;
                    break;
                case 'd':
                    this.velocity.x += value ? 1 : 0;
                    break;
                case 'Shift':
                    speedUpFlag = value;
                    break;
                case ' ':
                    if (!value) break;
                    this.attack();
                    break;
                case 'm':
                    if (!value) break;
                    this.launchMissile();
                    break;
                default:
                    break;
            }
        }
        this.velocity.makeVisuallyEqual();
        this.velocity.normalize();
        if (speedUpFlag) this.velocity.multiplyScalar(2);
        this.velocity.multiplyScalar(this.speed);
        this.position.add(this.velocity);
        this.positionInt = this.position.clone().round();

        this.heal();
        this.leaveSmoke();
    }

    leaveSmoke(p = 0.85) { // probability
        for (let k = 0; k < 2; k++) {
            if (Math.random() > p) continue;
            let i, j;
            switch (k) {
                case 0:
                    i = 0; j = 4;
                    break;
                case 1:
                    i = 14; j = 4;
                    break;
                default:
                    break;
            }
            let v = this.shape.localToWorld(i, j, this.positionInt.x, this.positionInt.y);
            let symbol = this.keys['Shift'] ? '|' : ':';
            let smoke = new Smoke(v.x, v.y, symbol, 'royalblue', 2, new Vector2(0, 0.5));
        }
    }

    attack() {
        // todo Steve: add weapon: machine gun
        // let x = this.position.x;
        // let y = this.position.y - this.shape.center.y;
        // let bullet = new Bullet(x, y, 0);
        // bulletPool.set(bullet.id, bullet);
        // todo Steve: add weapon: omni-directional machine gun
        // for (let i = 0; i < 8; i++) {
        //     let x = this.position.x;
        //     let y = this.position.y;
        //     let angle = i * 45;
        //     let bullet = new Bullet(x, y, angle);
        //     bulletPool.set(bullet.id, bullet);
        // }
        // todo Steve: add weapon: tri-directional machine gun
        let bpx = this.position.x;
        let bpy = this.position.y - this.shape.center.y;
        let b1 = new Bullet(bpx, bpy, 0);
        bulletPool.set(b1.id, b1);
        let b2 = new Bullet(bpx - 1, bpy, 315);
        bulletPool.set(b2.id, b2);
        let b3 = new Bullet(bpx + 1, bpy, 45);
        bulletPool.set(b3.id, b3);
    }

    launchMissile() { // from the 4 missile launcher positions, pick a random one and spawn a missile
        let v = new Vector2();
        let i, j;
        let rdmPos = Math.floor(Math.random() * 4);
        switch (rdmPos) {
            case 0:
                i = 0; j = 4;
                break;
            case 1:
                i = 3; j = 4;
                break;
            case 2:
                i = 11; j = 4;
                break;
            case 3:
                i = 14; j = 4;
                break;
            default:
                break;
        }
        v.copy(this.shape.localToWorld(i, j, this.positionInt.x, this.positionInt.y));
        let m = new Missile(v.x, v.y, 'orangered');
        missilePool.set(m.id, m);
    }

    wounded() {
        this.isWounded = true;
        this.woundedTime = 0;
    }

    heal() {
        if (!this.isWounded) return;
        if (this.woundedTime > this.woundedDuration) {
            this.isWounded = false;
            plane.shape.setColor(PLANE_COLOR);
        }
        this.woundedTime++;
        if (this.woundedTime % 2 === 1) {
            plane.shape.setColor(WOUNDED_COLOR);
        } else {
            plane.shape.setColor(PLANE_COLOR);
        }
    }
}