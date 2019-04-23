import Component            from '@ember/component';
import {set, get, computed} from '@ember/object';
import {inject as service}  from '@ember/service';
import {next}               from '@ember/runloop';

export default Component.extend({
  store     : service(),
  message   : service(),
  messageBox: service('message-box'),

  addNewMed: false,

  categories: computed.sort('cats', 'catSortProps'),
  medicines : computed.sort('meds', 'medSortProps'),

  init() {
    this._super(...arguments);
    set(this, 'meds', this.store.peekAll('medicine'));
    set(this, 'cats', this.store.peekAll('category'));

    set(this, 'catSortProps', ['title:asc']);
    set(this, 'medSortProps', ['name:asc']);
  },
  didUpdateAttrs(){
    next(this, ()=>{
      this.$('.new_medicine_input input').focus();
    });

  },
  actions: {
    addNewMedicine() {

      let newCat = this.store.createRecord('medicine');
      set(newCat, 'name', get(this, 'newItem'));
      set(newCat, 'category', this.store.peekRecord('category', get(this, 'newCatId')));
      set(this, 'newItem', '');
      set(this, 'newCatId', null);

      newCat.save().then(() => {
        this.toggleProperty('addNewMed');

        // this.get('message').success("Medicine created");
        window.plugins.toast.show('Medicine Created', 1500, 'bottom');

      });
    },
    cancelAdd() {
      this.toggleProperty('addNewMed');
      set(this, 'newItem', '');

    },
    toggleAddNewForm() {
      this.toggleProperty('addNewMed');
    },

    editMedicine(medicine) {
      set(this, 'editId', medicine.id);
      set(this, 'editItem', medicine);
      next(this, ()=>{
        this.$('.edit_medicine_input input').focus();
      });

    },
    editMedicineComplete(medicine) {
      medicine.save();
      set(this, 'editId', 0);
      // this.get('message').success("Medicine Updated");
      window.plugins.toast.show('Medicine Updated', 1500, 'bottom');

    },

    editMedicineSave(medicine) {

      set(medicine, 'category', this.store.peekRecord('category', get(this, 'newCatId')));

      medicine.save();
      set(this, 'editId', null);
      set(this, 'editItem', null);
      set(this, 'newCatId', null);


      window.plugins.toast.show('Medicine Updated', 1500, 'bottom');


    },
    editMedicineCancel(medicine) {
      medicine.rollbackAttributes();
      set(this, 'editId', null);
      set(this, 'editItem', null);
    },
    deleteMedicine(medicine) {

      this.get('messageBox').confirm("Are you sure you want to delete this medicine", "Warning", {
        confirmButtonText: 'OK',
        cancelButtonText : 'Cancel',
        type             : 'warning',
        closeOnClickModal: true,
      }).then((action) => {
        if ('confirm' === action) {
          medicine.destroyRecord();
          window.plugins.toast.show('Medicine Deleted', 1500, 'bottom');

        }
      });
    },
  }
});
