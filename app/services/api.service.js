ApiService.$inject = ['$http'];
function ApiService($http) {

    return {
        Connect: function() {
          return 'YijdLPLAI46wQxwCgAyd5bGwfV9Aq9C2mz8t8aX3mNA';
        },
        Get: function(url) {
          return $http.get(url);
        },
        Post: function(url, data) {
          this.CONNECT();
          return $http({
            url: url,
            method : 'POST',
            data: package,
            headers : {
              'X-CSRF-TOKEN': 'YijdLPLAI46wQxwCgAyd5bGwfV9Aq9C2mz8t8aX3mNA',
              'Content-Type': 'application/hal+json',
              'Accept': 'application/hal+json',
              'Authorization': 'Basic YWRtaW46bW5ram9pMDk='
            },
          });
        },
        Patch: function(package, id) {

          var url = 'http://localhost/grouptravel/app/backend/web/node/'+id+'?format=hal_json';

          return $http.get('http://localhost/grouptravel/app/backend/web/rest/session/token').then(function(response) {
            if(response.status == 200) {
              var csrf = response.data;

              return $http({
                url: url,
                method : 'PATCH',
                data: package,
                headers : {
                  'X-CSRF-TOKEN': csrf, //'YijdLPLAI46wQxwCgAyd5bGwfV9Aq9C2mz8t8aX3mNA'
                  'Content-Type': 'application/hal+json',
                  'Accept': 'application/hal+json',
                  'Authorization': 'Basic YWRtaW46bW5ram9pMDk='
                },
              });
            }
          });
        }
    };
};
