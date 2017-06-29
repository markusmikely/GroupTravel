AttractionController.$inject = ['$window', '$cookies', '$http', '$stateParams', '$rootScope', 'CartService', 'AttractionService', 'ApiService'];
function AttractionController($window, $cookies, $http, $stateParams, $rootScope, CartService, AttractionService, ApiService) {

  var vm = this;

  // Methods
  vm.init = init;
  vm.getAttraction = getAttraction;
  vm.getRelatedAttractions = getRelatedAttractions;
  vm.movePosition = movePosition;
  vm.addAttraction =  addAttraction;
  vm.getTimeEl = getTimeEl;
  vm.processAttraction = processAttraction;
  vm.setImage = setImage;
  // Rank Management
  vm.updateViews = updateViews;

  // Init
  (function initController() {
    var id = $stateParams.id;
    vm.init(id);
  })();
  function init(id) {
    // Attributes
    vm.loading = true;
    vm.thumbnailPosition=  0;
    vm.thumbnailStyle = {'left': vm.thumbnailPosition+'px'};
    vm.getAttraction(id);
    vm.getRelatedAttractions(id);
  };
  function updateViews() {
    AttractionService.UpdateAttractionViews(vm.attraction);
  }
  function getAttraction(id) {
    AttractionService.GetAttraction(id).then(function(response) {
      vm.loading = false;
      if(response.status = 200) {
        vm.attraction = vm.processAttraction(response.data[0]);
        vm.mainImage = vm.attraction.images[0];
        vm.updateViews();
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
    return AttractionService.ProcessEntity(attraction);
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
