let isPaused = false;
let buffer = null;
let plane = null;
let mainPool = null, bulletPool = null, missilePool = null, enemyPool = null, explosionPool = null;
let gameContainer = null;
let UPDATE_INTERVAL = null;
let INTERVAL_ID = null;
function dispose() {
    isPaused = false;
    window.GAME_SCORE = INIT_SCORE;
    window.GAME_HP = INIT_HP;
    gameContainer = null;
    buffer = null;
    plane = null;
    clearUpdate();
    UPDATE_INTERVAL = null;
    INTERVAL_ID = null;
    mainPool = null, bulletPool = null, missilePool = null, enemyPool = null, explosionPool = null;
}
function setup() {
    isPaused = false;
    window.GAME_SCORE = INIT_SCORE;
    window.GAME_HP = INIT_HP;
    gameContainer = document.getElementById('game-container');
    buffer = null;
    plane = null;
    clearUpdate();
    UPDATE_INTERVAL = null;
    INTERVAL_ID = null;
    mainPool = new Pool(), bulletPool = new Pool(), missilePool = new Pool(), enemyPool = new Pool(), explosionPool = new Pool();
}

function setupEventListeners() {
    if (window.FIRST_LOADED) {
        const intervalSlider = document.getElementById('interval-slider');
        const intervalSliderValue = document.getElementById('interval-slider-value');
        function updateIntervalSliderValue() {
            let value = intervalSlider.value;
            intervalSliderValue.textContent = `${value}`;
            UPDATE_INTERVAL = value;
            startUpdate();
        }
        updateIntervalSliderValue();
        return;
    }
    window.FIRST_LOADED = true;
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'p':
            case 'P':
                isPaused = !isPaused;
                break;
            default:
                break;
        }
    })

    // set up slider <---> UPDATE_INTERVAL sync
    const intervalSlider = document.getElementById('interval-slider');
    const intervalSliderValue = document.getElementById('interval-slider-value');
    function updateIntervalSliderValue() {
        let value = intervalSlider.value;
        intervalSliderValue.textContent = `${value}`;
        UPDATE_INTERVAL = value;
        startUpdate();
    }
    intervalSlider.addEventListener('input', updateIntervalSliderValue);
    updateIntervalSliderValue();
    // reset to default interval button
    const resetIntervalButton = document.getElementById('interval-reset-button');
    resetIntervalButton.addEventListener('pointerdown', () => {
        let value = DEFAULT_INTERVAL;
        intervalSlider.value = value;
        intervalSliderValue.textContent = `${value}`;
        UPDATE_INTERVAL = value;
        startUpdate();
    });


    // sliders <---> set buffer dimensions
    // buffer width slider
    const widthSlider = document.getElementById('width-slider');
    const widthSliderValue = document.getElementById('width-slider-value');
    function updateWidthSliderValue() {
        pause();
        let value = widthSlider.value;
        // if (Math.floor(innerWidth / MAGIC_UNIT_SIZE) < value) {
        //     value = Math.floor(innerWidth / MAGIC_UNIT_SIZE);
        //     widthSlider.value = value;
        // }
        widthSliderValue.textContent = `${value}`;
        window.BUFFER_WIDTH = value;

        bufferDrawOutline();
    }
    widthSlider.addEventListener('input', updateWidthSliderValue);
    updateWidthSliderValue();
    // buffer height slider
    const heightSlider = document.getElementById('height-slider');
    const heightSliderValue = document.getElementById('height-slider-value');
    function updateHeightSliderValue() {
        pause();
        let value = heightSlider.value;
        // if (Math.floor(innerHeight / MAGIC_UNIT_SIZE) < value) {
        //     value = Math.floor(innerHeight / MAGIC_UNIT_SIZE);
        //     heightSlider.value = value;
        // }
        heightSliderValue.textContent = `${value}`;
        window.BUFFER_HEIGHT = value;

        bufferDrawOutline();
    }
    heightSlider.addEventListener('input', updateHeightSliderValue);
    updateHeightSliderValue();
    // reset to default dimensions
    const resetDimensionButton = document.getElementById('dimension-reset-button');
    resetDimensionButton.addEventListener('pointerdown', () => {
        pause();
        widthSlider.value = INIT_BUFFER_WIDTH;
        widthSliderValue.textContent = `${INIT_BUFFER_WIDTH}`;
        window.BUFFER_WIDTH = INIT_BUFFER_WIDTH;
        heightSlider.value = INIT_BUFFER_HEIGHT;
        heightSliderValue.textContent = `${INIT_BUFFER_HEIGHT}`;
        window.BUFFER_HEIGHT = INIT_BUFFER_HEIGHT;
    });
    // start button
    const startButton = document.getElementById('start-game');
    startButton.addEventListener('pointerdown', () => {
        start();
    });
    // pause button
    const pauseButton = document.getElementById('pause-game');
    pauseButton.addEventListener('pointerdown', () => {
        isPaused = !isPaused;
        if (isPaused) pauseButton.classList.add('toggle-on');
        else pauseButton.classList.remove('toggle-on');
    });


    // toggle render to HTML
    const htmlButton = document.getElementById('toggle-html');
    htmlButton.addEventListener('pointerdown', () => {
        if (!buffer) return;
        buffer.isDrawToHTML = !buffer.isDrawToHTML;
        if (buffer.isDrawToHTML) {
            htmlButton.classList.add('toggle-on');
        } else {
            htmlButton.classList.remove('toggle-on');
            gameContainer.innerHTML = '';
        }
    });
    // toggle render to console
    const consoleButton = document.getElementById('toggle-console');
    consoleButton.addEventListener('pointerdown', () => {
        if (!buffer) return;
        buffer.isDrawToConsole = !buffer.isDrawToConsole;
        if (buffer.isDrawToConsole) {
            consoleButton.classList.add('toggle-on');
        } else {
            consoleButton.classList.remove('toggle-on');
            clearConsole();
        }
    });
    // toggle render color
    const styleButton = document.getElementById('toggle-render-style');
    styleButton.addEventListener('pointerdown', () => {
        if (!buffer) return;
        buffer.isDrawStyle = !buffer.isDrawStyle;
        if (buffer.isDrawStyle) {
            styleButton.classList.add('toggle-on');
            buffer.enableStyle();
        } else {
            styleButton.classList.remove('toggle-on');
            buffer.disableStyle();
        }
    });
}

