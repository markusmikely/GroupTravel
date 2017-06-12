<?php 

    define('WP_USE_THEMES', false);
    require('../../wp-load.php');  

    $args['scope'] = 'month';
    $args['order'] = "ASC";
    $args['post_status'] = "publish";
    $args['category'] = 7;
        
    $args = apply_filters('em_content_events_args', $args);
    $list = EM_Events::get($args);
    
    $items = array();
    
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
        $item = array(
            'event_id' => $listItem->post_id, 
            'event_name' => $listItem->event_name, 
            'event_start_date' => $listItem->event_start_date, 
            'event_end_date' => $listItem->event_end_date, 
            'event_start_time' => $listItem->event_start_time, 
            'event_end_time' => $listItem->event_end_time, 
            'recurrence_freq' => $listItem->recurrence_freq,
            'recurrence_byday' =>$listItem->recurrence_byday,
            'event_image' => $image,
            'location' => $location,
            'tickets' => $tickets,
        );
        array_push($items, $item);
    }
    echo json_encode($items);
?>