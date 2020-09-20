module.exports = {
  'API_URL': 'http://localhost:8080',
  'API_ROUTES': {
    'login': '/api/auth/login',
    'register': '/api/auth/register',
    'getTable': '/api/get/table',
    'updateTable': '/api/set/table',
    'deleteTableRows': '/api/delete/table',
    'insertTableRow': '/api/insert/table'
  },
  getRoute(route) {
    return this.API_URL + this.API_ROUTES[route]
  }
};