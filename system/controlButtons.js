let isButtonVisible = true;
const moveButtonContainer = document.getElementById('move-button-container');
const attackButtonContainer = document.getElementById('attack-button-container');

function initButtons() {
    checkEnvironment();
    setupControlButtonListeners();

    let topLeft = createMoveButton(45, ['w', 'a']);
    let top = createMoveButton(90, ['w']);
    let topRight = createMoveButton(135, ['w', 'd']);
    let left = createMoveButton(0, ['a']);
    createPlaceholder();
    let right = createMoveButton(180, ['d']);
    let bottomLeft = createMoveButton(315, ['s', 'a']);
    let bottom = createMoveButton(270, ['s']);
    let bottomRight = createMoveButton(225, ['s', 'd']);

    let fireButton = createAttackButton('FIRE', [' ']);
    let missileButton = createAttackButton('MISSILE', ['m']);
}

function createMoveButton(angle, keys) {
    let b = document.createElement('button');
    b.classList.add('transparent-button');
    b.innerHTML = '<';
    b.style.transform = `rotate(${angle}deg)`;
    moveButtonContainer.append(b);
    b.addEventListener('pointerdown', () => {
        keys.forEach(key => simulateKeydown(key));
    });
    b.addEventListener('pointerup', () => {
        keys.forEach(key => simulateKeyup(key));
    });
    b.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    })
    return b;
}

function createAttackButton(string, keys) {
    let b = document.createElement('button');
    b.classList.add('transparent-button');
    b.innerHTML = `${string}`;
    attackButtonContainer.append(b);
    b.addEventListener('pointerdown', () => {
        keys.forEach(key => simulateKeydown(key));
    });
    b.addEventListener('pointerup', () => {
        keys.forEach(key => simulateKeyup(key));
    });
    b.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    })
    return b;
}

function createPlaceholder() {
    let b = document.createElement('div');
    b.innerHTML = '';
    moveButtonContainer.append(b);
}

function checkEnvironment() {
    let details = navigator.userAgent;
    let regexp = /android|iphone|kindle|ipad|ipod/i;
    let isMobileDevice = regexp.test(details);

    if (isMobileDevice) {
        isButtonVisible = true;
        moveButtonContainer.style.display = 'grid';
        attackButtonContainer.style.display = 'grid';
        toggleControlButtons.classList.add('toggle-on');
    } else {
        isButtonVisible = false;
        moveButtonContainer.style.display = 'none';
        attackButtonContainer.style.display = 'none';
    }

    if (innerWidth >= innerHeight) {
        moveButtonContainer.style.width = '30vw';
        moveButtonContainer.style.gap = '6vh';
        moveButtonContainer.style.bottom = '10vh';
        moveButtonContainer.style.left = '5vh';
        attackButtonContainer.style.width = '30vw';
        attackButtonContainer.style.bottom = '5vh';
        attackButtonContainer.style.right = '5vh';
    } else {
        moveButtonContainer.style.width = '30vh';
        moveButtonContainer.style.gap = '6vw';
        moveButtonContainer.style.bottom = '10vw';
        moveButtonContainer.style.left = '5vw';
        attackButtonContainer.style.width = '30vh';
        attackButtonContainer.style.bottom = '5vw';
        attackButtonContainer.style.right = '5vw';
    }
}

let toggleControlButtons = document.getElementById('toggle-control-buttons');
function setupControlButtonListeners() {
    toggleControlButtons.addEventListener('pointerdown', () => {
        isButtonVisible = !isButtonVisible;
        if (isButtonVisible) toggleControlButtons.classList.add('toggle-on');
        else toggleControlButtons.classList.remove('toggle-on');
        moveButtonContainer.style.display = isButtonVisible ? 'grid' : 'none';
        attackButtonContainer.style.display = isButtonVisible ? 'grid' : 'none';
    });

    document.addEventListener('resize', () => {
        checkEnvironment();
    });

    document.addEventListener('orientationchange', () => {
        checkEnvironment();
    });
}

initButtons();