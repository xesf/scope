import scenes from './data/scenes.mjs'

const ACTION_TYPE = {
    NONE:   0x00,
    UP:     0x01,
    DOWN:   0x02,
    LEFT:   0x04,
    RIGHT:  0x08,
    SHIFT:  0x10,
};

const namespace = 'http://www.w3.org/2000/svg';
const fps = 1000 / 60;

let action = ACTION_TYPE.NONE;
let prevTick = Date.now();
let frameId = null;
let scene = null;
let lastPress = Date.now();

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

const onResize = () => {
    resizeContainer();
};
window.onresize = onResize;

const initialise = () => {
    document.addEventListener('resize', onResize);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
};

const destroy = () => {
    document.removeEventListener('keyup', onKeyUp);
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('resize', onResize);
};

const createBoundary = (data) => {
    // <rect
    //     id="scene-boundary"
    //     width="150"
    //     height="210"
    //     rx="21"
    //     ry="21"
    //     fill="none"
    //     stroke="#aaa"
    //     stroke-width="1"
    //     stroke-dasharray="3.6 3.6"
    //     pointer-events="all"
    // />
    const element = document.createElementNS(namespace, 'rect');
    element.setAttribute('id', 'scene-boundary');
    element.setAttribute('rx', '21');
    element.setAttribute('ry', '21');
    element.setAttribute('fill', 'none');
    element.setAttribute('stroke', '#aaa');
    element.setAttribute('stroke-width', '1');
    element.setAttribute('stroke-dasharray', '3.6 3.6');
    element.setAttribute('pointer-events', 'all');

    element.setAttribute('width', data.width);
    element.setAttribute('height', data.height);

    return {
        ...data,
        element,
    }
};

const createExit = (data) => {
    // <g
    //     id="scene-exit"
    // >
    //     <ellipse rx="15" ry="15" fill="#d5e8d4" stroke="#82b366" stroke-width="1.2" stroke-dasharray="3.6 3.6" pointer-events="all" />
    // </g>
    const element = document.createElementNS(namespace, 'g');
    element.setAttribute('id', 'scene-exit');
    element.setAttribute('transform', `translate(${data.x}, ${data.y})`)
    
    const exitElement = document.createElementNS(namespace, 'ellipse');
    exitElement.setAttribute('rx', data.width / 2);
    exitElement.setAttribute('ry', data.height / 2);
    exitElement.setAttribute('fill', '#d5e8d4');
    exitElement.setAttribute('stroke', '#82b366');
    exitElement.setAttribute('stroke-width', '1.2');
    exitElement.setAttribute('stroke-dasharray', '3.6 3.6');
    exitElement.setAttribute('pointer-events', 'all');
    
    element.appendChild(exitElement);

    return {
        ...data,
        element,
    }
};

const createPlayer = (data) => {
    // <g
    //     id="scene-player"
    //     transform="translate(5, 5)"
    // >
    //     <ellipse cx="70" cy="70" rx="65" ry="65" fill="none" stroke="#6c8ebf" stroke-width="1.2" stroke-dasharray="3.6 3.6" pointer-events="all" />
    //     <ellipse cx="70" cy="70" rx="55" ry="55" fill="none" stroke="#6c8ebf" stroke-width="1.2" stroke-dasharray="3.6 3.6" pointer-events="all" />
    //     <ellipse  cx="70" cy="10" rx="10" ry="10" fill="#dae8fc" stroke="#6c8ebf" stroke-width="1.2" pointer-events="all" />
    // </g>
    const element = document.createElementNS(namespace, 'g');
    element.setAttribute('id', 'scene-player');
    element.setAttribute('transform', `translate(${data.x}, ${data.y})`)
    
    const createEllipse = () => {
        const elem = document.createElementNS(namespace, 'ellipse');
        elem.setAttribute('cx', data.width / 2);
        elem.setAttribute('cy', data.height / 2);
        elem.setAttribute('fill', 'none');
        elem.setAttribute('stroke', '#6c8ebf');
        elem.setAttribute('stroke-width', '1.2');
        elem.setAttribute('pointer-events', 'all');
        return elem;
    };
    
    const outerCircle = createEllipse();
    outerCircle.setAttribute('rx', '65');
    outerCircle.setAttribute('ry', '65');
    outerCircle.setAttribute('stroke-dasharray', '3.6 3.6');

    const innerCircle = createEllipse();
    innerCircle.setAttribute('rx', '55');
    innerCircle.setAttribute('ry', '55');
    innerCircle.setAttribute('stroke-dasharray', '3.6 3.6');

    const blueBall = createEllipse();
    blueBall.setAttribute('cy', '10');
    blueBall.setAttribute('rx', '10');
    blueBall.setAttribute('ry', '10');
    blueBall.setAttribute('fill', '#dae8fc');
    
    element.appendChild(outerCircle);
    element.appendChild(innerCircle);
    element.appendChild(blueBall);

    return {
        ...data,
        element,
    }
};

