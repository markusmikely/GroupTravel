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



  vm.clicked = function() {
    alert('Clicked a link inside infoWindow');
  };

  vm.attractions = [
    {id:'attraction-1', name: 'attraction 1', position:[41,-87]},
    {id:'attraction-2', name: 'attraction 2', position:[42,-86]},
    {id:'attraction-3', name: 'attraction 3', position:[54.779951, 9.334164]},
    {id:'attraction-4', name: 'attraction 4', position:[47.209613, 15.991539]},
    {id:'attraction-5', name: 'attraction 5', position:[51.975343, 7.596731]},
    {id:'attraction-6', name: 'attraction 6', position:[51.97539, 7.596962]},
    {id:'attraction-7', name: 'attraction 7 ', position:[47.414847, 8.23485]},
    {id:'attraction-8', name: 'attraction 8', position:[47.658028, 9.159596]},
    {id:'attraction-9', name: 'attraction 9', position:[47.525927, 7.68761]},
    {id:'attraction-10', name: 'attraction 10', position:[50.85558, 9.704403]},
    {id:'attraction-11', name: 'attraction 11', position:[54.320664, 10.285977]},
    {id:'attraction-12', name: 'attraction 12', position:[49.214374, 6.97506]},
    {id:'attraction-13', name: 'attraction 13', position:[52.975556, 7.596811]},
    {id:'attraction-14', name: 'attraction 14', position:[52.975556, 7.596811]},
    {id:'attraction-15', name: 'attraction 15', position:[52.975556, 7.596811]},
    {id:'attraction-16', name: 'attraction 16', position:[52.975556, 7.596811]},
    {id:'attraction-17', name: 'attraction 17', position:[52.975556, 7.596811]},
    {id:'attraction-18', name: 'attraction 18', position:[52.975556, 7.596811]},
    {id:'attraction-19', name: 'attraction 19', position:[52.975556, 7.596811]},
    {id:'attraction-20', name: 'attraction 20', position:[52.975556, 7.596811]},
    {id:'attraction-21', name: 'attraction 21', position:[52.975556, 7.596811]},
    {id:'attraction-22', name: 'attraction 22', position:[52.975556, 7.596811]}
  ];
  vm.attraction = vm.attractions[0];

  vm.showDetail = function(e, attraction) {
    vm.attraction = attraction;
    console.log(attraction);
    vm.map.showInfoWindow('foo-iw', attraction.id);
  };

  vm.hideDetail = function() {
    vm.map.hideInfoWindow('foo-iw');
  };

  vm.init();

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
    vm.items = [results.splice(0,4), results.splice(0,4), results.splice(0,4)];
  };
  function init() {
    vm.loadExperiences();
    vm.search();
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

          };
          vm.results.push(attraction);
          console.log(attraction);
        }
        vm.setPage(1);

        NgMap.getMap().then(function(map) {
          // console.log('map', map);
          vm.map = map;
          console.log(map);
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
