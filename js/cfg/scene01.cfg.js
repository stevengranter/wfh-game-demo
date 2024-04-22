"use strict"

import Layer from "../layer.js"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../constants.js"

const getScene01Layer_BackgroundConfig = () => {
    return {
        spriteSrc: "./images/bg-beach-huts-01.webp",
        animationFrame: {},
        animations: {},
        location: { dx: 0, dy: 0 },
        direction: {
            velocityX: 0,
            velocityY: 0,
        },
        playerScrollFactor: 0,
        isPlayerLayer: false
    }
}

const getScene01Layer_SpriteConfig = () => {
    return {
        eventTimeline: [

            {
                startTime: 5000,
                type: "spawner",
                objectType: "wiener",
                totalSpawnCount: 25,
                spawningDuration: 5,

            },
            {
                startTime: 10000,
                type: "spawner",
                objectType: "wiener",
                totalSpawnCount: 100,
                spawningDuration: 5
            },
            {
                startTime: 10000,
                type: "spawner",
                objectType: "wiener",
                totalSpawnCount: 500,
                spawningDuration: 10,

            },
        ],
        playerScrollFactor: 0,
        isPlayerLayer: true,
        playerBounds: {
            topLeft: { x: 0, y: 0 },
            topRight: { x: CANVAS_WIDTH, y: 0 },
            bottomRight: { x: CANVAS_WIDTH, y: CANVAS_HEIGHT - 15 },
            bottomLeft: { x: 0, y: CANVAS_HEIGHT - 15 }
        },
    }
}

const scene01Layer_Background = new Layer({ ...getScene01Layer_BackgroundConfig() })
const scene00Layer_Sprite = new Layer({ ...getScene01Layer_SpriteConfig() })

export const scene01Config = {
    index: 0,
    name: "Cavendish",
    // playerBounds: {
    //     topLeft: { x: 0, y: 0 },
    //     topRight: { x: CANVAS_WIDTH, y: 0 },
    //     bottomRight: { x: CANVAS_WIDTH, y: CANVAS_HEIGHT - 20 },
    //     bottomLeft: { x: 0, y: CANVAS_HEIGHT - 20 }
    // },
    layers: [scene01Layer_Background, scene00Layer_Sprite],
    spriteLayerIndex: 1,
    music: ["./audio/music/i_equals_da_by.mp3"],
    sfx: [],
    events: [],
    goals: {
        gold: {
            type: "score",
            value: 10000
        },
        silver: {
            type: "score",
            value: 8000
        },
        bronze: {
            type: "score",
            value: 5000
        }
    }
}