const loadScene = (index) => {
    if (index < 0) {
        index = 0;
    }
    if (index > scenes.length - 1) {
        index = scenes.length - 1;
    }
    const data = scenes[index];

    const container = document.getElementById('scene-container');
    
    const boundary = createBoundary(data.boundary);
    const exit = createExit(data.exit);
    const player = createPlayer(data.player);
    
    container.appendChild(boundary.element);
    container.appendChild(exit.element);
    container.appendChild(player.element);

    const cx = (window.innerWidth / 2) - (boundary.width / 2);
    const cy = (window.innerHeight / 2) - (boundary.height / 2);

    if (data.tutorial) {
        const tutorial = document.getElementById('scene-tutorial');
        tutorial.innerHTML = data.tutorial;
        tutorial.style.width = '100%';
        tutorial.style.lineHeight = '1.5';
        tutorial.style.textAlign = 'center';
        tutorial.style.position = 'absolute';
        tutorial.style.top = `${cy - 65}px`;
    }

    return {
        ...data,
        boundary,
        exit,
        player,
    };
};

const resizeContainer = () => {
    if (!scene) {
        return;
    }
    const cx = (window.innerWidth / 2) - (scene.boundary.width / 2);
    const cy = (window.innerHeight / 2) - (scene.boundary.height / 2);

    const container = document.getElementById('scene-container')
    container.setAttribute('transform',`translate(${cx}, ${cy})`);
}

const update = (tick, elapsed) => {
    if (Date.now() > lastPress + 80
        && action != ACTION_TYPE.NONE
    ) {
        lastPress = Date.now();
        let x = scene.player.x;
        let y = scene.player.y;
        let angle = scene.player.angle;
        
        if ((action & ACTION_TYPE.SHIFT) == ACTION_TYPE.SHIFT
            && (action & ACTION_TYPE.LEFT) == ACTION_TYPE.LEFT) {
            angle -= 5;
        } else if ((action & ACTION_TYPE.LEFT) == ACTION_TYPE.LEFT) {
            x -= 5;
        }
        if ((action & ACTION_TYPE.SHIFT) == ACTION_TYPE.SHIFT
            && (action & ACTION_TYPE.RIGHT) == ACTION_TYPE.RIGHT) {
            angle += 5;
        } else  if ((action & ACTION_TYPE.RIGHT) == ACTION_TYPE.RIGHT) {
            x += 5;
        }
        if ((action & ACTION_TYPE.UP) == ACTION_TYPE.UP) {
            y -= 5;
        }
        if ((action & ACTION_TYPE.DOWN) == ACTION_TYPE.DOWN) {
            y += 5;
        }

        // check boundary
        if (x < 0) {
            x = 0;
        }
        if (x > scene.boundary.x + scene.boundary.width - scene.player.width) {
            x = scene.boundary.x + scene.boundary.width - scene.player.width;
        }
        if (y < 0) {
            y = 0;
        }
        if (y > scene.boundary.y + scene.boundary.height - scene.player.height) {
            y = scene.boundary.y + scene.boundary.height - scene.player.height;
        }
        
        scene.player.x = x;
        scene.player.y = y;
        scene.player.angle = angle;
        scene.player.element.setAttribute('transform',`translate(${x}, ${y}), rotate(${angle} 70 70)`);
    }

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

    scene = loadScene(0);

    resizeContainer();

    if (mainloop()) {
        destroy();
    }
};

run();
