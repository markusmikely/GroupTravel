HomeController.$inject = ['$filter', '$cookies', '$scope', '$http', '$state', '$rootScope', 'filterFilter', 'CartService', 'MapService', 'AttractionService', 'RankingService', 'CookieService'];
function HomeController($filter, $cookies, $scope, $http, $state, $rootScope, filterFilter, CartService, MapService, AttractionService, RankingService, CookieService) {

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
  $scope.autoComplete = {
    transport: {
      serverFiltering: true,
      read: {
        dataType: "json",
        url: "/grouptravel/app/backend/web/v1/api/search-autocomplete"
      }
    },
    group: { field: "field_type" } //group the data by 'Country' field
  };

  var vm = this;


  vm.updateProgress = function() {
    $rootScope.duration = vm.duration;
    CartService.SumDays();
  }

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
  })();
  // INIT CONTROLLER
  function init() {
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

    vm.getTopPicks();
    vm.getMapAttractions();
    $(function() {
      function checkOffset() {
          if ($('#map-view > div').offset().top + $('#map-view > div').height() >= $('footer').offset().top ) $('#map-view > div').css({'position':'absolute',     'bottom': 0,
          'width': '100%'});
          if ($(document).scrollTop() + window.innerHeight < $('footer').offset().top) $('#map-view > div').css({'position': 'fixed', 'width': '34%'}); // restore when you scroll up
      }
      $(document).off("scroll", checkOffset);
    });
  };
  function search() {
    if(vm.homepage.search.where.value.length > 0) {
      $rootScope.request = {
        'where' :vm.homepage.search.where,
        'when': vm.homepage.search.when,
        'duration': $rootScope.duration
      }
      if(vm.homepage.search.where.value[0].field_type == 'Attraction') {
        // Navigate to attraction page
        $state.transitionTo('attraction', {id:vm.homepage.search.where.value[0].nid});
      } else if(vm.homepage.search.where.value[0].field_type == 'Location') {
        // Perform an attraction search
        $state.transitionTo('search', {id:vm.homepage.search.where.value[0].nid});
      }
    } else {
      $state.transitionTo('search', {term:vm.homepage.search.where.value});
    }
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
          vm.homepage.attractions[i] = AttractionService.ProcessEntity(vm.homepage.attractions[i]);

          var previousExperiences = CookieService.GetPreviousExperiences();

          var request = {
            'experiences' : [],
            'previous_experiences' : previousExperiences
          };

          var rank = RankingService.Init(request, vm.homepage.attractions[i]);

          vm.homepage.attractions[i].rank.previous = rank.previous;
          vm.homepage.attractions[i].rank.current = rank.current;

          vm.homepage.attractions[i].rank.rank += vm.homepage.attractions[i].rank.previous;

        }
        vm.homepage.attractions.sort(function(a, b) { return a.rank.rank - b.rank.rank; }).reverse();
        $filter('orderBy')(vm.homepage.attractions, 'rank.rank');
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
