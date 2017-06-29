AttractionService.$inject = ['$cookies', '$rootScope', '$http', 'ApiService', 'CookieService'];
function AttractionService($cookies, $rootScope, $http, ApiService, CookieService) {
  return {
    ProcessTags: function(array) {
      var tags = [];
      for(var i = 0; i < array.length; i++) {
           var tagId = array[i].target_id;
           tags.push(tagId);
      }
      return tags;
    },
    ProcessEntity: function(attraction) {
      if(attraction != undefined) {
        var pAttraction = {
          'id': attraction.nid[0].value,
          'title': attraction.title[0].value,
          'address': {
            'address1': (attraction.field_address.length > 0) ? attraction.field_address[0].address_line1 : '',
            'address2': (attraction.field_address.length > 0) ? attraction.field_address[0].address_line2 : '',
            'county': (attraction.field_address.length > 0) ? attraction.field_address[0].locality: '',
            'postcode': (attraction.field_address.length > 0) ? attraction.field_address[0].postal_code: '',
          },
          'coordinates': {
            'lat': attraction.field_location[0].lat,
            'lon' : attraction.field_location[0].lon,
          },
          'body': attraction.body[0].value,
          'summary': attraction.body[0].summary,
          'time_required': attraction.field_time_required[0].value,
          'rank': attraction.field_rank[0],
          'focus': false,
          'featured':attraction.field_featured[0].value,
          'images': attraction.field_images,
          'updated': attraction.changed[0].value,
          'experiences' : this.ProcessTags(attraction.field_experience_tags),
          'opening': attraction.field_opening_times[0].value,
          'keyfeatures': attraction.field_k,
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
          'experiences': attraction.field_experience_tags.split(","),
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
      return $http.get('http://localhost/grouptravel/app/backend/web/v1/api/attraction-rank?nid='+id);
    },
    GetTopPicks: function() {
      var url = $rootScope.api+'json/top-picks';
      url = "	http://localhost/grouptravel/app/backend/web/v1/api/top-picks";
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
      var viewdAttractions = $cookies.get('twinuk_viewed_attractions'); // 1. check if cookie exists

      var attractions = [];
      if(viewdAttractions != undefined) {
        attractions = viewdAttractions.split(",");
      }
      if(attractions.indexOf(attraction.id.toString()) == -1) {
          // Update attraction views
          attraction.rank.views = parseInt(attraction.rank.views)+ 1;
          var updated = parseInt(Math.floor(Date.now() / 1000));
          var package = {
            "field_rank": [
    	         {
                  "popularity": attraction.rank.popularity,
                  "upsell": attraction.rank.upsell,
                  "views": attraction.rank.views,
                  "saves": attraction.rank.saves,
                  "quotes": attraction.rank.quotes,
                  "rank": attraction.rank.rank,
                  "updated": updated
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
            CookieService.AddViewedAttraction(attraction);
            CookieService.AddPreviousExperience(attraction.experiences);
      });

      }
    },
    UpdateAttractionQuotes: function(attraction) {
      attraction.rank.quotes = parseInt(attraction.rank.quotes)+ 1;
      var updated = Math.floor(Date.now() / 1000);
      var package = {
        "field_rank": [
           {
              "popularity": attraction.rank.popularity,
              "upsell": attraction.rank.upsell,
              "views": attraction.rank.views,
              "saves": attraction.rank.saves,
              "quotes": attraction.rank.quotes,
              "rank": attraction.rank.rank,
              "updated": updated
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
        if(response.status == 200) {
          console.log(response.data);
        } else {
          console.log('Something when wrong: ApiService.Patch');
        }
      });
    },
    UpdateAttractionSaves: function(attraction) {
      var viewdAttractions = $cookies.get('twinuk_saved_attractions'); // 1. check if cookie exists

      var attractions = [];
      if(viewdAttractions != undefined) {
        attractions = viewdAttractions.split(",");
      }
      if(attractions.indexOf(attraction.id.toString()) == -1) {

          // Update attraction views
          attraction.rank.saves = parseInt(attraction.rank.saves)+ 1;
          var updated = Math.floor(Date.now() / 1000);
          var package = {
            "field_rank": [
    	         {
                  "popularity": attraction.rank.popularity,
                  "upsell": attraction.rank.upsell,
                  "views": attraction.rank.views,
                  "saves": attraction.rank.saves,
                  "quotes": attraction.rank.quotes,
                  "rank": attraction.rank.rank,
                  "updated": updated
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
            CookieService.AddSavedAttraction(attraction);
            CookieService.AddPreviousExperience(attraction.experiences);
          });

      }

    }
  };
};
