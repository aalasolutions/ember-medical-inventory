import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { set, get, action, computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import { later } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';


export default class ListPage extends Component {
  @tracked catSortProps;
  @tracked medSortProps;

  @service toast;
  @service store;
  @service message;
  @service('message-box') messageBox;

  addNewMed = false;

  @sort('cats', 'catSortProps') categories;
  @sort('meds', 'medSortProps') medicines;

  constructor() {
    super(...arguments);
    this.meds = this.store.peekAll('medicine');
    this.cats = this.store.peekAll('category');
    this.catSortProps = ['title:asc'];
    this.medSortProps = ['name:asc'];
  }

  @action addNewMedicine() {
    let medicine = this.store.createRecord('medicine');
    set(medicine, 'name', this.newItem);
    if (this.newCatId) {
      set(medicine, 'category', this.store.peekRecord('category', this.newCatId));
    }
    this.newItem = null;
    this.newCatId = null;

    medicine.save().then(() => {
      this.parentCancle();
      this.toast.show('Medicine Created');

    });
  }

  @action cancelAdd() {
    this.parentCancle();
    this.newItem = null;

  }

  @action toggleAddNewForm() {
    this.parentCancle();
  }

  @action editMedicine(medicine) {
    set(this, 'editId', get(medicine, 'id'));
    set(this, 'editItem', medicine);
    set(this, 'newCatId', get(medicine, 'category.id'));
  }

  @action setInputFocus(e){
    later(this, () => {
        e.querySelector(' input').focus();
      }, 150);
  }

  @action editMedicineSave(medicine) {
    if (get(this, 'newCatId')) {
      set(medicine, 'category', this.store.peekRecord('category', get(this, 'newCatId')));
    }
    medicine.save();

    set(this, 'editId', null);
    set(this, 'editItem', null);
    set(this, 'newCatId', null);

    this.toast.show('Medicine Updated');

  }

  @action editMedicineCancel(medicine) {
    medicine.rollbackAttributes();
    set(this, 'editId', null);
    set(this, 'editItem', null);
  }

  @action deleteMedicine(medicine) {

    this.messageBox.confirm("Are you sure you want to delete this medicine. All of its inventory will be removed as well", "Warning", {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
      closeOnClickModal: true,
    }).then((action) => {
      if ('confirm' === action) {

        let invent = get(medicine, 'inventory');
        invent.forEach((i) => i.destroyRecord());
        medicine.destroyRecord();

        this.toast.show('Medicine Deleted');

      }
      console.log(action);
    });
  }

  parentCancle() {
    if (this.args.onCancel) {
      this.args.onCancel();
    }
  }

}
