import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js"

export default class Layer {
    constructor(args) {
        Object.assign(this, args)

        // Set defaults if not provided
        this.sx = this.sx ?? 0
        this.sy = this.sy ?? 0

        this.dx = this.location.dx ?? 0
        this.dy = this.location.dy ?? 0

        this.velocityX = this.direction.velocityX ?? 0
        this.velocityY = this.direction.velocityY ?? 0

        // Initialize imageObject as null or undefined
        this.imageObject = null
        console.log(this)
        // Now we need to call init() after construction to load the image
        this.init()
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



    draw(context) {
        // Check if the imageObject is loaded before drawing
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



    update(deltaTime, playerVelocityX = 0, playerVelocityY = 0) {
        // console.log(playerVelocityX)

        if (this.playerScrollFactor === 0) {

            this.dx += this.velocityX * deltaTime
            this.dy += this.velocityY * deltaTime
        } else {
            // negative so the background scrolls in the opposite direction of player
            this.dx += -(this.velocityX + (this.playerScrollFactor * this.player.velocityX)) * deltaTime

        }
    }
}

