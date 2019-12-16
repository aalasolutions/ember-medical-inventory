import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import RSVP  from 'rsvp';

export default class ApplicationRoute extends Route {
  @service('ember-cordova/splash')
  splashScreenService;

  model() {
    return RSVP.hash({
      category : this.store.findAll('category'),
      medicine : this.store.findAll('medicine'),
      inventory: this.store.findAll('inventory'),
    });
  }

  afterModel() {
    this.get('splashScreenService').hide();
  }
  //
  // activate(){
  //   cordova.plugins.notification.local.schedule({
  //     title: 'Design team meeting',
  //     trigger: { in: 1, unit: 'minute' }
  //   });
  //   console.log("something working 234");
  // }
}
