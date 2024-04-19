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
