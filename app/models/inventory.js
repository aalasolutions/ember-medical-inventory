import DS from 'ember-data';
const { Model, attr, belongsTo } = DS;

export default class InventoryModel extends Model{
  @belongsTo('medicine') medicine;
  @attr('number') quantity;
  @attr('string') notes;
  @attr('date') expiry;
  @attr('date') created;
}
