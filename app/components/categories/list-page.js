import {inject as service} from '@ember/service';
import Component from '@glimmer/component';
import {set, get, action, computed} from '@ember/object';
import {sort} from '@ember/object/computed';
import {later} from '@ember/runloop';
import { next } from '@ember/runloop';

export default class ListPage extends Component {
  @service store;
  @service message;
  @service('message-box') messageBox;
  @service toast;

  addNewCat = false;

  @sort('cats', 'catSortProps') categories;
  constructor() {
    super(...arguments);
    set(this, 'cats', this.store.peekAll('category'));
    // set(this, 'categories', this.store.peekAll('category'));
    set(this, 'catSortProps', ['title:asc']);

  }

  @action
  addNewCategory() {
    let newCat = this.store.createRecord('category');
    set(newCat, 'title', this.newItem);
    set(this, 'newItem', '');
    newCat.save().then(() => {
      this.parentCancle();
      this.toast.show('Category Created');
    });
  }

  @action setInputFocus(e){
    later(this, () => {
        e.querySelector(' input').focus();
      }, 150);
  }

  @action
  cancelAdd() {
    this.parentCancle();
    set(this, 'newItem', '');
  }

  @action
  toggleAddNewForm() {
    this.parentCancle();
  }

  @action
  editCategory(category) {
    set(this, 'editId', category.id);
    set(this, 'editItem', category);
  }

  @action
  editCategorySave(category) {
    category.save();
    set(this, 'editId', null);
    set(this, 'editItem', null);
    this.toast.show('Category Updated');
  }

  @action
  editCategoryCancel(category) {
    category.rollbackAttributes();
    set(this, 'editId', null);
    set(this, 'editItem', null);
  }

  @action
  deleteCategory(category) {
    if (!get(category, 'medicine.length')) {
      this.messageBox.confirm("Are you sure you want to delete this category", "Warning", {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
        closeOnClickModal: true,
      }).then((action) => {
        if ('confirm' === action) {
          category.destroyRecord();
          this.toast.show('Category Deleted');
        }
      }).catch();
    } else {
      this.get('messageBox').alert("Unable to delete this category. There are some medicines with this", "Error", {
        closeOnClickModal: true,
        type: 'warning',

      }).then().catch();
    }

  }


  parentCancle(){
    if(this.args.onCancel){
      this.args.onCancel();
    }
  }


}
