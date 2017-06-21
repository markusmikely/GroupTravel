AttractionController.$inject = ['$window', '$cookies', '$http', '$stateParams', '$rootScope', 'CartService', 'AttractionService'];
function AttractionController($window, $cookies, $http, $stateParams, $rootScope, CartService, AttractionService) {

  var vm = this;
  // Attributes
  vm.loading = true;
  vm.thumbnailPosition=  0;
  vm.thumbnailStyle = {'left': vm.thumbnailPosition+'px'};
  // Methods
  vm.init = init;
  vm.getAttraction = getAttraction;
  vm.getRelatedAttractions = getRelatedAttractions;
  vm.movePosition = movePosition;
  vm.addAttraction =  addAttraction;
  vm.getTimeEl = getTimeEl;
  vm.processAttraction = processAttraction;
  vm.setImage = setImage;
  // Init
  (function initController() {
    var id = $stateParams.id;
    vm.init(id);
  })();
  function init(id) {
    vm.getAttraction(id);
    vm.getRelatedAttractions(id);
  };
  function getAttraction(id) {
    AttractionService.GetAttraction(id).then(function(response) {
      vm.loading = false;
      if(response.status = 200) {
        vm.attraction = vm.processAttraction(response.data[0]);
        console.log(vm.attraction);
        vm.mainImage = vm.attraction.images[0];
      }
    });
  };
  function getRelatedAttractions(id) {
    AttractionService.GetRelatedAttractions(id).then(function(response) {
      vm.loading = false;
      if(response.status = 200) {
        vm.related =  response.data;
      }
    });
  };
  function movePosition(dir) {
    vm.thumbnailStyle = AttractionService.MoveThumbnails(dir, vm.thumbnailPosition, vm.attraction, vm.thumbnailStyle);
  };
  function processAttraction(attraction) {
    return AttractionService.Process(attraction);
  };
  function getTimeEl(time, gran) {
    return AttractionService.GetTimeEl(time, gran);
  };
  function addAttraction(attraction) {
    CartService.AddAttraction(attraction);
  };
  function setImage($index) {
    vm.mainImage = vm.attraction.images[$index];
  };
};
