
import { wait } from "./utils.js"
export default class CollisionDetector {

  // Basic AABB box collision detection
  static detectBoxCollision(subject, object) {

    /* if either the subject or object is out of the gameplay bounds,
      we don't have to check for a collision
    */
    if (!subject.isOutOfBounds() || !object.isOutOfBounds()) {

      if (
        subject.dx + subject.dWidth >= object.dx &&
        subject.dx <= object.dx + object.dWidth &&
        subject.dy + subject.dHeight >= object.dy &&
        subject.dy <= object.dy + object.dHeight
      ) {
        if (!object.isScored) {
          object.isScored = true
          object.isVisible = false
          wait(500) // wait for 0.5 seconds to avoid returning multiple collisions
          const scoreObject = {}
          scoreObject.health = object.healthValue
          scoreObject.points = object.pointValue
          return scoreObject// return object
        } else {
          return null // if object has already been scored
        }
      } else {
        return null // if no collision has occured
      }
    } else {
      return null // if subject or object is out of bounds
    }

  }


}

