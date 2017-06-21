SelectionController.$inject = ['CartService', '$rootScope'];
function SelectionController(CartService, $rootScope) {

  var vm = this;

  $rootScope.width = 10;

  console.log($rootScope.cart);
  vm.removeAttraction = removeAttraction;

  function removeAttraction($index) {
    CartService.RemoveAttraction($index);
  }
}
