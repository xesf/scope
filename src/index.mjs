import scenes from './data/scenes.mjs'

const ACTION_TYPE = {
    NONE:   0x00,
    UP:     0x01,
    DOWN:   0x02,
    LEFT:   0x04,
    RIGHT:  0x08,
    SHIFT:  0x10,
};

const fps = 1000 / 60;

let action = ACTION_TYPE.NONE;
let prevTick = Date.now();
let frameId = null;

const onKeyDown = (e) => {
    switch(e.key) {
        case 'ArrowUp':
            action |= ACTION_TYPE.UP;
            break;
        case 'ArrowDown':
            action |= ACTION_TYPE.DOWN;
            break;
        case 'ArrowLeft':
            action |= ACTION_TYPE.LEFT;
            break;
        case 'ArrowRight':
            action |= ACTION_TYPE.RIGHT;
            break;
        case 'Shift':
            action |= ACTION_TYPE.SHIFT;
            break;
    }
};

const onKeyUp = (e) => {
    switch(e.key) {
        case 'ArrowUp':
            action &= ~ACTION_TYPE.UP;
            break;
        case 'ArrowDown':
            action &= ~ACTION_TYPE.DOWN;
            break;
        case 'ArrowLeft':
            action &= ~ACTION_TYPE.LEFT;
            break;
        case 'ArrowRight':
            action &= ~ACTION_TYPE.RIGHT;
            break;
        case 'Shift':
            action &= ~ACTION_TYPE.SHIFT;
            break;
    }
};

const initialise = () => {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
};

const destroy = () => {
    document.removeEventListener('keyup', onKeyUp);
    document.removeEventListener('keydown', onKeyDown);
};

const loadScene = (index) => {
    if (index < 0) {
        index = 0;
    }
    if (index > scenes.length - 1) {
        index = scenes.length - 1;
    }

    const data = scenes[index];

    return {
        ...data,
    }
};

const update = (tick, elapsed) => {

    return false;
}

window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || ((f) => setTimeout(f, fps));

const mainloop = () => {
    frameId = requestAnimationFrame(mainloop);

    const tick = Date.now();
    const elapsed = tick - prevTick;

    if (elapsed > fps) {
        prevTick = tick - (elapsed % fps);
    }

    if (update(tick, elapsed)) {
        cancelAnimationFrame(frameId);
    }
}

const run = () => {
    initialise();

    const scene = loadScene(0);

    if (mainloop()) {
        destroy();
    }
};

run();
