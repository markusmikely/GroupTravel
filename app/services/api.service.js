ApiService.$inject = ['$http'];
function ApiService($http) {
    
    return {
        get: function(url) {
            return $http.get(url);
        },
        put: function(url, data) {
            return $http.put(url, data);
        }
    };       
};
