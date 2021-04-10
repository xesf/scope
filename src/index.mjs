import { getBBox, checkContains, checkIntersection } from './utils.mjs';
import scenes from './data/scenes.mjs';
import text from './data/text.mjs';

const ACTION_TYPE = {
	NONE: 0x00,
	UP: 0x01,
	DOWN: 0x02,
	LEFT: 0x04,
	RIGHT: 0x08,
	SHIFT: 0x10
};

const namespace = 'http://www.w3.org/2000/svg';
const fps = 1000 / 60;

let action = ACTION_TYPE.NONE;
let prevTick = Date.now();
let frameId = null;
let scene = null;
let sceneIndex = parseInt(window.localStorage.getItem('sceneIndex')) || 0;
let moves = parseInt(window.localStorage.getItem('moves')) || 0;
let lastPress = Date.now();
let changeScene = null;
let prevMoves = 0;

let language = window.localStorage.getItem('lang') || navigator.language.slice(0,2) || 'en';
let languageChanged = false;

const playerOffsetX = 70;
const playerOffsetY = 10;

const onKeyDown = (e) => {
	switch (e.key) {
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
	switch (e.key) {
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
		element
	};
};

const createExit = (data) => {
	// <g
	//     id="scene-exit"
	// >
	//     <ellipse rx="15" ry="15" fill="#d5e8d4" stroke="#82b366" stroke-width="1.2" stroke-dasharray="3.6 3.6" pointer-events="all" />
	// </g>
	const element = document.createElementNS(namespace, 'g');
	element.setAttribute('id', 'scene-exit');
	element.setAttribute('transform', `translate(${data.x}, ${data.y})`);

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
		element
	};
};

const createObstacles = (data) => {
	// <rect x="654" y="1443.6" width="60" height="24" rx="3.6" ry="3.6" fill="#ffe6cc" stroke="#d79b00" stroke-width="1.2" pointer-events="all"></rect>
	const element = document.createElementNS(namespace, 'g');
	element.setAttribute('id', 'scene-obstacles');

	data.forEach((obs) => {
		const obsElement = document.createElementNS(namespace, 'rect');
		obsElement.setAttribute('x', obs.x);
		obsElement.setAttribute('y', obs.y);
		obsElement.setAttribute('width', obs.width);
		obsElement.setAttribute('height', obs.height);
		obsElement.setAttribute('rx', '3.6');
		obsElement.setAttribute('ry', '3.6');
		obsElement.setAttribute('fill', '#ffe6cc');
		obsElement.setAttribute('stroke', '#d79b00');
		obsElement.setAttribute('stroke-width', '1.2');
		obsElement.setAttribute('pointer-events', 'all');

		element.appendChild(obsElement);
	});

	return {
		...data,
		element
	};
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
	element.setAttribute('transform', `translate(${data.x}, ${data.y})`);

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
	blueBall.setAttribute('id', 'player-ball');
	blueBall.setAttribute('cy', '10');
	blueBall.setAttribute('rx', '10');
	blueBall.setAttribute('ry', '10');
	blueBall.setAttribute('fill', '#dae8fc');

	element.appendChild(outerCircle);
	element.appendChild(innerCircle);
	element.appendChild(blueBall);

	return {
		...data,
		element
	};
};

const loadScene = (index) => {
	if (index < 0) {
		index = 0;
	}
	if (index > scenes.length - 1) {
		index = scenes.length - 1;
	}
    sceneIndex = index;
    prevMoves = moves;
    window.localStorage.setItem('sceneIndex', sceneIndex);
	const data = scenes[index];

    const hudScenes = document.getElementById('hud-scenes');
    hudScenes.innerText = `${text[language].scenes} ${sceneIndex + 1}/${scenes.length}`;
    const hudMoves = document.getElementById('hud-moves');
    hudMoves.innerText = `${text[language].moves} ${moves}`;

	const container = document.getElementById('scene-container');
	container.innerHTML = '';

	const boundary = createBoundary(data.boundary);
	const exit = createExit(data.exit);
	const player = createPlayer(data.player);

	container.appendChild(boundary.element);
	container.appendChild(exit.element);
	container.appendChild(player.element);

	let obstacles = [];
	if (data.obstacles) {
		obstacles = createObstacles(data.obstacles);
		container.appendChild(obstacles.element);
	}

	const cx = window.innerWidth / 2 - boundary.width / 2;
	const cy = window.innerHeight / 2 - boundary.height / 2;

	if (data.tutorial) {
		const tutorial = document.getElementById('hud-tutorial');
		tutorial.innerHTML = text[language][data.tutorial];
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
		obstacles,
		complete: false
	};
};

const resizeContainer = () => {
	if (!scene) {
		return;
	}
	const cx = window.innerWidth / 2 - scene.boundary.width / 2;
	const cy = window.innerHeight / 2 - scene.boundary.height / 2;

	const container = document.getElementById('scene-container');
	container.setAttribute('transform', `translate(${cx}, ${cy})`);

    if (scene.tutorial) {
		const tutorial = document.getElementById('hud-tutorial');
		tutorial.style.top = `${cy - 65}px`;
	}
};

