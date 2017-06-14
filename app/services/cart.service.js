CartService.$inject = ['$cookies', '$rootScope'];
function CartService($cookies, $rootScope) {
  // - Create Selection object
  // - Add dummy data to selection
  // - Add function
  // - Remove function
  // - Update count
  // - Sum-days
  // - empty selection
  return {

    Empty: function() {
      this.Save();
    },
    AddAttraction: function(attraction) {
      if($rootScope.cart.indexOf(attraction) == -1) {
        $rootScope.cart.push(attraction);
        this.Save();
      } else {
        // Attraction already in selection
      }

    },
    RemoveAttraction($index) {
      $rootScope.cart.splice($index, 1);
      this.Save();
    },
    Total: function() {

    },
    SumDays: function() {

    },
    Save: function() {
      var cartString = JSON.stringify($rootScope.cart);
      $cookies.put('twinuk_user_selections', cartString);
    }
    // EmptyCart: function() {
    //   $rootScope.cart = {};
    //   $rootScope.cart.auditions = [];
    //   $rootScope.cart.events = [];
    //   $rootScope.cart.classes = [];
    //   this.SaveCart();
    // },
    // GetCart: function(url, data) {
    //   var cart = $cookies.get('cart');
    //   if(cart != undefined) {
    //     $rootScope.cart = JSON.parse(cart);
    //   }
    // },
    // GetCartTotal: function() {
    //   var total = this.GetTotal('events') + this.GetTotal('classes') + this.GetTotal('auditions');
    //   return total;
    // },
    // GetTotal: function(type) {
    //   var list = [];
    //   if(type == 'events') {
    //     list = $rootScope.cart.events;
    //   } else if(type == 'classes'){
    //     list = $rootScope.cart.classes;
    //   } else if(type == 'auditions'){
    //     list = $rootScope.cart.auditions;
    //   } else {
    //     return;
    //   }
    //   var sum = 0;
    //   for (var i = 0; i < list.length; i++) {
    //     var ticketTotal = list[i].ticket_price * list[i].quantity;
    //     sum = sum + ticketTotal;
    //   }
    //   return sum;
    // },
    // RemoveItem: function($index, cart) {
    //   cart.splice($index, 1);
    //   this.SaveCart();
    // },
    // UpdateQuantity: function(item, dir) {
    //   if(dir == 'minus') {
    //     item.quantity == 0 ? item.quantity =0 : item.quantity = item.quantity -1
    //   } else if(dir == 'plus') {
    //     item.quantity = item.quantity + 1;
    //   }
    //     this.SaveCart();
    // },
    // SaveCart: function() {
    //   var cartString = JSON.stringify($rootScope.cart);
    //   $cookies.put('cart', cartString);
    // }
  };
};
