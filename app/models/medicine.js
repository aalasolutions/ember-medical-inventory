import DS from 'ember-data';
const { Model, attr, belongsTo, hasMany } = DS;

export default class MedicineModel extends Model {
  @attr('string') name;
  @belongsTo('category') category;
  @hasMany('inventory') inventory;
};
