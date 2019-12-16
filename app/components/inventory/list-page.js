import {inject as service} from '@ember/service';
import Component from '@glimmer/component';
import EmberObject, {set, get, action, computed} from '@ember/object';
import {sort} from '@ember/object/computed';
import {later} from '@ember/runloop';
import moment from 'moment';

export default class ListPage extends Component {
  @service store;
  @service message;
  @service toast;
  @service('message-box') messageBox;

  @sort('invent', 'inventSortProps') inventory;

  newInventoryItem = null;

  constructor() {
    super(...arguments);
    let medicine = this.store.peekRecord('medicine', this.args.model.id);
    set(this, 'invent', get(medicine, 'inventory'));
    set(this, 'inventSortProps', ['expiry:asc']);
    set(this, 'medicineModel', medicine);
    this.makeNewObj();
  }

  // didUpdateAttrs() {
  //   set(this, 'medicineModel', this.store.peekRecord('medicine', this.args.model.id));
  //   this.makeNewObj();
  //   if (get(this, 'addNewInvent')) {
  //     set(this, 'editItem', null);
  //     set(this, 'editId', null);
  //     this.makeNewObj();
  //   }
  // }


  @action
  addNewInventory() {
    let newInventory = this.store.createRecord('inventory');

    let inventoryData = get(this, 'newInventoryItem');
    newInventory.set('medicine', inventoryData.get('medicine'));
    newInventory.set('quantity', inventoryData.get('quantity'));
    newInventory.set('notes', inventoryData.get('notes'));
    newInventory.set('expiry', moment(inventoryData.get('expiry')).toDate());
    newInventory.set('created', inventoryData.get('created'));
    newInventory.save().then(() => {
      this.parentCancle();
      this.makeNewObj();
      this.toast.show('Inventory Created');
    });
  }

  @action
  cancelAdd() {
    this.parentCancle();
    this.makeNewObj();
  }

  @action
  toggleAddNewForm() {
    this.parentCancle();
  }

  @action
  editInventory(inventory) {
    this.makeNewObj();
    let inventoryData = get(this, 'newInventoryItem');

    set(inventoryData, 'quantity', get(inventory, 'quantity'));
    set(inventoryData, 'notes', get(inventory, 'notes'));
    set(inventoryData, 'expiry', moment(get(inventory, 'expiry')).format("YYYY-MM-DD"));

    set(this, 'editItem', inventoryData);
    set(this, 'editId', get(inventory, 'id'));
    set(this, 'addNewInvent', false);
  }

  @action
  editInventorySave() {

    let newInventory = this.store.peekRecord('inventory', get(this, 'editId'));

    let inventoryData = get(this, 'editItem');
    newInventory.set('quantity', inventoryData.get('quantity'));
    newInventory.set('notes', inventoryData.get('notes'));
    newInventory.set('expiry', moment(inventoryData.get('expiry')).toDate());
    newInventory.save().then(() => {
      set(this, 'editId', null);
      set(this, 'editItem', null);
      this.toast.show('Inventory Updated');

      this.makeNewObj();
    });

  }

  @action
  editInventoryCancel() {
    this.makeNewObj();

    set(this, 'editId', null);
    set(this, 'editItem', null);
  }

  @action
  deleteInventory(inventory) {
    this.messageBox.confirm("Are you sure you want to delete this inventory", "Warning", {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
      closeOnClickModal: true,
    }).then((action) => {
      if ('confirm' === action) {
        inventory.destroyRecord();
        this.toast.show('Inventory Deleted');
      }
    });
  }

  @action setInputFocus(e){
    later(this, () => {
        e.querySelector(' input').focus();
      }, 150);
  }


  makeNewObj() {
    let newItem = EmberObject.create({
      medicine: get(this, 'medicineModel'),
      quantity: null,
      notes: "",
      expiry: moment(new Date()).add(2, 'months').format("YYYY-MM-DD"),
      created: new Date(),
    });

    set(this, 'newInventoryItem', newItem);
  }
  
  parentCancle(){
    if(this.args.onCancel){
      this.args.onCancel();
    }
  }

}
