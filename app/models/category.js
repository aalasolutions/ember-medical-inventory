import DS from 'ember-data';
const { Model, attr, hasMany } = DS;

export default class CategoryModel extends Model {
  @attr('string') title;
  @hasMany('medicine') medicine;
}
