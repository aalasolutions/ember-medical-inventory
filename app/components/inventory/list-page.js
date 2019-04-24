import Component                         from '@ember/component';
import EmberObject, {set, get, computed} from '@ember/object';
import {inject as service}               from '@ember/service';
import {later}                           from '@ember/runloop';
import moment                            from 'moment';

export default Component.extend({
  store     : service(),
  message   : service(),
  messageBox: service('message-box'),

  inventory       : computed.sort('invent', 'inventSortProps'),
  newInventoryItem: null,
  init() {
    this._super(...arguments);
    let medicine = this.store.peekRecord('medicine', get(this, 'model.id'));

    set(this, 'invent', get(medicine, 'inventory'));
    set(this, 'inventSortProps', ['expiry:asc']);
    set(this, 'medicineModel', this.store.peekRecord('medicine', get(this, 'model.id')));
    this.makeNewObj();
  },

  didUpdateAttrs(){
    if(get(this,'addNewInvent')){
      set(this, 'editItem', null);
      set(this, 'editId', null);
      this.makeNewObj();
    }

  },
  makeNewObj() {
    let newItem = EmberObject.create({
      medicine: get(this, 'medicineModel'),
      quantity: null,
      notes   : "",
      expiry  : moment(new Date()).add(2, 'months').format("YYYY-MM-DD"),
      created : new Date(),
    });

    set(this, 'newInventoryItem', newItem);
  },
  actions: {

    addNewInventory() {
      let newInventory = this.store.createRecord('inventory');

      let inventoryData = get(this, 'newInventoryItem');
      newInventory.set('medicine', inventoryData.get('medicine'));
      newInventory.set('quantity', inventoryData.get('quantity'));
      newInventory.set('notes', inventoryData.get('notes'));
      newInventory.set('expiry', moment(inventoryData.get('expiry')).toDate());
      newInventory.set('created', inventoryData.get('created'));
      newInventory.save().then(() => {
        this.toggleProperty('addNewInvent');
        this.makeNewObj();
        window.plugins.toast.show('Inventory Created', 1500, 'bottom');
      });
    },
    cancelAdd() {
      this.toggleProperty('addNewInvent');
      this.makeNewObj();
    },
    toggleAddNewForm() {
      this.toggleProperty('addNewInvent');
    },

    editInventory(inventory) {
      this.makeNewObj();
      let inventoryData = get(this, 'newInventoryItem');

      set(inventoryData, 'quantity', get(inventory,'quantity'));
      set(inventoryData, 'notes', get(inventory,'notes'));
      set(inventoryData, 'expiry', moment(get(inventory,'expiry')).format("YYYY-MM-DD"));

      set(this, 'editItem', inventoryData);
      set(this, 'editId', get(inventory, 'id'));
      set(this, 'addNewInvent', false);
      later(this, () => {
        this.$('.edit_category_input input').focus();
      }, 500);
    },


    editInventorySave() {

      let newInventory = this.store.peekRecord('inventory', get(this, 'editId'));

      let inventoryData = get(this, 'editItem');
      newInventory.set('quantity', inventoryData.get('quantity'));
      newInventory.set('notes', inventoryData.get('notes'));
      newInventory.set('expiry', moment(inventoryData.get('expiry')).toDate());
      newInventory.save().then(() => {
        set(this, 'editId', null);
        set(this, 'editItem', null);
        window.plugins.toast.show('Inventory Updated', 1500, 'bottom');

        this.makeNewObj();
      });

    },
    editInventoryCancel() {
      this.makeNewObj();

      set(this, 'editId', null);
      set(this, 'editItem', null);
    },


    deleteInventory(inventory) {
      this.get('messageBox').confirm("Are you sure you want to delete this inventory", "Warning", {
        confirmButtonText: 'OK',
        cancelButtonText : 'Cancel',
        type             : 'warning',
        closeOnClickModal: true,
      }).then((action) => {
        if ('confirm' === action) {
          inventory.destroyRecord();
          window.plugins.toast.show('Inventory Deleted', 1500, 'bottom');
        }
      });
    },
  }
});
