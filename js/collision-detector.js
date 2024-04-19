"use strict"

// import wait function from utilities
import { wait } from "./utils.js"

// Class declaration for collision detector
export default class CollisionDetector {

  // Basic Axis-Aligned Bounding Box (AABB) collision detection
  static detectBoxCollision(subject, object) {

    //  If either the subject or object is out of the gameplay bounds,
    //  return null
    if (subject.isOutOfBounds() || object.isOutOfBounds()) return null

    // AABB collision detection algorithm
    if (
      subject.dx + subject.dWidth >= object.dx &&
      subject.dx <= object.dx + object.dWidth &&
      subject.dy + subject.dHeight >= object.dy &&
      subject.dy <= object.dy + object.dHeight
    ) {
      // If object hasn't been scored, set isScored to true and isVisible to false,
      // return scoreObject containing healthValue and pointValue
      if (!object.isScored) {
        object.isScored = true
        object.isVisible = false
        console.log(`collision with ${object.spriteTag}`)
        wait(500) // wait for 0.5 seconds to avoid returning multiple collisions
        const scoreObject = {}
        // console.log(object)
        scoreObject.health = object.healthValue
        scoreObject.points = object.pointValue
        return scoreObject// return object
      } else {
        return null // if object has already been scored
      }
    } else {
      return null // if no collision has occured
    }
  }
}


