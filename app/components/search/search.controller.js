SearchController.$inject = ['$http', '$state', '$rootScope', 'PagerService', 'MapService', 'AttractionService', '$scope', 'NgMap', '$compile', 'SearchService', 'ApiService', 'RankingService'];
function SearchController($http, $state, $rootScope, PagerService, MapService, AttractionService, $scope, NgMap, $compile, SearchService, ApiService, RankingService) {

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
  window.vm = this;
  // ATTRIBUTES
  vm.loading = false;
  vm.results = []; // dummy array of items to be paged
  vm.pager = {};
  vm.filter = {
    'location' : {
        'visible':false,
        'placeholder': 'Anywhere',
        'value': 'Anywhere'
    },
    'when': {
        'visible':false,
        'value': 'Anytime'
    },
    'tags': {
        'visible':false,
        'selected': []
    },
    'package' : {
        'visible':false
    }
  };
// FUNCTIONS
  vm.init = init;
  vm.setPage = setPage;
  vm.search = search;
  vm.loadExperiences = loadExperiences;
  vm.focusOnResult = focusOnResult;
  vm.cancelFocus = cancelFocus;
  vm.showDetail = showDetail;
  vm.hideDetail = hideDetail;
  vm.toggleFilter = toggleFilter;

  // Init
  (function initController() {
    vm.init();
  })();

  function toggleFilter(filter) {
    console.log(filter);
    switch (filter) {
      case 'location':
        vm.filter.location.visible = !vm.filter.location.visible ;
        vm.filter.when.visible = false;
        vm.filter.tags.visible = false;
        vm.filter.package.visible = false;
        break;
      case 'when':
        vm.filter.when.visible = !vm.filter.when.visible;
        vm.filter.location.visible = false;
        vm.filter.tags.visible = false;
        vm.filter.package.visible = false;
        break;
      case 'tags':
        vm.filter.tags.visible = !vm.filter.tags.visible;
        vm.filter.when.visible = false;
        vm.filter.location.visible = false;
        vm.filter.package.visible = false;
        break;
      case 'package':
        vm.filter.package.visible = !vm.filter.package.visible;
        vm.filter.when.visible = false;
        vm.filter.tags.visible = false;
        vm.filter.location.visible = false;
        break;
      default:
    }
  };
  function init() {
    vm.loadExperiences();
    vm.search();

    // TO BE CONVERTED TO ANGULAR JS
    $(function() {
      function checkOffset() {
          if ($('#map-view > div').offset().top + $('#map-view > div').height() >= $('footer').offset().top ) $('#map-view > div').css({'position':'absolute',     'bottom': 0,
          'width': '100%'});
          if ($(document).scrollTop() + window.innerHeight < $('footer').offset().top) $('#map-view > div').css({'position': 'fixed', 'width': '34%'}); // restore when you scroll up
      }
      $(document).scroll(function() {
          checkOffset();
      });
    });
  };
  function showFilter(filter) {
    console.log(filter);
  }
  function cancelFocus(attraction) {
    attraction.focus = false;
  };
  function focusOnResult(attraction) {
    attraction.focus = true;
  }
  vm.showStore = function(evt, storeId) {
    vm.store = vm.stores[storeId];
    vm.map.showInfoWindow('foo', this);
  };

  function showDetail(e, $index) {
    vm.attraction = vm.items[$index];
    // vm.map.infowindow
    // console.log(attraction);
    // console.log(attraction.id);
    // $scope.$apply();
    vm.map.showInfoWindow('foo-iw', vm.attraction.id);

  };
  function hideDetail() {
    vm.map.hideInfoWindow('foo-iw');
  };
  function setPage(page) {
    if (page < 1 || page > vm.pager.totalPages) {
        return;
    }
    vm.pager = PagerService.GetPager(vm.results.length, page);
    vm.items = vm.results.slice(vm.pager.startIndex, vm.pager.endIndex + 1);

    MapService.LoadSearchMap(vm.map).then(function(map) {
      var bounds = new google.maps.LatLngBounds();
      for (var k in map.markers) {
        var cm = map.markers[k];
        bounds.extend(cm.getPosition());
      };
      map.setCenter(bounds.getCenter());
      map.fitBounds(bounds);

      vm.map = map;
    });


    // var infowindow = new google.maps.InfoWindow();
    // var center = new google.maps.LatLng(40.71, -74.21);
    // infowindow.setContent(
    //             '<h3>foobar</h3>');
    //
    // infowindow.setPosition(center);
    // infowindow.open($scope.objMapa);

    // google.maps.event.trigger(vm.map,'resize');

  };
  vm.toggleExp = toggleExp;
  function toggleExp(exp) {
    console.log(exp);
    exp.selected = !exp.selected;
    if(vm.filter.tags.selected.indexOf(exp) == -1) {
      vm.filter.tags.selected.push(exp);
    } else {
      vm.filter.tags.selected.splice(vm.filter.tags.selected.indexOf(exp), 1);
    }
  };
  function loadExperiences() {
      var url = $rootScope.api+ 'json/experience-tags';

      $http.get(url).then(function(response) {
        vm.loading = false;

        if(response.status = 200) {
          vm.experiences = response.data;
          for (var i = 0; i < vm.experiences.length; i++) {
            vm.experiences[i].selected = false;
          }
          console.log(vm.experiences);
        }
      });
  };
  function search() {
    var url = 'http://localhost/grouptravel/app/backend/web/v1/api/search';

    ApiService.Get(url).then(function(response) {
      vm.loading = false;
      if(response.status == 200) {
          var results = response.data;
          console.log('results', results)
;          vm.results = []; //response.data;
          for (var i = 0; i < results.length; i++) {
            //processAttraction
            var attraction = AttractionService.ProcessEntity(results[i]);
            var request = {
              'experiences' : [],
              'previous_experiences' : []
            };

            var rank = RankingService.Init(request, attraction);

            attraction.rank.previous = rank.previous;
            attraction.rank.current = rank.current;

            vm.results.push(attraction);
          }
          vm.setPage(1);

          MapService.LoadSearchMap(vm.map).then(function(map) {
            var bounds = new google.maps.LatLngBounds();
            for (var k in map.markers) {
              var cm = map.markers[k];
              bounds.extend(cm.getPosition());
            };
            map.setCenter(bounds.getCenter());
            map.fitBounds(bounds);

            vm.map = map;
          });
        }
    });
  }
};
