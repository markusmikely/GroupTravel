SearchController.$inject = ['$http', '$state', '$rootScope'];
function SearchController($http, $state, $rootScope) {

  var vm = this;

  vm.init = init;
  vm.search = search;
  vm.autoComplete = autoComplete;
  vm.getLocations = getLocations;
  vm.getAttractions = getAttractions;
  // Init
  (function initController() {
    //TO DO Init ajax call for data
    //     $http.get(url).then(function(response) {
    //       vm.homepage = response.data.message;
    //       // console.log('Home');
    //       console.log(response.data.message.featured);
    //       console.log(url);
    //       vm.dataLoading = true;
    //     });
  })();
}

function init() {

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
