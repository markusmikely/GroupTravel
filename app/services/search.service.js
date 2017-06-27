SearchService.$inject = ['$http'];
function SearchService($http) {
  return {
    Search: function(attraction) {
      // get search results and produce request variables to re-rank each attraction
      var url = 'http://localhost/grouptravel/app/backend/web/v1/api/search';

      return $http.get(url);
    }
  };
};
