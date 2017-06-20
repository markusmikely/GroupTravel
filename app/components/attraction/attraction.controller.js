AttractionController.$inject = ['$window', '$cookies', '$http', '$stateParams', '$rootScope', 'CartService'];
function AttractionController($window, $cookies, $http, $stateParams, $rootScope, CartService) {


  var vm = this;

  vm.thumbnailPosition=  -200;
  vm.thumbnailStyle = {'left': vm.thumbnailPosition+'px'};
  vm.movePosition = movePosition;

  function movePosition(dir) {
    if(dir == 'left') {
      console.log(3);
      vm.thumbnailPosition = vm.thumbnailPosition - 200;
    } else {
      vm.thumbnailPosition = vm.thumbnailPosition + 200;
    }
    var upperLimit = -((vm.attraction.thumbnails.length * 200) - 600);
    if(vm.thumbnailPosition > 0) {
      vm.thumbnailPosition = 0;
    } else if (vm.thumbnailPosition < upperLimit) {
      vm.thumbnailPosition = upperLimit;
    }
    vm.thumbnailStyle = {'left': vm.thumbnailPosition+'px'};
    console.log(vm.thumbnailPosition);
    console.log(-((vm.attraction.thumbnails.length * 200) - 600));
  };

  vm.loading = true;
  vm.addAttraction =  addAttraction;
  vm.getTimeEl = getTimeEl;
  vm.processAttraction = processAttraction;

  function processAttraction(attraction) {
    console.log('attraction');
    console.log(attraction);
    var pAttraction = {
      'id': attraction.nid,
      'title': attraction.title,
      'address': {
        'address1': attraction.field_address_address_line1,
        'address2': attraction.field_address_address_line2,
        'county': attraction.field_address_locality,
        'country': attraction.field_address_country_code,
        'postcode': '',
      },
      'body': attraction.body,
      'experiences': attraction.field_experiences.split(","),
      'images': attraction.field_feature.split(","),
      'thumbnails': attraction.field_feature_1.split(","),
      'time_required': {
        'days' : vm.getTimeEl('days'),
        'hours' : vm.getTimeEl('hours'),
        'minutes' : vm.getTimeEl('minutes'),
      },
      'coordinates':  {
        'lng': JSON.parse(attraction.field_location).coordinates[0],
        'lat': JSON.parse(attraction.field_location).coordinates[1],
      },
      'rank': attraction.field_rank
    };
    return pAttraction;
  }

  function getTimeEl(time, gran) {
    var timeArray = time.split(",");

    for (var i = 0; i < timeArray.length; i++) {
      if(timeArray[i].indexOf(gran) != -1) {
        time = timeArray[i].replace(" "+gran, "");
        return time;
      }
    }
    return "";
  }

  function addAttraction(attraction) {
    CartService.AddAttraction(attraction);
  }
  vm.setImage = setImage;

  function setImage($index) {
    vm.mainImage = vm.attraction.images[$index];
    console.log($index);
  }
  // Init
  (function initController() {
    $cookies.put('foo', 'bar');

    var id = $stateParams.id;
    //TO DO Init ajax call for data
    var url = "http://localhost/drupal/drupal-8.3.2/web/json/attraction-by-id/?nid="+id;

    console.log(url);
    $http.get(url).then(function(response) {
      vm.loading = false;
      if(response.status = 200) {
        console.log('response');
        console.log(response);
        vm.attraction = vm.processAttraction(response.data[0]);
        vm.mainImage = vm.attraction.images[0];
        // vm.attraction.images = vm.attraction.field_feature_1.split(",");
        // vm.attraction.thumbnails = vm.attraction.field_feature.split(",");

        console.log(response.data);
        // console.log('Home');
        // console.log(response.data.message.featured);
        // console.log(url);
        // vm.dataLoading = true;
      }
    });
    var url = $rootScope.api+"json/related-attractions";
    $http.get(url).then(function(response) {
      vm.loading = false;
      if(response.status = 200) {
        vm.related = response.data;
        // vm.attraction.images = vm.attraction.field_feature_1.split(",");
        // vm.attraction.thumbnails = vm.attraction.field_feature.split(",");
        // console.log('Home');
        // console.log(response.data.message.featured);
        // console.log(url);
        // vm.dataLoading = true;
      }
    });
  })();
}
