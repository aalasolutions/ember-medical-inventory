import DS from 'ember-data';

export default DS.Model.extend({
  medicine: DS.belongsTo('medicine'),
  quantity: DS.attr('number'),
  notes   : DS.attr('string'),
  expiry  : DS.attr('date'),
  created : DS.attr('date'),
});
