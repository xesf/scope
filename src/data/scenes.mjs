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
            x: 60,
            y: 40,
            angle: 135,
            width: 140,
            height: 140
        },
        obstacles: [
            {
                x: 155,
                y: 90,
                width: 40,
                height: 25
            },
            {
                x: 100,
                y: 125,
                width: 25,
                height: 50
            },
        ]
    },
    {
        boundary: {
            x: 0,
            y: 0,
            width: 170,
            height: 160
        },
        exit: {
            x: 20,
            y: 90,
            width: 30,
            height: 30
        },
        player: {
            x: 20,
            y: 10,
            angle: 0,
            width: 140,
            height: 140
        },
        obstacles: [
            {
                x: 70,
                y: 40,
                width: 50,
                height: 25
            },
            {
                x: 0,
                y: 20,
                width: 25,
                height: 50
            },
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
            x: 60,
            y: 40,
            angle: 135,
            width: 140,
            height: 140
        },
        obstacles: [
            {
                x: 155,
                y: 90,
                width: 40,
                height: 25
            },
            {
                x: 100,
                y: 125,
                width: 25,
                height: 50
            },
            {
                x: 40,
                y: 20,
                width: 25,
                height: 35
            },
        ]
    },
    {
        boundary: {
            x: 0,
            y: 0,
            width: 150,
            height: 300
        },
        exit: {
            x: 110,
            y: 260,
            width: 30,
            height: 30
        },
        player: {
            x: 10,
            y: 5,
            angle: 140,
            width: 140,
            height: 140
        },
        obstacles: [
            {
                x: 80,
                y: 80,
                width: 60,
                height: 24
            },
            {
                x: 70,
                y: 160,
                width: 40,
                height: 24
            },
            {
                x: 110,
                y: 160,
                width: 25,
                height: 80
            },
            {
                x: 45,
                y: 130,
                width: 25,
                height: 40
            },
            {
                x: -10,
                y: 240,
                width: 20,
                height: 24
            },
            {
                x: 60,
                y: 240,
                width: 30,
                height: 24
            },
        ]
    },
    {
        boundary: {
            x: 0,
            y: 0,
            width: 220,
            height: 180
        },
        exit: {
            x: 20,
            y: 45,
            width: 30,
            height: 30
        },
        player: {
            x: 80,
            y: 40,
            angle: 135,
            width: 140,
            height: 140
        },
        obstacles: [
            {
                x: 175,
                y: 90,
                width: 40,
                height: 25
            },
            {
                x: 120,
                y: 125,
                width: 25,
                height: 50
            },
            {
                x: 40,
                y: 20,
                width: 25,
                height: 110
            },
        ]
    },
];

export default scenes;
