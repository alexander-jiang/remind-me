'use babel';

import RemindMeView from './remind-me-view';
import { CompositeDisposable } from 'atom';

export default {

  remindMeView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.remindMeView = new RemindMeView(state.remindMeViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.remindMeView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'remind-me:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.remindMeView.destroy();
  },

  serialize() {
    return {
      remindMeViewState: this.remindMeView.serialize()
    };
  },

  toggle() {
    console.log('RemindMe was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
