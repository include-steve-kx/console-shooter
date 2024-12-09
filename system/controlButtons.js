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

let activeButton = null;
// const buttons = [...document.getElementsByClassName('touchButton')];
//
//
// addButtonTouchSlideListener1(buttons[0]);
// addButtonTouchSlideListener1(buttons[1]);
// addButtonTouchSlideListener1(buttons[2]);
// function addButtonTouchSlideListener1(button) {
//
//     button.addEventListener('touchstart', function (event) {
//         activeButton = button;
//         button.classList.add('active');
//         console.log(button.textContent + ' activated');
//         event.preventDefault();
//     });
//
//     button.addEventListener('touchend', function (event) {
//         if (activeButton === button) {
//             activeButton.classList.remove('active');
//             console.log(button.textContent + ' deactivated');
//             activeButton = null;
//             event.preventDefault();
//         }
//     });
// }


// function addButtonTouchSlideListener2() {
//     document.addEventListener('touchmove', function(event) {
//         const touch = event.touches[0];
//         const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
//
//         if (activeButton && targetElement !== activeButton) {
//             activeButton.classList.remove('active');
//             console.log(activeButton.textContent + ' deactivated');
//             activeButton = null;
//         }
//
//         if (!activeButton && targetElement && targetElement.classList.contains('touchButton')) {
//             activeButton = targetElement;
//             activeButton.classList.add('active');
//             console.log(activeButton.textContent + ' activated');
//         }
//
//         event.preventDefault();
//     }, { passive: false });
//
//     document.addEventListener('touchend', function(event) {
//         if (activeButton) {
//             activeButton.classList.remove('active');
//             console.log(activeButton.textContent + ' deactivated');
//             activeButton = null;
//             event.preventDefault();
//         }
//     });
// }
// addButtonTouchSlideListener2();

function addButtonTouchSlideListener3() {
    document.addEventListener('touchmove', function(event) {
        const touch = event.touches[0];
        const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);

        if (activeButton && targetElement !== activeButton) {
            activeButton.classList.remove('active');
            console.log(activeButton.textContent + ' deactivated');
            activeButton = null;
        }

        if (!activeButton && targetElement && targetElement.classList.contains('touchButton')) {
            activeButton = targetElement;
            activeButton.classList.add('active');
            console.log(activeButton.textContent + ' activated');
        }

        event.preventDefault();
    }, { passive: false });

    document.addEventListener('touchend', function(event) {
        if (activeButton) {
            activeButton.classList.remove('active');
            console.log(activeButton.textContent + ' deactivated');
            activeButton = null;
            event.preventDefault();
        }
    });
}
addButtonTouchSlideListener3();

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

    b.addEventListener('touchstart', function (event) {
        activeButton = b;
        b.classList.add('active');
        // console.log(b.textContent + ' activated');
        keys.forEach(key => simulateKeydown(key));
        event.preventDefault();
    });

    b.addEventListener('touchend', function (event) {
        if (activeButton === b) {
            activeButton.classList.remove('active');
            // console.log(b.textContent + ' deactivated');
            keys.forEach(key => simulateKeyup(key));
            activeButton = null;
            event.preventDefault();
        }
    });

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

    document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault(); // Prevent multi-touch gestures
        }
    }, { passive: false });

    document.addEventListener('touchmove', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault(); // Prevent multi-touch gestures
        }
    }, { passive: false });

    document.addEventListener('gesturestart', function(event) {
        event.preventDefault(); // Prevent pinch-to-zoom
    });

    document.addEventListener('gesturechange', function(event) {
        event.preventDefault(); // Prevent pinch-to-zoom
    });

    document.addEventListener('gestureend', function(event) {
        event.preventDefault(); // Prevent pinch-to-zoom
    });
}

initButtons();