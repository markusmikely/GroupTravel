SelectionController.$inject = ['CartService'];
function SelectionController(CartService) {

  var vm = this;

  vm.removeAttraction = removeAttraction;

  function removeAttraction($index) {
    CartService.RemoveAttraction($index);
  }
}
