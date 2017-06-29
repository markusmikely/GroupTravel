CookieService.$inject = ['$cookies', '$rootScope'];
function CookieService($cookies, $rootScope) {

    return {
        GetUserSelections: function() {
          var cart = $cookies.get('twinuk_user_selections');
          var cartArray = [];

          if(cart != undefined) {
        		cartArray = cart.split(",");
        	}
          return cartArray;
        },
        GetViewedAttractions: function() {
          var viewdAttractions = $cookies.get('twinuk_viewed_attractions'); // 1. check if cookie exists
          var attractions = [];
          if(viewdAttractions != undefined) {
            attractions = viewdAttractions.split(",");
          }
          return attractions;
        },
        GetPreviousExperiences: function() {
          var experienceString = $cookies.get('twinuk_previous_experiences'); // 1. check if cookie exists

          var previousExperiences = [];
          if(experienceString != undefined) {
            previousExperiences = experienceString.split(",");
          }

          for (var i = 0; i < previousExperiences.length; i++) {
            previousExperiences[i] = parseInt(previousExperiences[i]);
          }
          return previousExperiences;
        },
        AddUserSelection: function(attraction) {
          var cart = $cookies.get('twinuk_user_selections');
          var cartArray = [];
          if(cart != undefined) {
        		cartArray = cart.split(",");
        	}
          if(cartArray.indexOf(attraction.id.toString()) == -1) {
            $rootScope.cart.push(attraction);
            cartArray.push(attraction.id);
            cart = cartArray.toString();
            $cookies.put('twinuk_user_selections', cart);
          }
        },
        RemoveUserSelection: function($index) {
          $rootScope.cart.splice($index, 1);
          var cartString = JSON.stringify($rootScope.cart);
          $cookies.put('twinuk_user_selections', cartString);
        },
        AddPreviousExperience: function(experiences) {
          var previousExperiences = this.GetPreviousExperiences();
          for (var i = 0; i < experiences.length; i++) {
            if(previousExperiences.indexOf(experiences[i]) == -1) {
              previousExperiences.push(experiences[i]);
              var previousExpString = previousExperiences.toString();
              $cookies.put('twinuk_previous_experiences', previousExpString);
            }
          }
        },
        AddViewedAttraction: function(attraction) {
          var attractions = this.GetViewedAttractions();
          if(attractions.indexOf(attraction.id.toString()) == -1) {
            attractions.push(attraction.id);
            var attractionString = attractions.toString();
            $cookies.put('twinuk_viewed_attractions', attractionString);
          }
        },
        AddSavedAttraction: function(attraction) {
          var attractions = this.GetViewedAttractions();
          if(attractions.indexOf(attraction.id.toString()) == -1) {
            attractions.push(attraction.id);
            var attractionString = attractions.toString();
            $cookies.put('twinuk_saved_attractions', attractionString);
          }
        }

    };
};
