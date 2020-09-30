module.exports = {
  'API_URL': "http://localhost:8080",
  //'API_URL': 'http://192.168.43.43:8080',
  'API_ROUTES': {
    'login': '/api/auth/login',
    'register': '/api/auth/register',
    'getTable': '/api/get/table',
    'updateTable': '/api/set/table',
    'deleteTableRows': '/api/delete/table',
    'insertTableRow': '/api/insert/table',
    'createSchool': '/api/insert/school',
    'getSchools': '/api/get/schools',
    'deleteSchools': '/api/delete/schools',
    'getTotalResults': '/api/get/results',
    'importTable': '/api/upload/table',
    'downloadTable': '/api/download/table'
  },
  getRoute(route) {
    return this.API_URL + this.API_ROUTES[route]
  }
};