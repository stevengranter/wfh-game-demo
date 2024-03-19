
export default class CollisionDetector {

  constructor() { }

  detectBoxCollision(subject, objectsArray) {
    // console.log(subject)

    for (let i = 0; i < objectsArray.length; i++) {
      let object = objectsArray[i]
      if (
        subject.dx + subject.dWidth >= object.data.dx &&
        subject.dx <= object.data.dx + object.data.dWidth &&
        subject.dy + subject.dHeight >= object.data.dy &&
        subject.dy <= object.data.dy + object.data.dHeight
      ) {
        if (!object.data.isScored) {
          let scoreObject = {}
          scoreObject.healthValue = object.data.healthValue
          scoreObject.pointValue = object.data.pointValue
          object.data.isScored = true
          object.data.isVisible = false
          return scoreObject
        } else {
          return
        }

      }



    }


  }
}