const update = (tick, elapsed) => {
	if (!scene.complete && Date.now() > lastPress + 80 && action != ACTION_TYPE.NONE) {
		lastPress = Date.now();
		let x = scene.player.x;
		let y = scene.player.y;
		let angle = scene.player.angle;

		if ((action & ACTION_TYPE.SHIFT) == ACTION_TYPE.SHIFT && (action & ACTION_TYPE.LEFT) == ACTION_TYPE.LEFT) {
			angle -= 5;
            moves++;
		} else if ((action & ACTION_TYPE.LEFT) == ACTION_TYPE.LEFT) {
			x -= 5;
            moves++;
		} else if ((action & ACTION_TYPE.SHIFT) == ACTION_TYPE.SHIFT && (action & ACTION_TYPE.RIGHT) == ACTION_TYPE.RIGHT) {
			angle += 5;
            moves++;
		} else if ((action & ACTION_TYPE.RIGHT) == ACTION_TYPE.RIGHT) {
			x += 5;
            moves++;
		} else if ((action & ACTION_TYPE.UP) == ACTION_TYPE.UP) {
			y -= 5;
            moves++;
		} else if ((action & ACTION_TYPE.DOWN) == ACTION_TYPE.DOWN) {
			y += 5;
            moves++;
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

        const saveX = scene.player.x;
        const saveY = scene.player.y;
        const saveAngle = scene.player.angle;

        scene.player.x = x;
        scene.player.y = y;
        scene.player.angle = angle;
        scene.player.element.setAttribute('transform', `translate(${x}, ${y}), rotate(${angle} 70 70)`);

        const playerBB = getBBox(scene.player.element.childNodes[2]);
        const exitBB = getBBox(scene.exit.element);

		if (checkContains(exitBB, playerBB)) {
			scene.complete = true;
			console.log('Solved!!');
		}

        let blocked = false;
        scene.obstacles?.element?.childNodes.forEach((obs) => {
            const obsBB = getBBox(obs);
            if (checkIntersection(obsBB, playerBB)) {
                blocked |= true;
            }
        });
  
        if (blocked) {
            moves--;
            scene.player.x = saveX;
            scene.player.y = saveY;
            scene.player.angle = saveAngle;
            scene.player.element.setAttribute('transform', `translate(${saveX}, ${saveY}), rotate(${saveAngle} 70 70)`);
        }
        window.localStorage.setItem('moves', moves);

        const hudMoves = document.getElementById('hud-moves');
        hudMoves.innerText = `${text[language].moves} ${moves}`;
	}

	if (scene.complete && !changeScene) {
		changeScene = setTimeout(() => {
			sceneIndex += 1;
			scene = loadScene(sceneIndex);
			changeScene = null;
		}, 500);
	}

    const hudMoves = document.getElementById('hud-moves');
    if (hudMoves.innerText === '') {
        hudMoves.innerText = `${text[language].moves} ${moves}`;
    }

    const hudAuthor = document.getElementById('hud-author');
    if (hudAuthor.innerText === '') {
        hudAuthor.innerText = `${text[language].created_by} Palanca Studios`;
    }

    if (languageChanged) {
        languageChanged = false;
        const hudScenes = document.getElementById('hud-scenes');
        hudScenes.innerText = `${text[language].scenes} ${sceneIndex + 1}/${scenes.length}`;
        hudMoves.innerText = `${text[language].moves} ${moves}`;
        hudAuthor.innerText = `${text[language].created_by} Palanca Studios`;
        if (scene.tutorial) {
            const tutorial = document.getElementById('hud-tutorial');
            tutorial.innerHTML = text[language][scene.tutorial];
        }
        const hudRedo = document.getElementById('hud-redo');
        hudRedo.title = text[language].redo;
        hudRedo.ariaLabel = text[language].redo;
        const hudRestart = document.getElementById('hud-restart');
        hudRestart.title = text[language].restart;
        hudRestart.ariaLabel = text[language].restart;
    }

	return false;
};

window.requestAnimationFrame =
	window.requestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	((f) => setTimeout(f, fps));

const mainloop = () => {
	frameId = requestAnimationFrame(mainloop);

	const tick = Date.now();
	const elapsed = tick - prevTick;

	if (elapsed > fps) {
		prevTick = tick - elapsed % fps;
	}

	if (update(tick, elapsed)) {
		cancelAnimationFrame(frameId);
	}
};

const setLanguage = (e) => {
    language = e.srcElement.id;
    languageChanged = true;
    window.localStorage.setItem('lang', language);
};

const redo = (e) => {
    moves = prevMoves;
    scene = loadScene(sceneIndex);
};

const restart = (e) => {
    moves = 0;
    scene = loadScene(0);
}

const run = () => {
	initialise();

	scene = loadScene(sceneIndex);

	resizeContainer();

    const hudFlags = document.getElementById('hud-flags');
    hudFlags.childNodes.forEach((n) => {
        n.addEventListener('click', setLanguage);
    });

    const hudRedo = document.getElementById('hud-redo');
    hudRedo.addEventListener('click', redo);
    hudRedo.title = text[language].redo;
    hudRedo.ariaLabel = text[language].redo;
    const hudRestart = document.getElementById('hud-restart');
    hudRestart.addEventListener('click', restart);
    hudRestart.title = text[language].restart;
    hudRestart.ariaLabel = text[language].restart;

	if (mainloop()) {
		destroy();
	}
};

run();
