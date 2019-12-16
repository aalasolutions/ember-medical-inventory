import { action } from '@ember/object';
import Controller from '@ember/controller';

export default class InventoryController extends Controller {
  @action
  changeRoute(route) {
    this.transitionToRoute(route);
  }

  @action
  toggleAddNewForm() {
    this.toggleProperty('addNewInvent');
  }
}
