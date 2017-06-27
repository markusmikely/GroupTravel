AttractionService.$inject = ['$cookies', '$rootScope', '$http', 'ApiService'];
function AttractionService($cookies, $rootScope, $http, ApiService) {
  return {
  //   process attraction
  // gettimeel
  // getterms
  // gettoppicks
  // getMapAttractionsma
    ProcessEntity: function(attraction) {
      console.log('attraction', attraction);
      console.log('address', attraction.field_address.length);
      // console.log('line1', attraction.field_address[0].address_line1);

      if(attraction != undefined) {
        var pAttraction = {
          'id': attraction.nid[0].value,
          'title': attraction.title[0].value,
          'address': {
            'address1': (attraction.field_address.length > 0) ? attraction.field_address[0].address_line1 : '',
            'address2': (attraction.field_address.length > 0) ? attraction.field_address[0].address_line2 : '',
            'county': attraction.field_address[0].locality,
            'postcode': attraction.field_address[0].postal_code,
          },
          'coordinates': {
            'lat': attraction.field_location[0].lat,
            'lon' : attraction.field_location[0].lon,
          },
          'body': attraction.body[0].value,
          'summary': attraction.body[0].summary,
          // 'experiences': attraction.field_experience_tags.split(","),
          // 'images': attraction.field_feature.split(","),
          'time_required': attraction.field_time_required[0].value,
          'rank': attraction.field_rank[0],
          'focus': false,
          'featured':attraction.field_featured[0].value,
          'images': attraction.field_images
        };
        pAttraction.images = [];
        pAttraction.thumbnails = [];
        for (var i = 0; i < attraction.field_images.length; i++) {
          pAttraction.images.push(attraction.field_images[i].url);
          pAttraction.thumbnails.push(attraction.field_images[i].url);
        }
        return pAttraction;

      }
      return null;
    },
    Process: function(attraction) {
      console.log(attraction);
      if(attraction != undefined) {
        var pAttraction = {
          'id': attraction.nid,
          'title': attraction.title,
          'address': {
            'address1': (attraction.field_address_address_line1 != undefined) ? attraction.field_address_address_line1 : "",
            'address2': attraction.field_address_address_line2,
            'county': attraction.field_address_locality,
            'country': attraction.field_address_country_code,
            'postcode': attraction.field_address_postal_code,
          },
          'body': attraction.body,
          // 'experiences': attraction.field_experience_tags.split(","),
          // 'images': attraction.field_feature.split(","),
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
      // var url = "http://localhost/drupal/drupal-8.3.2/web/json/attraction-by-id/?nid="+id;
      //
      // return $http.get(url);

      return $http.get('http://localhost/grouptravel/app/backend/web/v1/api/attraction-rank?id='+id);

      // .then(function(r) {
      //   if(r.status == 200) {
      //     console.log(r.data[0].field_rank[0].saves);
      //   }
      // });

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
    },
    UpdateAttractionViews: function(attraction) {
      // TODO Add a check if the user has visited thed website before
      var viewdAttractions = $cookies.get('twinuk_viewed_attractions'); // 1. check if cookie exists

      var attractions = [];
      if(viewdAttractions != undefined) {
        attractions = viewdAttractions.split(",");
      }
      if(attractions.indexOf(attraction.id.toString()) == -1) {
        attractions.push(attraction.id);
        var attractionString = attractions.toString();
        $cookies.put('twinuk_viewed_attractions', attractionString);

          // Update attraction views
          attraction.rank.views = parseInt(attraction.rank.views)+ 1;
          var package = {
            "field_rank": [
    	         {
    		           "views": attraction.rank.views,
    	         }
             ],
             "type": [
               { "target_id": "attraction" }
             ],
             "_links": {
               "type": { "href": "http://localhost/grouptravel/app/backend/web/rest/type/node/attraction" }
             }
          };
          ApiService.Patch(package, attraction.id).then(function(response) {
            console.log(response);
          });

      }
    },
    UpdateAttractionQuotes: function(attraction) {
      attraction.rank.quotes = parseInt(attraction.rank.quotes)+ 1;
      var package = {
        "field_rank": [
           {
               "quotes": attraction.rank.quotes,
           }
         ],
         "type": [
           { "target_id": "attraction" }
         ],
         "_links": {
           "type": { "href": "http://localhost/grouptravel/app/backend/web/rest/type/node/attraction" }
         }
      };
      ApiService.Patch(package, attraction.id).then(function(response) {
        console.log(response);
      });
    },
    UpdateAttractionSaves: function(attraction) {
      attraction.rank.saves = parseInt(attraction.rank.saves)+ 1;
      var package = {
        "field_rank": [
           {
               "quotes": attraction.rank.saves,
           }
         ],
         "type": [
           { "target_id": "attraction" }
         ],
         "_links": {
           "type": { "href": "http://localhost/grouptravel/app/backend/web/rest/type/node/attraction" }
         }
      };
      ApiService.Patch(package, attraction.id).then(function(response) {
        console.log(response);
      });
    }
  };
};
