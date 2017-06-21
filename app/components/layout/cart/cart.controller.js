SelectionController.$inject = ['CartService', '$rootScope'];
function SelectionController(CartService, $rootScope) {

  var vm = this;

  // $rootScope.width = 10;
  //
  // console.log($rootScope.cart);
  //
  // var totalTime = 0;
  // for (var i = 0; i < $rootScope.cart.length; i++) {
  //   totalTime = totalTime + parseFloat($rootScope.cart[i].time_required);
  //   console.log('total time: '+ totalTime);
  //
  // }
  //
  // var tripTimePercentage = (totalTime/$rootScope.width) * 100;
  //
  // console.log(tripTimePercentage);


  // field_time_required
  vm.removeAttraction = removeAttraction;

  function removeAttraction($index) {
    CartService.RemoveAttraction($index);
  }
}
