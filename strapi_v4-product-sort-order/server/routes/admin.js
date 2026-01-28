'use strict';

module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/products',
      handler: 'admin.listProducts',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
    {
      method: 'POST',
      path: '/products/reorder',
      handler: 'admin.reorderProducts',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
      },
    },
  ],
};
