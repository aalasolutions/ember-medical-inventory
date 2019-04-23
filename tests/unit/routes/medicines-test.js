import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | medicines', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:medicines');
    assert.ok(route);
  });
});
