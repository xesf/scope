import text from './text.mjs';

const scenes = (language) => ([
	{
		tutorial: text[language].scene1_tutorial,
		boundary: {
			x: 0,
			y: 0,
			width: 150,
			height: 210,
		},
		exit: {
			x: 75,
			y: 75,
			width: 30,
			height: 30,
		},
		player: {
			x: 5,
			y: 5,
			angle: 0,
			width: 140,
			height: 140,
		},
	},
	{
		tutorial: text[language].scene2_tutorial,
		boundary: {
			x: 0,
			y: 0,
			width: 150,
			height: 210,
		},
		exit: {
			x: 19,
			y: 95,
			width: 30,
			height: 30,
		},
		player: {
			x: 5,
			y: 5,
			angle: 0,
			width: 140,
			height: 140,
		},
	},
]);

export default scenes('en');
