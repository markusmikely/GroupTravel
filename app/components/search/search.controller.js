SearchController.$inject = ['$http', '$state', '$rootScope', 'PagerService', 'NgMap'];
function SearchController($http, $state, $rootScope, PagerService, NgMap) {

  var vm = this;

  vm.loading = false;
  vm.results = []; // dummy array of items to be paged
  vm.pager = {};

  vm.init = init;
  vm.setPage = setPage;
  vm.search = search;
  vm.loadExperiences = loadExperiences;
  vm.selectTag = selectTag;
  vm.countSelected = 0;

  vm.focusOnResult = focusOnResult;
  vm.cancelFocus =cancelFocus;

  vm.showDetail = showDetail;
  vm.hideDetail = hideDetail;

  // Init
  (function initController() {
    vm.init();
  })();

  function cancelFocus(attraction) {
    attraction.focus = false;
  };
  function focusOnResult(attraction) {
    attraction.focus = true;
  }
  function showDetail(e, attraction) {
    vm.attraction = attraction;
    vm.map.showInfoWindow('foo-iw', attraction.id);
  };
  function hideDetail() {
    vm.map.hideInfoWindow('foo-iw');
  };
  function selectTag(tag) {
    if(tag.selected) {
      vm.countSelected--;
    } else {
      vm.countSelected++;
    }
    tag.selected = !tag.selected;
  };
  function setPage(page) {
    if (page < 1 || page > vm.pager.totalPages) {
        return;
    }

    // get pager object from service
    vm.pager = PagerService.GetPager(vm.results.length, page);

    // get current page of items
    var results = vm.results.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
    vm.items = results;
  };
  function init() {
    vm.loadExperiences();
    vm.search();

    // TO BE CONVERTED TO ANGULAR JS
    $(function() {
      function checkOffset() {
          if ($('#map-view > div').offset().top + $('#map-view > div').height() >= $('footer').offset().top - 10) $('#map-view > div').css({'position':'absolute',     'bottom': 0,
          'width': '100%'});
          if ($(document).scrollTop() + window.innerHeight < $('footer').offset().top) $('#map-view > div').css({'position': 'fixed', 'width': '34%'}); // restore when you scroll up
      }
      $(document).scroll(function() {
          checkOffset();
      });
    });
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
        }
      });
  };
  function search() {
    var url = $rootScope.api+'json/search';

    $http.get(url).then(function(response) {
      vm.loading = false;
      console.log(response);
      if(response.status = 200) {
        vm.results = []; //response.data;
        for(var i = 0; i < response.data.length; i++) {
          var attraction = {
            'id': response.data[i].nid,
            'title': response.data[i].title,
            'location': {
              'city': response.data[i].field_address_locality,
              'postcode' : response.data[i].field_address_postal_code,
            },
            'experiences': response.data[i].field_experiences.split(","),
            'coordinates':  {
              'lng': JSON.parse(response.data[i].field_location).coordinates[0],
              'lat': JSON.parse(response.data[i].field_location).coordinates[1],
            },
            'thumbnails': response.data[i].field_feature.split(","),
            'rank': response.data[i].field_rank,
            'focus': false,
            'featured':false

          };
          vm.results.push(attraction);
        }
        vm.setPage(1);

        NgMap.getMap().then(function(map) {
          // console.log('map', map);
          vm.map = map;
          var bounds = new google.maps.LatLngBounds();
          for (var k in map.markers) {
            var cm = map.markers[k];
            bounds.extend(cm.getPosition());
          };
          map.setCenter(bounds.getCenter());
          map.fitBounds(bounds);
        });
      }
    });
  }
}
