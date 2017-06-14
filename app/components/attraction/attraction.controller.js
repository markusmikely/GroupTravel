AttractionController.$inject = ['$window', '$cookies', '$http', '$stateParams', '$rootScope', 'CartService'];
function AttractionController($window, $cookies, $http, $stateParams, $rootScope, CartService) {

  var now = new $window.Date(),
    // this will set the expiration to 6 months
    exp = new $window.Date(now.getFullYear(), now.getMonth()+6, now.getDate());

$cookies.put('yourCookie','blabla',{
  expires: exp
});


var cookie = $cookies.get('yourCookie');
alert(cookie); // logs 'blabla'


document.cookie = "ding=dong";
alert(document.cookie);



  var vm = this;

  vm.loading = true;
  vm.addAttraction =  addAttraction;

  function addAttraction(attraction) {
    CartService.AddAttraction(attraction);
  }
  // Init
  (function initController() {
    $cookies.put('foo', 'bar');

    var id = $stateParams.id;
    //TO DO Init ajax call for data
    var url = "http://localhost/drupal/drupal-8.3.2/web/json/attraction-by-id/?nid="+id;
    $http.get(url).then(function(response) {
      vm.loading = false;
      if(response.status = 200) {
        vm.attraction = response.data[0];
        vm.attraction.images = vm.attraction.field_feature_1.split(",");
        vm.attraction.thumbnails = vm.attraction.field_feature.split(",");

        console.log(response.data[0]);
        // console.log('Home');
        // console.log(response.data.message.featured);
        // console.log(url);
        // vm.dataLoading = true;
      }
    });
  })();
}
