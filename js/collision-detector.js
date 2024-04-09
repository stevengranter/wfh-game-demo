
import { wait } from "./utils.js"
export default class CollisionDetector {

  constructor() { }

  static detectBoxCollision(subject, objectsArray) {
    // console.log(subject)

    for (let i = 0; i < objectsArray.length; i++) {
      let object = objectsArray[i].data
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
