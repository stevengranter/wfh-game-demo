"use strict"

import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js"

export default class Layer {
    constructor({
        spriteSrc = null,
        eventTimeline = null,
        player = null,
        playerScrollFactor = 0,
        isPlayerLayer = false,
        playerBounds = null,
    }, spawner) {
        this.spriteSrc = spriteSrc
        this.eventTimeline = eventTimeline
        this.player = player
        this.playerScrollFactor = playerScrollFactor
        this.isPlayerLayer = isPlayerLayer
        this.playerBounds = playerBounds

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

        this.spawner = spawner
        this.filter = null
        // console.log(this)

    }

    async init() {
        try {
            this.imageObject = await this.loadImage(this.spriteSrc)
            console.log(`✔️ Layer is loaded (${this.spriteSrc})`)

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
        if (player) this.drawPlayer(context)
        if (spawners) this.drawSpawner(context)

    }

    update(deltaTime, input, playerVelocityX, playerVelocityY) {
        this.updateBackground(deltaTime, playerVelocityX, playerVelocityY)
        this.updatePlayer(input, deltaTime)
        this.updateSpawner(deltaTime)

    }

    updatePlayer(input, deltaTime) {
        if (this.isPlayerLayer === true) {
            try { this.player.update(input, deltaTime) }
            catch { console.error(`drawPlayer: this.player is ${this.player}`) }

        }
    }

    drawPlayer(context) {
        if (this.isPlayerLayer === true) {
            try { this.player.draw(context) }
            catch {
                // console.error(`drawPlayer: this.player is ${this.player}`)
                console.log("drawPlayer error:")
                console.dir(this.player)
            }

        }
    }

    updateSpawner(deltaTime) {
        if (!this.spawner) return
        this.spawner.update(deltaTime)
    }

    drawSpawner(context) {
        if (!this.spawner) return
        this.spawner.draw(context)
    }


    drawBackground(context) {

        // Guard clause: If there is no background image, just return
        if (!this.imageObject) return

        if (this.imageObject) {
            console.log(this.filter)
            if (this.filter) {
                console.log(this.filter)
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

