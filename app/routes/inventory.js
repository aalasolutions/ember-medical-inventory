import Route from '@ember/routing/route';

export default class InventoryRoute extends Route {
  model(params) {
    return this.store.findRecord('medicine', params.id);
  };
}
