import { CANVAS_HEIGHT, CANVAS_WIDTH, CANVAS, CTX } from "./constants.js"
import Spawner from "./spawner.js"

export default class Layer {
    constructor({
        spriteSrc = null,
        eventTimeline = null,
        player = null,
        playerScrollFactor = 0,
        isPlayerLayer = false,
        playerBounds = null,
        spawners = null
    }) {
        this.spriteSrc = spriteSrc
        this.eventTimeline = eventTimeline
        this.player = player
        this.playerScrollFactor = playerScrollFactor
        this.isPlayerLayer = isPlayerLayer
        this.playerBounds = playerBounds
        // this.spawners = spawners

        // Set defaults if not provided
        this.sx = this.sx ?? 0
        this.sy = this.sy ?? 0

        this.dx = 0
        this.dy = 0


        this.velocityX = 0
        this.velocityY = 0

        // Initialize imageObject as null or undefined
        this.imageObject = null
        // console.log(this)

        // Player bounds defaults to the corners of the canvas if not provided
        // console.log(this.playerBounds)

        // this.player.bounds = this.playerBounds

        // Call init to load the background image 
        if (this.spriteSrc) this.init()

        console.log(this)

    }

    async init() {
        try {
            this.imageObject = await this.loadImage(this.spriteSrc)
            console.log("Layer image loaded")
        } catch (error) {
            console.error('Error loading image:', error)
        }
    }

    loadImage(sourceImage) {
        return new Promise((resolve, reject) => {
            const imageObject = new Image()

            imageObject.onload = () => {
                this.sWidth = imageObject.naturalWidth
                this.sHeight = imageObject.naturalHeight
                this.dHeight = this.dHeight ?? CANVAS_HEIGHT
                this.dWidth = this.dWidth ?? CANVAS_WIDTH
                resolve(imageObject)
            }

            imageObject.onerror = (error) => {
                reject(error)
            }

            imageObject.src = sourceImage
            this.imageObject = imageObject
        })

    }

    draw(context, background = true, spawners = false, player = false) {
        // console.log(player)
        if (background) this.drawBackground(context)
        // if (spawners) this.drawSpawners(context)
        if (player) this.drawPlayer(context)

    }

    update(deltaTime, input, playerVelocityX, playerVelocityY) {
        this.updateBackground(deltaTime, playerVelocityX, playerVelocityY)
        // this.updateSpawners(deltaTime)
        this.updatePlayer(input, deltaTime)
    }

    updatePlayer(input, deltaTime) {
        if (this.isPlayerLayer === true) {
            // console.log("update: is player layer")
            this.player.update(input, deltaTime)
        }
    }

    drawPlayer(context) {
        if (this.isPlayerLayer === true) {
            // console.log("draw: is player layer")
            this.player.draw(context)
        }
    }

    // MOVED 
    // updateSpawners(deltaTime) {
    //     if (!this.spawners) return
    //     this.spawners.forEach((spawner) => {
    //         spawner.update(deltaTime)
    //     })
    // }

    // drawSpawners(context) {
    //     if (!this.spawners) return
    //     this.spawners.forEach((spawner) => {
    //         spawner.draw(CTX)
    //     })
    // }


    drawBackground(context) {

        // Guard clause: If there is no background image, just return
        if (!this.imageObject) return

        if (this.imageObject) {
            if (this.filter !== "none") {
                context.filter = this.filter
            }
            // console.log(this.imageObject)
            context.drawImage(
                this.imageObject,
                this.sx,
                this.sy,
                this.sWidth,
                this.sHeight,
                Math.floor(this.dx),
                Math.floor(this.dy),
                this.dWidth,
                this.dHeight
            )

            // Reset the filter to "none" after drawing
            context.filter = "none"
        } else {
            console.warn('Image not loaded, cannot draw layer')
        }
    }





    updateBackground(deltaTime, playerVelocityX = 0, playerVelocityY = 0) {
        // console.log(playerVelocityX)
        if (!this.imageObject) return
        if (this.playerScrollFactor === 0) {

            this.dx += this.velocityX * deltaTime
            this.dy += this.velocityY * deltaTime
        } else {
            // negative so the background scrolls in the opposite direction of player
            this.dx += -(this.velocityX + (this.playerScrollFactor * this.player.velocityX)) * deltaTime

        }
    }
}

