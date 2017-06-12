<?php

	define('WP_USE_THEMES', false);
  	require('../../wp-load.php');  

  	$videos = array();
  	$news = array();
  	$events = array();
  	$teachers = array();

  	// ************************** VIDEOS **************************
  	$args['post_type'] = 'news';

	$the_query = new WP_Query( $args );

	// The Loop
	if ( $the_query->have_posts() ) {
		while ( $the_query->have_posts() ) {
			$the_query->the_post();
			
			$story = array(
				'id' => get_the_ID(),
				'name' => get_the_title(),
				'content' => wp_strip_all_tags(get_the_content()),
			);
			array_push($news, $story);
		}
	}
	// /* Restore original Post Data */
	wp_reset_postdata();
  	// ************************** VIDEOS **************************
  	$args['post_type'] = 'video';

	$the_query = new WP_Query( $args );

	// The Loop
	if ( $the_query->have_posts() ) {
		while ( $the_query->have_posts() ) {
			$the_query->the_post();
			if ( has_post_thumbnail( $page_id ) ) :
	            $image_array = wp_get_attachment_image_src( get_post_thumbnail_id( $page_id ), 'optional-size' );
	            $image = $image_array[0];
	        else :
	            $image ='http://placehold.it/400x500';
	        endif;

			$video = array(
				'id' => get_the_ID(),
				'name' => get_the_title(),
				'url' =>get_field( 'video_url' ) , 
				'type' =>  get_field( 'video_type' ),
				'image' => $image
			);
			array_push($videos, $video);
		}
	}
	// /* Restore original Post Data */
	wp_reset_postdata();
  	// ************************** TEACHERS **************************
  	$args['post_type'] = 'teacher';

	$the_query = new WP_Query( $args );

	// The Loop
	if ( $the_query->have_posts() ) {
		while ( $the_query->have_posts() ) {
			

			$the_query->the_post();
			
			if ( has_post_thumbnail( $page_id ) ) :
	            $image_array = wp_get_attachment_image_src( get_post_thumbnail_id( $page_id ), 'optional-size' );
	            $image = $image_array[0];
	        else :
	            $image ='http://placehold.it/400x500';
	        endif;
	        
			$teacher = array(
				'id' => get_the_ID(),
				'name' => get_the_title(),
				'position' =>get_field( 'position' ) , 
				'styles' =>  get_field( 'styles' ),
				'classes' => get_field( 'classes' ),
				'content' => wp_strip_all_tags(get_the_content()),
				'image' => $image,
			);
			array_push($teachers, $teacher);
		}
	}
	// /* Restore original Post Data */
	wp_reset_postdata();
	// ************************** EVENTS **************************
  	$args['scope'] = 'month';
	$args['order'] = "ASC";
	$args['post_status'] = "publish";
	
	$args = apply_filters('em_content_events_args', $args);
    $list = EM_Events::get($args);
    
    foreach ($list as $listItem) {
    	
        $args2['location_id'] = $listItem->location_id;

        $locationObj = EM_Locations::get($args2)[0];
        $listItem->get_bookings()->get_tickets();//EM_Tickets::get();

        $tickets = array();

        $hjg = (array) $listItem->bookings->tickets->tickets;
        
        foreach ($hjg as  $ticket) {
            
            
            $t = array(
                'ticket_name' => $ticket->ticket_name,
                'ticket_price' => $ticket->ticket_price,
            );
            array_push($tickets, $t);

        }
        
        $page_id = $listItem->post_id;
        if ( has_post_thumbnail( $page_id ) ) :
            $image_array = wp_get_attachment_image_src( get_post_thumbnail_id( $page_id ), 'optional-size' );
            $image = $image_array[0];
        else :
            $image ='http://placehold.it/400x500';
        endif;


		$categories  = get_the_terms($listItem->post_id, EM_TAXONOMY_CATEGORY);
		$category = '';
		foreach ($categories as $cat) {
			$category = $cat->slug;
		}
        $location = array(
            'location_name' => $locationObj->location_name,
            'location_address' => $locationObj->location_address,
            'location_town' => $locationObj->location_town,
            'location_state' => $locationObj->location_state,
            'location_postcode' => $locationObj->location_postcode,
            'location_region' => $locationObj->location_region,
            'location_country' => $locationObj->location_country,
            'location_latitude' => $locationObj->location_latitude,
            'location_longitude' => $locationObj->location_longitude,
        );
    	$event = array(
    		'event_id' => $listItem->post_id, 
    		'event_name' => $listItem->event_name, 
            'event_start_date' => Date('Y-m-d\TH:i:s\Z', strtotime($listItem->event_start_date.$listItem->event_start_time)), 
    		'event_end_date' => Date('Y-m-d\TH:i:s\Z', strtotime($listItem->event_end_date.$listItem->event_end_time)), 
    		'recurrence_freq' => $listItem->recurrence_freq,
    		'recurrence_byday' =>$listItem->recurrence_byday,
    		'event_image' => $image,
    		'location' => $location,
    		'tickets' => $tickets,
    		'category' => $category, //EM_Categories::get(array('event_id' => $listItem->post_id)),
    	);
    	array_push($events, $event);
    }
  	
  	$home = array(
  		'videos' => $videos,
  		'news' => $news,
  		'events' => $events,
  		'teachers' => $teachers,
  	);

  	echo json_encode($home); 
?>