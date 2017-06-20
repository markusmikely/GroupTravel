HomeController.$inject = ['$cookies', '$scope', '$http', '$state', '$rootScope', 'filterFilter', 'CartService', 'NgMap'];
function HomeController($cookies, $scope, $http, $state, $rootScope, filterFilter, CartService, NgMap) {

  var vm = this;

  // FUNCTIONS
  vm.init = init;

  vm.getTopPicks = getTopPicks;
  vm.getMapAttractions = getMapAttractions;
  vm.loadMap = loadMap;

  vm.getTimeEl = getTimeEl;
  vm.processAttraction = processAttraction;

  vm.getTerms = getTerms;
  vm.addAttraction = addAttraction;

  vm.search = search;



    // Init
    (function initController() {
      vm.init();
      $( "#datepicker" ).datepicker();
    

    })();

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


  $(function() {
  });
  // INIT CONTROLLER
  function init() {
    vm.getTopPicks();
    vm.getMapAttractions();
  };

  function search() {
    // vm.request = {
    //   'where_to':
    //   'type':
    // };

  }
  // LOAD MAP
  function loadMap() {
    vm.dynMarkers = []
    NgMap.getMap().then(function(map) {
      var bounds = new google.maps.LatLngBounds();
      for (var k in map.customMarkers) {
        var cm = map.customMarkers[k];
        vm.dynMarkers.push(cm);
        bounds.extend(cm.getPosition());
      };

      vm.markerClusterer = new MarkerClusterer(map, vm.dynMarkers, {
        styles: [{
            url: 'assets/images/m1.png',
            height: 53,
            width: 53,
            anchor: [26, 26],
            textColor: '#000',
            textSize: 11
        }, {
            url: 'assets/images/m2.png',
            height: 56,
            width: 56,
            anchor: [28, 28],
            textColor: '#000',
            textSize: 11
        }, {
            url: 'assets/images/m3.png',
            height: 66,
            width: 66,
            anchor: [33, 33],
            textColor: '#000',
            textSize: 11
        }, {
            url: 'assets/images/m4.png',
            height: 78,
            width: 78,
            anchor: [39, 39],
            textColor: '#000',
            textSize: 11
        }, {
            url: 'assets/images/m5.png',
            height: 90,
            width: 90,
            anchor: [45, 45],
            textColor: '#000',
            textSize: 11
        }]
      });
      map.setCenter(bounds.getCenter());
      map.fitBounds(bounds);
   });
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
        console.log(vm.map);
        vm.loadMap();
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
