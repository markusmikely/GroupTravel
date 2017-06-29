CartService.$inject = ['CookieService', 'AttractionService', '$rootScope', '$log'];
function CartService(CookieService, AttractionService, $rootScope, $log) {
  return {
    Init: function() {
      $rootScope.api = "http://localhost/drupal/drupal-8.3.2/web/";
    	$rootScope.cart = [];
    	$rootScope.days = 0;
      $rootScope.duration = 0;

      var cartArray = CookieService.GetUserSelections();
      for (var i = 0; i < cartArray.length; i++) {
        AttractionService.GetAttraction(cartArray[i]).then(function(response) {
          if(response.status == 200) {
            var attraction = AttractionService.ProcessEntity(response.data[0]);

            $rootScope.cart.push(attraction);
            $rootScope.days += attraction.time_required;

            if($rootScope.duration == 0) {
              $rootScope.tripProgress = 100;
            } else {
              $rootScope.tripProgress = ($rootScope.days/$rootScope.duration) * 100;
            }
          }
        });
      }
    },
    Empty: function() {
      $rootScope.cart = [];
      this.Save();
    },
    AddAttraction: function(attraction) {
      CookieService.AddUserSelection(attraction);
      AttractionService.UpdateAttractionSaves(attraction);
    },
    RemoveAttraction($index) {
      CookieService.RemoveUserSelection($index);
    }
  };
};
