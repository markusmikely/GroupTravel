AttractionService.$inject = ['$cookies', '$rootScope', '$http'];
function AttractionService($cookies, $rootScope, $http) {
  return {
  //   process attraction
  // gettimeel
  // getterms
  // gettoppicks
  // getMapAttractionsma
    Process: function(attraction) {
      if(attraction != undefined) {
        var pAttraction = {
          'id': attraction.nid,
          'title': attraction.title,
          'address': {
            'address1': attraction.field_address_address_line1,
            'address2': attraction.field_address_address_line2,
            'county': attraction.field_address_locality,
            'country': attraction.field_address_country_code,
            'postcode': attraction.field_address_postal_code,
          },
          'body': attraction.body,
          'experiences': attraction.field_experiences.split(","),
          'images': attraction.field_feature.split(","),
          'time_required':attraction.field_time_required,
          'rank': attraction.field_rank,
          'focus': false,
          'featured':false
        };
        if(attraction.field_location != undefined) {
          pAttraction.coordinates = {
            'lng': JSON.parse(attraction.field_location).coordinates[0],
            'lat': JSON.parse(attraction.field_location).coordinates[1],
          };
        }
        if(attraction.field_feature_1 != undefined) {
          pAttraction.thumbnails = attraction.field_feature_1.split(",");
        }

        return pAttraction;
      }
      return null;
    },
    ProcessCoord: function(attraction) {
      return {
        'id': attraction.nid,
        'title': attraction.title,
        'location': {
          'city': attraction.field_address_locality,
          'postcode': attraction.field_address_postal_code,
        },
        'coordinates': {
          'lng': JSON.parse(attraction.field_location).coordinates[0],
          'lat': JSON.parse(attraction.field_location).coordinates[1],
        }
      };
    },
    GetAttraction: function(id) {
      //TO DO Init ajax call for data
      var url = "http://localhost/drupal/drupal-8.3.2/web/json/attraction-by-id/?nid="+id;

      return $http.get(url);
    },
    GetTopPicks: function() {
      var url = $rootScope.api+'json/top-picks';
      return $http.get(url);
    },
    GetMapAttractions: function() {
      var url = $rootScope.api+'json/all-attractions-location';
      return $http.get(url);
    },
    GetRelatedAttractions(id) {
      var url = $rootScope.api+"json/related-attractions";
      return $http.get(url);
    },
    MoveThumbnails: function(dir, position, attraction, style) {
      if(dir == 'left') {
        position = position - 200;
      } else {
        position = position + 200;
      }
      var upperLimit = -((attraction.thumbnails.length * 200) - 600);
      if(position > 0) {
        vm.thumbnailPosition = 0;
      } else if (vm.thumbnailPosition < upperLimit) {
        position = upperLimit;
      }
      style = {'left': position+'px'};
      return style;
    }
  };
};
