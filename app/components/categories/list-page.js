import Component            from '@ember/component';
import {set, get, computed} from '@ember/object';
import {inject as service}  from '@ember/service';
import {later}              from '@ember/runloop';

export default Component.extend({
  store     : service(),
  message   : service(),
  messageBox: service('message-box'),

  addNewCat: false,


  categories: computed.sort('cats', 'catSortProps'),
  init() {
    this._super(...arguments);
    set(this, 'cats', this.store.peekAll('category'));
    // set(this, 'categories', this.store.peekAll('category'));
    set(this, 'catSortProps', ['title:asc']);

  },
  didUpdateAttrs() {
    later(this, () => {
      this.$('.new_category_input input').focus();
    }, 500);

  },
  actions   : {
    addNewCategory() {
      let newCat = this.store.createRecord('category');
      set(newCat, 'title', get(this, 'newItem'));
      set(this, 'newItem', '');
      newCat.save().then(() => {
        this.toggleProperty('addNewCat');
        window.plugins.toast.show('Category Created', 1500, 'bottom');
      });
    },
    cancelAdd() {
      this.toggleProperty('addNewCat');
      set(this, 'newItem', '');
    },

    toggleAddNewForm() {
      this.toggleProperty('addNewCat');
    },

    editCategory(category) {
      set(this, 'editId', category.id);
      set(this, 'editItem', category);

      later(this, () => {
        this.$('.edit_category_input input').focus();
      }, 500);

    },
    editCategoryComplete(category) {
      category.save();
      set(this, 'editId', 0);
      window.plugins.toast.show('Category Updated', 1500, 'bottom');

    },
    editCategorySave(category) {
      category.save();
      set(this, 'editId', null);
      set(this, 'editItem', null);
    },
    editCategoryCancel(category) {
      category.rollbackAttributes();
      set(this, 'editId', null);
      set(this, 'editItem', null);
    },

    deleteCategory(category) {

      this.get('messageBox').confirm("Are you sure you want to delete this category", "Warning", {
        confirmButtonText: 'OK',
        cancelButtonText : 'Cancel',
        type             : 'warning',
        closeOnClickModal: true,
      }).then((action) => {
        if ('confirm' === action) {
          category.destroyRecord();
          window.plugins.toast.show('Category Deleted', 1500, 'bottom');
        }
      });
    },
  }
});
