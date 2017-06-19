SearchController.$inject = ['$http', '$state', '$rootScope', 'PagerService'];
function SearchController($http, $state, $rootScope, PagerService) {

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
        vm.results = response.data;
        for(var i = 0; i < vm.results.length; i++) {
          vm.results[i].thumbnails = vm.results[i].field_feature.split(",");
          vm.results[i].experiences = vm.results[i].field_experiences.split(",");

        }
        vm.setPage(1);
        console.log(vm.items);
      }
    });
  }
}
