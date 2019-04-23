import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('categories', { path: '/'});
  this.route('medicines');
  this.route('inventory', { path: 'inventory/:id' });
});

export default Router;
