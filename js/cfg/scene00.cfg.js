
import Layer from "../layer.js"
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../constants.js"

const getScene00Layer_BackgroundConfig = () => {
    return {
        spriteSrc: "./images/garden-06.png",
        animationFrame: {},
        animations: {},
        location: { dx: 0, dy: 0 },
        direction: {
            velocityX: 0,
            velocityY: 0,
        },
        timeline: {},
        playerScrollFactor: 0,
        isPlayerLayer: false
    }
}

const getScene00Layer_SpriteConfig = () => {
    return {
        // spriteSrc: "./images/garden-06.png",
        eventTimeline: [
            {
                startTime: 500,
                type: "spawner",
                objectType: "wiener",
                objectId: "wiener-",
                totalSpawnCount: 60,
                spawningDuration: 30,

            },
            {
                startTime: 5000,
                type: "spawner",
                objectType: "gull",
                objectId: "gull-",
                totalSpawnCount: 30,
                spawningDuration: 30,

            },
            {
                startTime: 10000,
                type: "spawner",
                objectType: "wiener",
                objectId: "wiener-",
                totalSpawnCount: 500,
                spawningDuration: 55,
            }


        ],
        // floorHeight: 60,
        playerBounds: {
            topLeft: { x: 0, y: 0 },
            topRight: { x: CANVAS_WIDTH, y: 0 },
            bottomRight: { x: CANVAS_WIDTH, y: CANVAS_HEIGHT - 60 },
            bottomLeft: { x: 0, y: CANVAS_HEIGHT - 60 }
        },
        playerScrollFactor: 0,
        isPlayerLayer: true,

    }
}

const getScene00Layer_ForegroundConfig = () => {
    return {
        spriteSrc: "./images/garden-06-foreground.webp",
        animationFrame: {},
        animations: {},
        location: { dx: 0, dy: 0 },
        direction: {
            velocityX: 0,
            velocityY: 0,
        },
        // spawners: [wienerSpawner, gullSpawner],
        timeline: {},
        playerScrollFactor: 0,
        isPlayerLayer: false
    }
}

const scene00Layer_Background = new Layer({ ...getScene00Layer_BackgroundConfig() })
const scene00Layer_Sprite = new Layer({ ...getScene00Layer_SpriteConfig() })
const scene00Layer_Foreground = new Layer({ ...getScene00Layer_ForegroundConfig() })


export const scene00Config = {
    index: 0,
    name: "Garden",
    layers: [scene00Layer_Background, scene00Layer_Sprite, scene00Layer_Foreground],
    spriteLayerIndex: 1,
    music: ["../audio/music/alouette_55s.mp3"],
    sfx: [],
    goals: {
        gold: {
            type: "score",
            value: 10000
        },
        silver: {
            type: "score",
            value: 5000
        },
        bronze: {
            type: "score",
            value: 2500
        }
    }

}


