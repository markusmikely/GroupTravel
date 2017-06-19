HomeController.$inject = ['$cookies', '$scope', '$http', '$state', '$rootScope', 'filterFilter', 'CartService'];
function HomeController($cookies, $scope, $http, $state, $rootScope, filterFilter, CartService) {

  var vm = this;

  // ATTRIBUTES
  vm.loading = true;
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
  };
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
  }];
  // FUNCTIONS
  vm.init = init;

  vm.getTopPicks = getTopPicks;
  vm.getMapAttractions = getMapAttractions;

  vm.getTimeEl = getTimeEl;
  vm.processAttraction = processAttraction;

  vm.getTerms = getTerms;
  vm.addAttraction = addAttraction;

  vm.init();

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
  // INIT CONTROLLER
  function init() {
    vm.getTopPicks();
    vm.getMapAttractions();
  };
  // PROCESS ATTRACTION FROM JSON O BE DISPLAYED
  function processAttraction(attraction) {
    var pAttraction = {
      'id': attraction.nid,
      'title': attraction.title,
      'address': {
        'address1': attraction.field_address_address_line1,
        'address2': attraction.field_address_address_line2,
        'county': attraction.field_address_locality,
        'country': attraction.field_address_country_code,
        'postcode': '',
      },
      'body': attraction.body,
      'experiences': attraction.field_experiences.split(","),
      'images': attraction.field_feature.split(","),
      'time_required': {
        'days' : vm.getTimeEl('days'),
        'hours' : vm.getTimeEl('hours'),
        'minutes' : vm.getTimeEl('minutes'),
      },
      'rank': attraction.field_rank
    };
    return pAttraction;
  }
  // GET TIME ELEMENT
  function getTimeEl(time, gran) {
    var timeArray = time.split(",");
    for (var i = 0; i < timeArray.length; i++) {
      if(timeArray[i].indexOf(gran) != -1) {
        time = timeArray[i].replace(" "+gran, "");
        return time;
      }
    }
    return "";
  };
  //  GET SEARCH TERMS
  function getTerms(search) {
    var filtered = filterFilter(angular.copy(users), search);
    var results = _(filtered)
      .groupBy('group')
      .map(function(g) {
        g[0].firstInGroup = true; // the first item in each group
        return g;
      })
      .flatten()
      .value();
    return results;
  };
  // GET TOP PICKS
  function getTopPicks() {
    var url = $rootScope.api+'json/top-picks';
    $http.get(url).then(function(response) {
      vm.loading= false;
      if(response.status = 200) {
        vm.homepage.attractions = response.data;
        for(var i = 0; i < vm.homepage.attractions.length; i++) {
          vm.homepage.attractions[i] = vm.processAttraction(vm.homepage.attractions[i]);
        }
      }
    });
  };
  // GET MAP DATA
  function getMapAttractions() {
    var url = $rootScope.api+'json/all-attractions-location';
    $http.get(url).then(function(response) {
      vm.loading= false;
      if(response.status = 200) {
        vm.map = []; //response.data;
        for(var i = 0; i < response.data.length; i++) {
          var attraction = {
            'ID': response.data[i].nid,
            'title': response.data[i].title,
            'location': {
              'city': response.data[i].field_address_locality,
              'postcode': response.data[i].field_address_postal_code,
            },
            'coordinates': {
              'lng': JSON.parse(response.data[i].field_location).coordinates[0],
              'lat': JSON.parse(response.data[i].field_location).coordinates[1],
            }
          }
          vm.map.push(attraction);
        }
      }
    });
  };
  // CART FUNCTIONS
  function addAttraction(attraction) {
    CartService.AddAttraction(attraction);
  };
  function removeAttraction($index) {
    CartService.RemoveAttraction($index);
  };
}
