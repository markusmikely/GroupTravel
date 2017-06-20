function run($cookies, $rootScope) {
	$rootScope.api = "http://localhost/drupal/drupal-8.3.2/web/";
	$rootScope.cart = [];

	var cart = $cookies.get('twinuk_user_selections');
	if(cart != undefined) {
		$rootScope.cart = JSON.parse(cart);
	}
}
