import DS from 'ember-data';

export default DS.Model.extend({
  name     : DS.attr('string'),
  category : DS.belongsTo('category'),
  inventory: DS.hasMany('inventory'),
});
