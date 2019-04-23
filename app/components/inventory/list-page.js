import Component                         from '@ember/component';
import EmberObject, {set, get, computed} from '@ember/object';
import {inject as service}               from '@ember/service';
import {later}                           from '@ember/runloop';

export default Component.extend({
  store     : service(),
  message   : service(),
  messageBox: service('message-box'),

  inventory       : computed.sort('invent', 'inventSortProps'),
  newInventoryItem: null,
  init() {
    this._super(...arguments);
    set(this, 'invent', this.store.peekAll('inventory'));
    set(this, 'inventSortProps', ['expiry:asc']);
    set(this, 'medicineModel', this.store.peekRecord('medicine', this.get('model.id')));
    this.makeNewObj();
  },

  makeNewObj() {
    let newItem = EmberObject.create({
      medicine: get(this, 'medicineModel'),
      quantity: 0,
      notes   : "",
      expiry  : new Date(),
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
      newInventory.set('expiry', inventoryData.get('expiry'));
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
      let inventoryData = get(this, 'newInventoryItem');

      set(this, 'editId', inventory.id);
      set(this, 'editItem', inventory);

      later(this, () => {
        this.$('.edit_category_input input').focus();
      }, 500);

    },

    editInventoryComplete(inventory) {
      inventory.save();
      set(this, 'editId', 0);
      // this.get('message').success("Inventory Updated");
      window.plugins.toast.show('Inventory Updated', 1500, 'bottom');

    },

    editInventorySave(inventory) {

      set(inventory, 'category', this.store.peekRecord('category', get(this, 'newCatId')));

      inventory.save();
      set(this, 'editId', null);
      set(this, 'editItem', null);
      set(this, 'newCatId', null);


      window.plugins.toast.show('Inventory Updated', 1500, 'bottom');


    },
    editInventoryCancel(inventory) {
      inventory.rollbackAttributes();
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
