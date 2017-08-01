'use babel';

import RemindMeModel from './remind-me-model';
import { CompositeDisposable } from 'atom';

export default {

  footerPanel: null,
  subscriptions: null,

  activate(state) {
    console.log('activate called!');
    // Code in progress:
    // see here: https://discuss.atom.io/t/how-to-work-addviewprovider-with-addbottompanel/20126
    this.remindMeModel = new RemindMeModel();
    // this.viewProviderSubscription = atom.views.addViewProvider(RemindMeModel, this.viewFactory);
    // TODO why doesn't the view provider update the HTML element?
    // this.footerPanel = atom.workspace.addFooterPanel({
    //   item: this.remindMeModel,
    //   visible: false
    // });
    this.footerPanel = atom.workspace.addFooterPanel({
      item: this.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'remind-me:toggle': () => this.toggle(),
      'remind-me:start-timer': () => this.startTimer(this)
    }));
  },

  deactivate() {
    this.footerPanel.destroy();
    this.viewProviderSubscription.dispose();
    this.subscriptions.dispose();
    this.remindMeModel.destroy();
  },

  serialize() {
    return {
      remindMeModelState: this.remindMeModel.serialize()
    }
  },

  toggle() {
    console.log('RemindMe was toggled!');
    return (
      this.footerPanel.isVisible() ?
      this.footerPanel.hide() :
      this.footerPanel.show()
    );
  },

  startTimer(_this) {
    _this.remindMeModel.startTimer();
    atom.notifications.addInfo("Timer started!");
    console.log(_this.remindMeModel.timerStartTime);
    if (_this.footerPanel != null) {
      _this.footerPanel.destroy();
    }
    _this.footerPanel = atom.workspace.addFooterPanel({
      item: _this.getElement(),
      visible: true
    });
  },

  startBreakTimer(_this) {
    _this.remindMeModel.startTimer();
    atom.notifications.addInfo("Timer started!");
    console.log(_this.remindMeModel.timerStartTime);
    if (_this.footerPanel != null) {
      _this.footerPanel.destroy();
    }
    _this.footerPanel = atom.workspace.addFooterPanel({
      item: _this.getBreakElement(),
      visible: true
    });
  },

  viewFactory(_this, timerDuration, callback) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('remind-me');

    // Create message element
    const message = document.createElement('div');

    // TODO read this from config/when the timer is started
    var timerStart = _this.remindMeModel.timerStartTime;
    if (timerStart == null) {
      message.textContent = 'Timer not started yet!';
    } else {
      var x = setInterval(function() {
        var now = new Date().getTime();
        var elapsedTime = now - timerStart;

        var minutes = Math.floor(elapsedTime % (1000 * 60 * 60) / (1000 * 60));
        var seconds = Math.floor(elapsedTime % (1000 * 60) / 1000);
        var minutesStr = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
        var secondsStr = seconds < 10 ? '0' + seconds.toString() : seconds.toString();
        message.textContent = minutesStr + ':' + secondsStr;

        if (elapsedTime > timerDuration) {
          clearInterval(x);
          message.textContent = "Time's up!";
          atom.notifications.addSuccess("Time's up!");
          return callback(_this);
        }
      }, 1000);
    }
    message.classList.add('message');
    this.element.appendChild(message);
    return this.element;
  },

  getElement() {
    return this.viewFactory(this, 25 * 60 * 1000, this.startBreakTimer);
  },

  getBreakElement() {
    return this.viewFactory(this, 5 * 60 * 1000, this.startTimer);
  }

};
