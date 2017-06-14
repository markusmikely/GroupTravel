SearchController.$inject = ['$http', '$state', '$rootScope', 'PagerService'];
function SearchController($http, $state, $rootScope, PagerService) {

  var vm = this;

  vm.loading = false;

  vm.results = []; // dummy array of items to be paged
  vm.pager = {};

  vm.setPage = setPage;
  vm.init = init;
  vm.search = search;
  vm.autoComplete = autoComplete;
  vm.getLocations = getLocations;
  vm.getAttractions = getAttractions;

  vm.init();

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
};
function search() {

};
function autoComplete() {

};
function getLocations() {

};
function getAttractions() {

};


// Favourites functions
function addAttraction($list) {

};
function removeAttraction($list) {
}
// Drag and drop
}