function initBuffer(width = window.BUFFER_WIDTH, height = window.BUFFER_HEIGHT) {
    buffer = new Buffer(width, height);
    buffer.clearAll();
}

function start() {
    dispose();
    setup();
    setupEventListeners();
    initBuffer();
    buffer.enableStyle();

    plane = new Plane(0, 0, PLANE_COLOR);
    plane.position.set(buffer.width / 2, buffer.height - plane.shape.height / 2 - 1);
    mainPool.set(plane.id, plane);

    mainPool.addUpdateCb(updateObject);
    bulletPool.addUpdateCb(updateObject);
    missilePool.addUpdateCb(missileFindTarget);
    missilePool.addUpdateCb(updateObject);
    enemyPool.addUpdateCb(enemyCheckCollision);
    enemyPool.addUpdateCb(updateObject);
    explosionPool.addUpdateCb(updateObject);

    resume();
    startUpdate();
}

function clearUpdate() {
    if (INTERVAL_ID !== null) clearInterval(INTERVAL_ID);
}
function startUpdate() {
    clearUpdate()
    INTERVAL_ID = setInterval(() => {
        update();
    }, UPDATE_INTERVAL);
}

function update() {
    if (isPaused || window.GAME_HP <= 0) return;
    buffer.clearAll();
    generateEnemy();
    // update order decides draw order, b/c in update() --> updateObject, the shapes get added to the buffer
    // therefore, the latter ones get drawn on top of the former ones
    mainPool.update();
    bulletPool.update();
    missilePool.update();
    enemyPool.update();
    explosionPool.update();
    buffer.draw();
}

function pause() {
    isPaused = true;
}

function resume() {
    isPaused = false;
}

function bufferDrawOutline() {
    initBuffer();
    buffer.draw();
}


start();