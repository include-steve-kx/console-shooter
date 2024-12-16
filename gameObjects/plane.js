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

        this.weapons = [];
        this.weaponIndex = 0;
        this.createWeapons();

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

    createWeapons() { // create guns, not including the missile
        let triGunOffsetX = 0;
        let triGunOffsetY = -this.shape.center.y;
        let triGun = new TriGun(triGunOffsetX, triGunOffsetY, this);
        this.weapons.push(triGun);
        let omniGunOffsetX = 0;
        let omniGunOffsetY = 0;
        let omniGun = new OmniGun(omniGunOffsetX, omniGunOffsetY, this);
        this.weapons.push(omniGun);
        let canonOffsetX = 0;
        let canonOffsetY = -this.shape.center.y;
        let canon = new Canon(canonOffsetX, canonOffsetY, this);
        this.weapons.push(canon);
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
                case 'q': // unlike previous keys, we want to trigger these keys discretely, instead of continuously holding them down
                case 'Q':
                    this.weaponIndex = (this.weaponIndex + this.weapons.length - 1) % this.weapons.length;
                    break;
                case 'e':
                case 'E':
                    this.weaponIndex = (this.weaponIndex + 1) % this.weapons.length
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

    leaveSmoke(p = 0.5) { // probability
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
        this.weapons[this.weaponIndex].attack();
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
            this.shape.setColor(PLANE_COLOR);
        }
        this.woundedTime++;
        if (this.woundedTime % 2 === 1) {
            this.shape.setColor(WOUNDED_COLOR);
        } else {
            this.shape.setColor(PLANE_COLOR);
        }
    }
}