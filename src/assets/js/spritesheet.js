"use strict"
export default class SpriteSheet {
    constructor(
        imageObject,
        width,
        height,
    ) {
        this.imageObject = imageObject
        this.width = width
        this.height = height
    }
}

export class SpriteAnimation {

    constructor(
        sourceFrameXOrigin,
        sourceFrameYOrigin,
        sourceFrameWidth,
        sourceFrameHeight,
        columnNumberStartFrame,
        rowNumberStartFrame,
        totalFrames
    ) {
        this.sx = sourceFrameXOrigin
        this.sy = sourceFrameYOrigin
        this.sWidth = sourceFrameWidth
        this.sHeight = sourceFrameHeight
        this.frameX = columnNumberStartFrame
        this.frameY = rowNumberStartFrame
        this.endFrame = totalFrames - 1 // subtract 1 to account for 0 indexing
    }
}

export class SpriteAnimationList {
    constructor(
        ...animations
    ) { }
}







