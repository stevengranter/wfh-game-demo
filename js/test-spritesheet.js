"use strict"

import SpriteSheet from "./spritesheet.js"
import { SpriteAnimation, SpriteAnimationList } from "./spritesheet.js"

const nannyStandingRight = new SpriteAnimation(
    0, //   sourceFrameXOrigin
    0, //   sourceFrameYOrigin
    46, //   sourceFrameWidth
    46, //   sourceFrameHeight
    0, //   columnNumberStartFrame
    1, //   rowNumberStartFrame
    1 //   totalFrames
)

const nannyWalkingRight = new SpriteAnimation(
    0, //   sourceFrameXOrigin
    0, //   sourceFrameYOrigin
    48, //   sourceFrameWidth
    46, //   sourceFrameHeight
    0, //   columnNumberStartFrame
    0, //   rowNumberStartFrame
    5 //   totalFrames
)

const nannyStandingLeft = new SpriteAnimation(
    0, //   sourceFrameXOrigin
    0, //   sourceFrameYOrigin
    46, //   sourceFrameWidth
    46, //   sourceFrameHeight
    0, //   columnNumberStartFrame
    1, //   rowNumberStartFrame
    1 //   totalFrames
)

const nannyWalkingLeft = new SpriteAnimation(
    0, //   sourceFrameXOrigin
    0, //   sourceFrameYOrigin
    46, //   sourceFrameWidth
    46, //   sourceFrameHeight
    0, //   columnNumberStartFrame
    1, //   rowNumberStartFrame
    5 //   totalFrames
)

const nannyAnimations = new SpriteAnimationList(
    nannyStandingRight,
    nannyWalkingRight,
    nannyStandingLeft,
    nannyWalkingLeft
)

const spriteSheetImg = new Image()
spriteSheetImg.src = "../images/sprites/sprites01.png"
const mainSpriteSheet = new SpriteSheet(spriteSheetImg, 1024, 1024)

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
canvas.width = 475
canvas.height = 270
ctx.imageSmoothingEnabled = false

let frameTimer = 1



let deltaTime = 0
let lastTime = 0


function animate(timeStamp) {
    deltaTime = timeStamp - lastTime
    lastTime = timeStamp

    // console.log(lastTime)
    ctx.clearRect(0, 0, canvas.width, canvas.height)


    // console.log(frameTimer)

    update(nannyWalkingRight, 15, deltaTime)

    draw(ctx, mainSpriteSheet, nannyWalkingRight, 0, 0, 46, 48)




    requestAnimationFrame(animate)
}

function update(animation, fps, deltaTime) {
    // update
    // console.log(frameTimer)
    // console.log(deltaTime + " / " + frameInterval)
    let frameInterval = 1000 / fps
    if (frameTimer > frameInterval) {

        if (animation.frameX < animation.endFrame) {
            animation.frameX += 1
            frameTimer = frameTimer - frameInterval
        } else {
            animation.frameX = 0
            frameTimer = frameTimer - frameInterval
        }
    } else {
        // console.log("deltaTime: " + deltaTime)
        // console.log(frameTimer)
        frameTimer += deltaTime

    }
}

function draw(ctx, spriteSheetObj, animation, dx, dy, dWidth, dHeight) {
    // draw
    ctx.drawImage(
        spriteSheetObj.imageObject,
        animation.sWidth * animation.frameX,
        animation.sHeight * animation.frameY, //this.spriteImageObj.sHeight, // * 0,
        animation.sWidth,
        animation.sHeight,
        dx,
        dy,
        96,
        92
    )

}
animate(0)


