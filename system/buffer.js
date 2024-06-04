class Buffer {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.b = null; // buffer content, a 2d array of Pixel's, [height, width]; height: top --> bottom, width: left --> right
        this.count = 0;

        this.isDrawToHTML = true;
        this.isDrawToConsole = false;

        this.isDrawStyle = true;
        this.styles = [];
        this.leftBorder = '@@@|';
        this.rightBorder = '|@@@';

        this.setup();
    }

    setup() {
        this.b = new Array(this.height)
        for (let i = 0; i < this.height; i++) {
            this.b[i] = new Array(this.width);
            for (let j = 0; j < this.width; j++) {
                this.b[i][j] = Pixel.emptyPixel();
            }
        }
        clearConsole();
    }

    clearAll() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.b[i][j].set(Pixel.emptyContent(), Pixel.emptyColor());
            }
        }
        if (this.isDrawToConsole) {
            clearConsole();
        }
    }

    get(x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (this.isOutOfBound(x, y)) {
            // console.error('Draw buffer get content out of bound.');
            return;
        }
        return this.b[y][x].get();
    }

    set(x, y, c, color) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (this.isOutOfBound(x, y)) {
            // console.error('Draw buffer set content out of bound.');
            return;
        }
        this.b[y][x].set(c, color);
    }

    add(x, y, shape) {
        for (let i = 0; i < shape.width; i++) {
            for (let j = 0; j < shape.height; j++) {
                let p = shape.localToWorld(i, j, x, y);
                let pixelInfo = shape.get(i, j);
                this.set(p.x, p.y, pixelInfo.c, pixelInfo.color);
            }
        }
    }

    clearCount() { // called at the beginning of render loop to clear line count
        this.count = 0;
    }

    clearStyles() {
        this.styles.length = 0;
    }

    enableStyle() {
        this.isDrawStyle = true;
    }

    disableStyle() {
        this.isDrawStyle = false;
    }

    postprocess(s) {
        let fs = '';
        for (let c of s) {
            fs += `%c${c}`;
        }
        return fs;
    }

    draw() { // new drawing code to output console in one single string, looks better
        // clear draw string and style
        let allStr = '';
        this.clearStyles();

        // build draw string and style from scratch
        // top info
        let titleCenterInfo = this.titleCenterInfo();
        let titleLeftStyle = `color: purple; font-family: "Courier New", Courier, monospace; line-height: 1;`;
        let titleRightStyle = `color: purple; font-family: "Courier New", Courier, monospace; line-height: 1;`;
        let title = this.customfix(titleCenterInfo.text, false, titleCenterInfo.styles, titleLeftStyle, titleRightStyle);
        allStr += `${title}`;
        let status = this.statusfix('blue');
        allStr += `${status}`;
        let top = this.topfix('green');
        allStr += `${top}`;

        // main game window
        this.clearCount();
        for (let i = 0; i < this.height; i++) {
            let str = '';
            str += this.prefix('green');
            for (let j = 0; j < this.width; j++) {
                str += this.b[i][j].getContent();
                let color = this.b[i][j].getColor();
                this.styles.push(`color:${color}; font-family: "Courier New", Courier, monospace; line-height: 1;`);
            }
            str += this.suffix('green');
            allStr += `${str}`;
        }

        // bottom info
        let bottom = this.topfix('green');
        allStr += `${bottom}`;
        let weapon = this.customfix('  SPACE -- TRI-DIRECTIONAL MACHINE GUN; M -- MISSILE LAUNCHER  ', true, 'darkred');
        allStr += `${weapon}`;
        let manual = this.customfix('  WASD -- MOVE; SHIFT -- ACCELERATE; P -- PAUSE  ', true, 'darkred');
        allStr += `${manual}`;

        if (this.isDrawToHTML) this.drawToHTML(allStr);
        if (this.isDrawToConsole) this.drawToConsole(allStr);
    }

    drawToConsole(str) {
        let consoleStr = this.postprocess(str);
        if (this.isDrawStyle) {
            console.log(`${consoleStr}`, ...this.styles);
        } else {
            console.log(str);
        }
        // console.log(str.length, this.styles.length);
    }

    drawToHTML(s) {
        let fs = '';
        for (let i = 0; i < s.length; i++) {
            let c = s[i];
            if (c === '\n') {
                fs += '<br>';
            } else if (c === ' ') {
                fs += '&nbsp;';
            } else {
                if (this.isDrawStyle) {
                    fs += `<span style='${this.styles[i]}; font-family: "Courier New", Courier, monospace; line-height: 1;'>${c}</span>`;
                } else {
                    fs += `<span>${c}</span>`;
                }
            }
        }
        gameContainer.innerHTML = fs;
    }

    titleCenterInfo() {
        let text = `  CONSOLE SHOOTER    (update rate: ${UPDATE_INTERVAL}ms)  `;
        let styles = [];
        for (let i = 0; i < text.length; i++) {
            if (i < 2) styles.push(`color: purple; font-family: "Courier New", Courier, monospace; line-height: 1;`);
            else if (i >= 17) styles.push(`color: purple; font-family: "Courier New", Courier, monospace; line-height: 1;`);
            else styles.push(`color:${getRandomColor(getPseudoRandomNumber(i))}; font-family: "Courier New", Courier, monospace; line-height: 1;`);
        }
        return {
            text,
            styles,
        }
    }

    customfix(customStr, isSingleColor = true, midStyle = Pixel.emptyColor(), leftStyle = Pixel.emptyColor(), rightStyle = Pixel.emptyColor()) {
        if (!isSingleColor && customStr.length !== midStyle.length) {
            console.error('customfix() error: provided custom string and midStyle dimension mismatch.');
            return;
        }

        let lhLength = Math.floor((this.width - customStr.length) / 2) + 1;
        let rhLength = this.width - customStr.length - lhLength;

        let str = this.leftBorder;
        for (let i = 0; i < lhLength; i++) str += '-';
        str += customStr;
        for (let i = 0; i < rhLength; i++) str += '-';
        str += this.rightBorder;
        str += '\n';

        for (let i = 0; i < str.length; i++) {
            if (isSingleColor) {
                this.styles.push(`color:${midStyle}; font-family: "Courier New", Courier, monospace; line-height: 1;`);
            } else {
                if (i < this.leftBorder.length + lhLength) this.styles.push(`${leftStyle}`);
                else if (i >= this.leftBorder.length + lhLength + customStr.length) this.styles.push(`${rightStyle}`);
                else this.styles.push(`${midStyle[i - (this.leftBorder.length + lhLength)]}`);
            }
        }

        return str;
    }

    statusfix(color = Pixel.emptyColor()) {
        // score
        let scoreNumStr = `${window.GAME_SCORE}`;
        let scoreMaxLength = 10;
        let scoreZeroLength = scoreMaxLength - scoreNumStr.length;
        let scoreZeroStr = '';
        for (let i = 0; i < scoreZeroLength; i++) scoreZeroStr += '0';
        scoreNumStr = scoreZeroStr + scoreNumStr + '  ';
        let scoreTxtStr = '  CURRENT SCORE: ';
        let scoreStr = scoreTxtStr + scoreNumStr;

        // HP
        let hpNumStr = `${window.GAME_HP}`;
        let hpMaxLength = 3;
        let hpZeroLength = hpMaxLength - hpNumStr.length;
        let hpZeroStr = '';
        for (let i = 0; i < hpZeroLength; i++) hpZeroStr += '0';
        hpNumStr = hpZeroStr + hpNumStr + '  ';
        let hpTxtStr = '  HP: ';
        let hpStr = hpTxtStr + hpNumStr;

        let lhLength = Math.floor(this.width - scoreStr.length - hpStr.length) / 2;
        let rhLength = this.width - scoreStr.length - hpStr.length - lhLength;

        let str = this.leftBorder;
        for (let i = 0; i < lhLength; i++) str += '-';
        str += scoreStr;
        str += hpStr;
        for (let i = 0; i < rhLength; i++) str += '-';
        str += this.rightBorder;
        str += '\n';

        for (let i = 0; i < str.length; i++) this.styles.push(`color:${color}; font-family: "Courier New", Courier, monospace; line-height: 1;`);

        return str;
    }

    topfix(color = Pixel.emptyColor()) {
        let str = this.leftBorder;
        for (let i = 0; i < this.width; i++) str += '-';
        str += this.rightBorder;
        str += '\n';

        for (let i = 0; i < str.length; i++) this.styles.push(`color:${color}; font-family: "Courier New", Courier, monospace; line-height: 1;`);

        return str;
    }

    prefix(color = Pixel.emptyColor()) {
        let str = `${this.formatLineCount()}|`;
        for (let i = 0; i < str.length; i++) this.styles.push(`color:${color}; font-family: "Courier New", Courier, monospace; line-height: 1;`);
        return str;
    }

    suffix(color = Pixel.emptyColor()) {
        let str = this.rightBorder;
        str += '\n';
        for (let i = 0; i < str.length; i++) this.styles.push(`color:${color}; font-family: "Courier New", Courier, monospace; line-height: 1;`);
        return str;
    }

    formatLineCount() {
        if (this.count < 10) {
            return `00${this.count++}`;
        } else if (this.count < 100) {
            return `0${this.count++}`;
        } else {
            return `${this.count++}`;
        }
    }

    isOutOfBound(x, y) {
        return this.width <= x || this.height <= y || x < 0 || y < 0;
    }

    isOnBound(x, y) {
        // y === -1, b/c if this is y === 0, when an enemy is first spawned, it is on bound
        // this.width - 1 === x || this.width - 2 === x --> b/c if enemy move too fast, it might overshoot and go past the boundary. So need extended boundary to double check
        return this.width - 1 === x || this.width - 2 === x || this.height === y || x === 0 || y === -1;
        // let b1 = this.width - 1 === x
        // let b5 = this.width - 2 === x
        // let b2 = this.height === y
        // let b3 = x === 0
        // let b4 = y === -1
        // let flag = b1 || b2 || b3 || b4 || b5;
        // return flag;
    }
}