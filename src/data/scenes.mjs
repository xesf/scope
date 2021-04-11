import text from './text.mjs';

const scenes = [
    {
        tutorial: 'scene1_tutorial',
        boundary: {
            x: 0,
            y: 0,
            width: 150,
            height: 210
        },
        exit: {
            x: 75,
            y: 75,
            width: 30,
            height: 30
        },
        player: {
            x: 5,
            y: 5,
            angle: 0,
            width: 140,
            height: 140
        }
    },
    {
        tutorial: 'scene2_tutorial',
        boundary: {
            x: 0,
            y: 0,
            width: 150,
            height: 210
        },
        exit: {
            x: 19,
            y: 95,
            width: 30,
            height: 30
        },
        player: {
            x: 5,
            y: 5,
            angle: 0,
            width: 140,
            height: 140
        }
    },
    {
        tutorial: 'scene3_tutorial',
        boundary: {
            x: 0,
            y: 0,
            width: 150,
            height: 180
        },
        exit: {
            x: 19,
            y: 95,
            width: 30,
            height: 30
        },
        player: {
            x: 5,
            y: 5,
            angle: 0,
            width: 140,
            height: 140
        },
        obstacles: [
            {
                x: -10,
                y: 50,
                width: 60,
                height: 24
            }
        ]
    },
    {
        boundary: {
            x: 0,
            y: 0,
            width: 200,
            height: 180
        },
        exit: {
            x: 20,
            y: 85,
            width: 30,
            height: 30
        },
        player: {
            x: 50,
            y: 10,
            angle: 0,
            width: 140,
            height: 140
        },
        obstacles: [
            {
                x: 30,
                y: 40,
                width: 60,
                height: 25
            },
            {
                x: 140,
                y: 70,
                width: 25,
                height: 50
            },
        ]
    },
];

export default scenes;
