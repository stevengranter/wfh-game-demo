
import { wait } from "./utils.js"
export default class CollisionDetector {



  static detectBoxCollision(subject, objectsArray) {
    // console.log(subject)

    for (const element of objectsArray) {
      let object = element.data
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
          return object
        } else {
          return false
        }

      }



    }


  }
}
