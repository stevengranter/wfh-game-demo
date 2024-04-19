"use strict"

// import constants used in configuration functions
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../constants.js"
import { spriteTags } from "../sprite.js"

// 🌭 Arrow function to create wiener configuration
export const getWienerConfig = () => {
    return {
        spriteSrc: "./images/wiener-32px-spin-01.png",
        animationFrame: { x: 0, y: 0, width: 32, height: 32 },
        animations: {
            Spinning: {
                frameX: 0,
                frameY: 0,
                endFrame: 28
            },
        },
        location: {
            dx: {
                random:
                {
                    lowerBound: -20,
                    upperBound: CANVAS_WIDTH + 20
                }
            },
            dy: {
                random:
                {
                    lowerBound: -50,
                    upperBound: 0
                },
            },
        },
        direction: {
            velocityX: {
                random:
                {
                    lowerBound: -25,
                    upperBound: 25
                },
            },
            velocityY: {
                random:
                {
                    lowerBound: 25,
                    upperBound: 150
                },
            },
        },
        healthValue: 5,
        pointValue: 100,
        spriteTag: spriteTags.WIENER,
        timeLimit: 4
    }
}
// 🐦 Arrow function to create gull configuration
export const getGullConfig = () => {
    return {
        spriteSrc: "./images/seagull-flying-sprite-01-sheet.png",
        animationFrame: { x: 0, y: 0, width: 44, height: 51 },
        animations: {
            Spinning: {
                frameX: 0,
                frameY: 0,
                endFrame: 7
            },
        },
        location: {
            dx: {
                random:
                {
                    lowerBound: CANVAS_WIDTH,
                    upperBound: CANVAS_WIDTH + 100
                }
            },
            dy: {
                random:
                {
                    lowerBound: 0,
                    upperBound: -40
                },
            },
        },
        direction: {
            velocityX: {
                random:
                {
                    lowerBound: -300,
                    upperBound: -100
                },
            },
            velocityY: {
                random:
                {
                    lowerBound: 10,
                    upperBound: 20
                },
            },
        },
        objectType: "enemy",
        healthValue: 0,
        spriteTag: spriteTags.GULL,
        pointValue: 0,
        timeLimit: 10,
    }
}

// 💩 Arrow function to create gull blessings configuration
export const getGullBlessingConfig = () => {
    return {
        spriteSrc: "./images/seagull-poo-sprite-02.png",
        offset: { x: 30, y: 38 },
        animationFrame: { x: 0, y: 0, width: 16, height: 16 },
        animations: {
            Spinning: {
                frameX: 0,
                frameY: 0,
                endFrame: 0
            },
        },
        location: {
            dx: {
                random:
                {
                    lowerBound: -20,
                    upperBound: CANVAS_WIDTH + 20
                }
            },
            dy: {
                random:
                {
                    lowerBound: -50,
                    upperBound: 0
                },
            },
        },
        direction: {
            velocityX: {
                random:
                {
                    lowerBound: -10,
                    upperBound: +10
                },
            },
            velocityY: {
                random:
                {
                    lowerBound: 50,
                    upperBound: 300
                },
            },
        },
        healthValue: -25,
        pointValue: 0,
        spriteTag: spriteTags.POO,
        timeLimit: 4,
        parentSpriteTag: spriteTags.GULL
    }
}

