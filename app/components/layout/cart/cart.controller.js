SelectionController.$inject = ['CartService', '$rootScope'];
function SelectionController(CartService, $rootScope) {

  var vm = this;

  // field_time_required
  vm.removeAttraction = removeAttraction;

  function removeAttraction($index) {
    CartService.RemoveAttraction($index);
  }
}
