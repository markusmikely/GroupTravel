
function run( $rootScope) {
	$rootScope.api = "http://localhost/xpozure/app/backend/api/";
	$rootScope.cart = {};

	var ypos,image , parent;
	function parallax() {
		ypos = window.pageYOffset;
		image = jQuery('.hero img');
		jQuery(image).each(function() {
			parent = jQuery(this).parent().parent().offset().top;
			jQuery(this).css('top',  ((ypos- parent ) * .2)  + 'px');
        });
    }
	window.addEventListener('scroll', parallax);
	jQuery('#cart').popover();

}
