<?php
define('WP_USE_THEMES', false);
require('../../wp-load.php');  


if(isset($_POST['post_type']) && $_POST['post_type'] == "recordPayment") {
	global $wpdb;

	$cart = $_POST['cart'];
	$billing = $_POST['billing'];
	$payerID = $_POST['payerID'];
	$paymentID = $_POST['paymentID'];
	$paymentToken = $_POST['paymentToken'];

	return $wpdb->insert('wp_orders',
	     array(
	          'cart'=>$cart,
	          'billing'=>$billing,
	          'payerID'=>$payerID,
	          'paymentID'=>$paymentID,
	          'paymentToken'=>$paymentToken
	     ),
	     array( 
	          '%s',
	          '%s',
	          '%s',
	          '%s',
	          '%s'
	     )
	);	
} else {
	return "Request no found";
}

?>