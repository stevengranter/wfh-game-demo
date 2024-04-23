"use strict"
/* Constants that do not, or should not change are
declared her instead of passing objects (like canvas) around
only to obtain fixed and unchanging values (like canvas width and height) */

// Constants declared for canvas height and width
export const CANVAS_WIDTH = 475
export const CANVAS_HEIGHT = 270

// Constants declared for canvas element and context
export const CANVAS = document.getElementById("game-screen__canvas")
export const CTX = CANVAS.getContext("2d")


export const gameStateKeys = {
    TITLE: "title",
    START: "start",
    INTRO: "intro",
    POPUP: "popup",
    PLAY: "play",
    PAUSED_BY_PLAYER: "paused",
    SCENE_END: "endscene",
    SCENE_START: "startscene",
    GAMEOVER: "gameover",
    END: "endgame",
    CREDITS: "credits",
}

export const musicStateKeys = {
    PAUSED: "paused",
    PLAYING: "playing",
    STOPPED: "stopped",
    READY: "ready"
}


