function wait(t) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, t);
    });
}

function clearConsole() {
    console.clear();
}

let ids = [];
function uuid() {
    let id = Date.now().toString();
    // all the nodes with the same time stamp
    let dups = ids.filter((existingId) => {
        return existingId.includes(id);
    })
    if (dups.length === 0) {
        ids.push(id);
        return id;
    } else {
        id += '_' + dups.length;
        ids.push(id);
        return id;
    }
}

function hashCode(s) {
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
}
function hashToRgb(hashCode) {
    // Ensure the hash code is within the 32-bit integer range
    hashCode = hashCode >>> 0;

    // Extract the red, green, and blue components from the hash code
    let r = (hashCode >> 16) & 0xFF;
    let g = (hashCode >> 8) & 0xFF;
    let b = hashCode & 0xFF;

    r = Math.sin(r) * Math.cos(hashCode);
    g = Math.sin(g) * Math.sin(hashCode);
    b = Math.sin(b) * Math.sin(hashCode) * Math.cos(hashCode);

    r = Math.abs(r * 256);
    g = Math.abs(g * 256);
    b = Math.abs(b * 256);

    return `rgb(${r},${g},${b})`;
}
function getIdColor(id, type) {
    let trimmedId = id.split(`${type}_`)[1];
    let hash = Math.abs(hashCode(trimmedId));
    return hashToRgb(hash);
}



function getPseudoRandomNumber(seed) {
    return fract(sin(seed) * 43758.5453123);
}

function getRandomColor(n) {
    let hash = Math.abs(hashCode(`${n}`));
    return hashToRgb(hash);
}


function getTrueRandomColor() {
    return `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
}



function simulateKeydown(key) {
    let event = new KeyboardEvent('keydown', {
        key: key,
        bubbles: true,
        cancelable: true
    });

    document.dispatchEvent(event);
}

function simulateKeyup(key) {
    let event = new KeyboardEvent('keyup', {
        key: key,
        bubbles: true,
        cancelable: true
    });

    document.dispatchEvent(event);
}
