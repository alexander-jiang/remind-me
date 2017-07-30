'use babel';

// import RemindMeView from './remind-me-view';
import RemindMeModel from './remind-me-model';
import { CompositeDisposable } from 'atom';

export default {

  // remindMeView: null,
  remindMeModel: null,
  footerPanel: null,
  subscriptions: null,
  timerStartTime: null,

  activate(state) {
    // Code in progress:
    // see here: https://discuss.atom.io/t/how-to-work-addviewprovider-with-addbottompanel/20126
    viewProviderSubscription = atom.views.addViewProvider(RemindMeModel, this.viewFactory);
    this.remindMeModel = new RemindMeModel();
    this.footerPanel = atom.workspace.addFooterPanel({
      item: this.remindMeModel,
      visible: false
    });

    // this.remindMeView = new RemindMeView(state.remindMeViewState);
    // this.footerPanel = atom.workspace.addFooterPanel({
    //   item: this.remindMeView.getElement(),
    //   visible: false
    // } );

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'remind-me:toggle': () => this.toggle(),
      'remind-me:start-timer': () => this.startTimer()
    }));
  },

  deactivate() {
    this.footerPanel.destroy();
    this.subscriptions.dispose();
    // this.remindMeView.destroy();
    this.remindMeModel.destroy();
  },

  serialize() {
    // return {
    //   remindMeViewState: this.remindMeView.serialize()
    // };
  },

  toggle() {
    console.log('RemindMe was toggled!');
    return (
      this.footerPanel.isVisible() ?
      this.footerPanel.hide() :
      this.footerPanel.show()
    );
  },

  startTimer() {
    this.timerStartTime = new Date().getTime();
    console.log('RemindMe: started timer!');
  },

  viewFactory(modelInstance) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('remind-me');

    // Create message element
    const message = document.createElement('div');

    // TODO read this from config/when the timer is started
    if (this.timerStartTime == null) {
      message.textContent = 'Timer not started yet!';
    } else {
      var timerStart = this.timerStartTime;
      var x = setInterval(function() {
        var now = new Date().getTime();
        var elapsedTime = now - timerStart;

        var minutes = Math.floor(elapsedTime % (1000 * 60 * 60) / (1000 * 60));
        var seconds = Math.floor(elapsedTime % (1000 * 60) / 1000);
        message.textContent = minutes + ':' + seconds;

        if (elapsedTime > 25 * 60 * 1000) {
          clearInterval(x);
          message.textContent = "Time's up!";
        }

      }, 1000);
    }
    message.classList.add('message');
    this.element.appendChild(message);
    return this.element;
  }

};
