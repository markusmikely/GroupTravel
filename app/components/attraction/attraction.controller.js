AttractionController.$inject = ['$window', '$cookies', '$http', '$stateParams', '$rootScope', 'CartService', 'AttractionService', 'ApiService'];
function AttractionController($window, $cookies, $http, $stateParams, $rootScope, CartService, AttractionService, ApiService) {

  var vm = this;
  vm.testAPI = testAPI;

  function testAPI() {
    console.log('strt');
    var package = {
      "title": [
        { "value": "attraction 1234" }
      ],
      "type": [
        { "target_id": "attraction" }
      ],
      "_links": {
        "type": { "href": "http://localhost/grouptravel/app/backend/web/rest/type/node/attraction" }
      }
    };

    $http({
      url: 'http://localhost/grouptravel/app/backend/web/node/4?format=hal_json',
      method : 'PATCH',
      data: package,
      headers : {
        'X-CSRF-TOKEN': 'YijdLPLAI46wQxwCgAyd5bGwfV9Aq9C2mz8t8aX3mNA',
        'Content-Type': 'application/hal+json',
        'Accept': 'application/hal+json',
        'Authorization': 'Basic YWRtaW46bW5ram9pMDk='
      },
    })
    .then(function(response) {
      console.log('response',response);
    });
  };

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


  // Rank Management

  vm.updateViews = updateViews;
  vm.updateViews = updateViews;
  vm.updateViews = updateViews;

  function updateViews() {
    // TODO Add a check if the user has visited thed website before
    AttractionService.UpdateAttractionViews(vm.attraction);
    // TODO Save the new view

  }
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
        vm.mainImage = vm.attraction.images[0];
        vm.updateViews();
      }
    });
  };
  function getRelatedAttractions(id) {
    // AttractionService.GetRelatedAttractions(id).then(function(response) {
    //   vm.loading = false;
    //   if(response.status = 200) {
    //     vm.related =  response.data;
    //   }
    // });
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
