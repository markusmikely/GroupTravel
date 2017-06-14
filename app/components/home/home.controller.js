HomeController.$inject = ['$cookies', '$scope', '$http', '$state', '$rootScope', 'filterFilter', 'CartService'];
function HomeController($cookies, $scope, $http, $state, $rootScope, filterFilter, CartService) {

  var vm = this;

  vm.loading = true;
  // Form Variables
  vm.homepage = {
    'search': {
      'where': {
        'value' : '',
        'placeholder' : 'Anywhere'
      },
      'when': {
        'value' : '',
        'placeholder' : 'Anytime'
      },
      'duration': 0,
    },
    'data': {
      'attractions': [],
      'selections': []
    }
  }

  $scope.selectedUser = '';

  var users = [{
    name: 'The London Eye',
    group: "Attraction"
  }, {
    name: 'Westminster Palace',
    group: "Attraction"
  }, {
    name: 'Buckingham Palace',
    group: "Attraction"
  }, {
    name: 'London',
    group: "Location"
  }, {
    name: 'Manchester',
    group: "Location"
  },
  {
    name: 'Oxford',
    group: "Location"
  },];

  vm.getTerms = function(search) {
    // console.log('foo');
    var filtered = filterFilter(angular.copy(users), search);

    var results = _(filtered)
      .groupBy('group')
      .map(function(g) {
        g[0].firstInGroup = true; // the first item in each group
        return g;
      })
      .flatten()
      .value();

    // console.log(results);

    return results;
  }

$(function() {
      $( "#datepicker" ).datepicker();
      url = "assets/data/homepage.json";
      $http.get(url).then(function(response) {

        if(response.status = 200) {
          console.log(response.data);
        } else {
          // something went wrong
        }

        // vm.hompage = response.data.message.content;

      }, function(err) {
        Notification.warning(err);
      });
});

$cookies.put('foo', 'foobar');
console.log($cookies.get( 'foo'));


vm.init = init;

function init() {
  var url = $rootScope.api+'json/top-picks';

  $http.get(url).then(function(response) {
        vm.loading= false;
        if(response.status = 200) {
          console.log(response.data);
          vm.homepage.attractions = response.data;
          for(var i = 0; i < vm.homepage.attractions.length; i++) {
            vm.homepage.attractions[i].thumbnails = vm.homepage.attractions[i].field_feature.split(",");
          }
        }
  });

}
vm.init();

vm.addAttraction = addAttraction;

function addAttraction(attraction) {
  CartService.AddAttraction(attraction);
}
function removeAttraction($index) {
  CartService.RemoveAttraction($index);
}
  // // var vm = this;
  //
  // // Init
  (function initController() {
    vm.init();
  //   //TO DO Init ajax call for data
  //   //     $http.get(url).then(function(response) {
  //   //       vm.homepage = response.data.message;
  //   //       // console.log('Home');
  //   //       console.log(response.data.message.featured);
  //   //       console.log(url);
  //   //       vm.dataLoading = true;
  //   //     });
  });
}
