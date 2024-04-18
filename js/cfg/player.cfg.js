// 👵🏼 Initialize player
export const playerConfig = {
    spriteSrc: "./images/nan-sprite-walk.png",
    animationFrame: {
        x: 0,
        y: 0,
        width: 48,
        height: 48
    },
    animations: {
        StandingLeft: {
            frameX: 0,
            frameY: 1,
            endFrame: 0
        },
        StandingRight: {
            frameX: 0,
            frameY: 0,
            endFrame: 0
        },
        WalkingLeft: {
            frameX: 0,
            frameY: 1,
            endFrame: 4
        },
        WalkingRight: {
            frameX: 0,
            frameY: 0,
            endFrame: 4
        },
    }
}