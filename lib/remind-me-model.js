'use babel'; // What does this do?

// "export default" tells others who import this module (file) that this object
// (RemindMeModel) is a class (as opposed to a function, etc.)
// see also:
// http://2ality.com/2014/09/es6-modules-final.html#default-exports-one-per-module
// https://stackoverflow.com/questions/21117160/what-is-export-default-in-javascript
export default class RemindMeModel {
  constructor() {
    this.timerStartTime = null;
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {
    return {
      timerStartTime: this.timerStartTime
    };
  }

  startTimer() {
    this.timerStartTime = new Date().getTime();
    console.log('RemindMe: started timer!');
  }

  // Tear down any state and detach
  destroy() {
    // what do we do here?
  }

}
