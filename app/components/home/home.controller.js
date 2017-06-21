HomeController.$inject = ['$cookies', '$scope', '$http', '$state', '$rootScope', 'filterFilter', 'CartService', 'MapService', 'AttractionService'];
function HomeController($cookies, $scope, $http, $state, $rootScope, filterFilter, CartService, MapService, AttractionService) {

  $scope.placeholder = "foo";
  $scope.monthSelectorOptions = {
              start: "year",
              depth: "year"
            };
            $scope.getType = function(x) {
              return typeof x;
            };
            $scope.isDate = function(x) {
              return x instanceof Date;
            };

            $scope.customersDataSource = {
            transport: {
              serverFiltering: true,
              read: {
                dataType: "json",
                url: "/drupal/drupal-8.3.2/web/json/search-autocomplete"
              }
            },
            group: { field: "type" } //group the data by 'Country' field

          };

  var vm = this;

  vm.updateProgress = function() {
    $rootScope.duration = vm.duration;
    CartService.SumDays();
    console.log($rootScope.tripProgress);
  }
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
  // FUNCTIONS
  vm.init = init;
  vm.getTopPicks = getTopPicks;
  vm.getMapAttractions = getMapAttractions;
  vm.loadMap = loadMap;
  vm.addAttraction = addAttraction;
  vm.search = search;

  // Init
  (function initController() {
    vm.init();
    $( "#datepicker" ).datepicker();
  })();
  // INIT CONTROLLER
  function init() {
    vm.getTopPicks();
    vm.getMapAttractions();
  };
  function search() {
  }
  // LOAD MAP
  function loadMap() {
    MapService.LoadHomeMap(vm.dynMarkers, vm.markerClusterer);
  };
  // GET TOP PICKS
  function getTopPicks() {
    AttractionService.GetTopPicks().then(function(response) {
      vm.loading= false;
      if(response.status = 200) {
        vm.homepage.attractions = response.data;
        for(var i = 0; i < vm.homepage.attractions.length; i++) {
          vm.homepage.attractions[i] = AttractionService.Process(vm.homepage.attractions[i]);
        }
      }
    });
  };
  // GET MAP DATA
  function getMapAttractions() {
    AttractionService.GetMapAttractions().then(function(response) {
      vm.loading= false;
      if(response.status = 200) {
        vm.map = []; //response.data;
        for(var i = 0; i < response.data.length; i++) {
          var attraction = AttractionService.ProcessCoord(response.data[i]);
          vm.map.push(attraction);
        }
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
