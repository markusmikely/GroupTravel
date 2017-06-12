<?php
    define('WP_USE_THEMES', false);
    require('../../wp-load.php');  

    $email = $_POST['email'];
    $post_type = $_POST['post_type'];

    if(isset($post_type) && $post_type == 'signUp') {

    	$table = "wp_mailinglist";
    	$data = array(
    		'email' => $email,
    		'created_at' => time(),
    	);
    	$format = array( 
			'%s', 
			'%d' 
		); 
		$wpdb->insert( $table, $data, $format );     	
    }

?>