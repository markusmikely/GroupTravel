<?php

class EM_Gateway_Committed_Giving extends EM_Gateway {
	//change these properties below if creating a new gateway, not advised to change this for Committed Giving
	var $gateway = 'committed_giving';
	var $title = 'Committed Giving';
	var $status = 4;
	var $status_txt = 'Awaiting Committed Giving Payment';
	var $button_enabled = true;
	var $payment_return = true;
	var $count_pending_spaces = false;
	var $supports_multiple_bookings = true;

	/**
	 * Sets up gateaway and adds relevant actions/filters 
	 */
	function __construct() {
		
		parent::__construct();
		$this->status_txt = __('Awaiting Committed Giving Payment','em-pro');
		if($this->is_active()) {
			add_action('em_gateway_js', array(&$this,'em_gateway_js'));
			//Gateway-Specific
			add_action('em_template_my_bookings_header',array(&$this,'say_thanks')); //say thanks on my_bookings page
			add_filter('em_bookings_table_booking_actions_4', array(&$this,'bookings_table_actions'),1,2);
			add_filter('em_my_bookings_booking_actions', array(&$this,'em_my_bookings_booking_actions'),1,2);

			//Gateway-Specific
			add_action('em_handle_payment_return_' . $this->gateway, array(&$this, 'handle_payment_return')); //handle Silent returns
		}
	}
	
	/* 
	 * --------------------------------------------------
	 * Booking Interception - functions that modify booking object behaviour
	 * --------------------------------------------------
	 */
	
	/**
	 * Intercepts return data after a booking has been made and adds Committed Giving vars, modifies feedback message.
	 * @param array $return
	 * @param EM_Booking $EM_Booking
	 * @return array
	 */
	function booking_form_feedback( $return, $EM_Booking = false ){
		//Double check $EM_Booking is an EM_Booking object and that we have a booking awaiting payment.
		if( is_object($EM_Booking) && $this->uses_gateway($EM_Booking) ){
			if( !empty($return['result']) && $EM_Booking->get_price() > 0 && $EM_Booking->booking_status == $this->status ){
				$return['message'] = get_option('em_committed_giving_booking_feedback');	
				$committed_giving_url = $this->get_committed_giving_url();	
				$committed_giving_vars = $this->get_committed_giving_vars($EM_Booking);		
				$return['message'] = 'You are now being redirected to our secure payment portal';
				
				$committed_giving_return = array('committed_giving_url'=>$committed_giving_url, 'committed_giving_vars'=>$committed_giving_vars);
				$return = array_merge($return, $committed_giving_return);
			}else{
				//returning a free message
				$return['message'] = get_option('em_committed_giving_booking_feedback_free');
			}
		}
		return $return;
	}
	
	/**
	 * Called if AJAX isn't being used, i.e. a javascript script failed and forms are being reloaded instead.
	 * @param string $feedback
	 * @return string
	 */
	function booking_form_feedback_fallback( $feedback ){
		global $EM_Booking;
		if( is_object($EM_Booking) ){
			$feedback .= "<br />" . __('To finalize your booking, please click the following button to proceed to Committed Giving.','em-pro'). $this->em_my_bookings_booking_actions('',$EM_Booking);
		}
		return $feedback;
	}
	
	/**
	 * Triggered by the em_booking_add_yourgateway action, hooked in EM_Gateway. Overrides EM_Gateway to account for non-ajax bookings (i.e. broken JS on site).
	 * @param EM_Event $EM_Event
	 * @param EM_Booking $EM_Booking
	 * @param boolean $post_validation
	 */
	function booking_add($EM_Event, $EM_Booking, $post_validation = false){
		parent::booking_add($EM_Event, $EM_Booking, $post_validation);
		if( !defined('DOING_AJAX') ){ //we aren't doing ajax here, so we should provide a way to edit the $EM_Notices ojbect.
			add_action('option_dbem_booking_feedback', array(&$this, 'booking_form_feedback_fallback'));
		}
	}
	
	/* 
	 * --------------------------------------------------
	 * Booking UI - modifications to booking pages and tables containing committed_giving bookings
	 * --------------------------------------------------
	 */
	
	/**
	 * Instead of a simple status string, a resume payment button is added to the status message so user can resume booking from their my-bookings page.
	 * @param string $message
	 * @param EM_Booking $EM_Booking
	 * @return string
	 */
	function em_my_bookings_booking_actions( $message, $EM_Booking){
	    global $wpdb;
		if($this->uses_gateway($EM_Booking) && $EM_Booking->booking_status == $this->status){
		    //first make sure there's no pending payments
		    $pending_payments = $wpdb->get_var('SELECT COUNT(*) FROM '.EM_TRANSACTIONS_TABLE. " WHERE booking_id='{$EM_Booking->booking_id}' AND transaction_gateway='{$this->gateway}' AND transaction_status='Pending'");
		    if( $pending_payments == 0 ){
				//user owes money!
				$committed_giving_vars = $this->get_committed_giving_vars($EM_Booking);
				$form = '<form action="'.$this->get_committed_giving_url().'" method="post">';
				foreach($committed_giving_vars as $key=>$value){
					$form .= '<input type="hidden" name="'.$key.'" value="'.$value.'" />';
				}
				$form .= '<input type="submit" value="'.__('Resume Payment','em-pro').'">';
				$form .= '</form>';
				$message .= $form;
		    }
		}
		return $message;		
	}

	/**
	 * Outputs extra custom content e.g. the Committed Giving logo by default. 
	 */
	function booking_form(){
		echo '
		<div class="form-group">
			<input type="hidden" class="form-control" name="events">
			<input type="hidden" class="form-control" name="orderref">
			<input type="hidden" class="form-control" name="orderamount">
			<input type="hidden" class="form-control" name="returnurl">
			<input type="hidden" class="form-control" name="returnurlfail">
		</div>
		';
	}
	
	/**
	 * Outputs some JavaScript during the em_gateway_js action, which is run inside a script html tag, located in gateways/gateway.committedgiving.js
	 */
	function em_gateway_js(){
		include(dirname(__FILE__).'/gateway.committedgiving.js');		
	}
	
	/**
	 * Adds relevant actions to booking shown in the bookings table
	 * @param EM_Booking $EM_Booking
	 */
	function bookings_table_actions( $actions, $EM_Booking ){
		return array(
			'approve' => '<a class="em-bookings-approve em-bookings-approve-offline" href="'.em_add_get_params($_SERVER['REQUEST_URI'], array('action'=>'bookings_approve', 'booking_id'=>$EM_Booking->booking_id)).'">'.esc_html__emp('Approve','dbem').'</a>',
			'delete' => '<span class="trash"><a class="em-bookings-delete" href="'.em_add_get_params($_SERVER['REQUEST_URI'], array('action'=>'bookings_delete', 'booking_id'=>$EM_Booking->booking_id)).'">'.esc_html__emp('Delete','dbem').'</a></span>',
			'edit' => '<a class="em-bookings-edit" href="'.em_add_get_params($EM_Booking->get_event()->get_bookings_url(), array('booking_id'=>$EM_Booking->booking_id, 'em_ajax'=>null, 'em_obj'=>null)).'">'.esc_html__emp('Edit/View','dbem').'</a>',
		);
	}
	
	/*
	 * --------------------------------------------------
	 * Committed Giving Functions - functions specific to committed giving payments
	 * --------------------------------------------------
	 */
	
	/**
	 * Retreive the paypal vars needed to send to the gatway to proceed with payment
	 * @param EM_Booking $EM_Booking
	 */
	function get_committed_giving_vars($EM_Booking){
		global $wp_rewrite, $EM_Notices;
		$notify_url = $this->get_payment_return_url();

		$id = $EM_Booking->booking_id;
		$EM_Booking = em_get_booking($id);
		
		// if( get_class($EM_Booking) == 'EM_Multiple_Booking' ){
		//     //This is a Multiple Booking object
		// 	$event = "Multiple Event Booking";
		// } else {
		// 	$event = "Single Event Booking";
		// }
		$args['event'] = $EM_Booking->event_id;
    	$args = apply_filters('em_content_events_args', $args);
		$EM_Event = EM_Events::get($args);
		
		$event = $EM_Event->event_name;

		foreach($EM_Event as $ev) {
			$event = $ev->event_name;
		}
		
		$committed_giving_vars = array(
			'title' => '',
			'firstname' => $EM_Booking->get_person()->first_name,
			'surname' => $EM_Booking->get_person()->last_name,
			'phone' => '',
			'email' => $EM_Booking->get_person()->user_email,
			'address1' => EM_Gateways::get_customer_field('address', $EM_Booking),
			'address2' => EM_Gateways::get_customer_field('address_2', $EM_Booking),
			'address3' => EM_Gateways::get_customer_field('city', $EM_Booking),
			'address4' => EM_Gateways::get_customer_field('state', $EM_Booking),
			'address5' => '',
			'address6' => '',
			'postcode' => EM_Gateways::get_customer_field('zip', $EM_Booking),
			'country' => EM_Gateways::get_customer_field('country', $EM_Booking),
			'events' => $event,
			'orderref' => $EM_Booking->booking_id,
			'orderamount' => '',
			'returnurl' => get_option('em_'. $this->gateway . "_return" ),
			'returnurlfail' => get_option('em_'. $this->gateway . "_cancel_return" )

		);
		
		$count = 1;
		$price= 0;
		foreach( $EM_Booking->get_tickets_bookings()->tickets_bookings as $EM_Ticket_Booking ){ /* @var $EM_Ticket_Booking EM_Ticket_Booking */
		    //divide price by spaces for per-ticket price
		    //we divide this way rather than by $EM_Ticket because that can be changed by user in future, yet $EM_Ticket_Booking will change if booking itself is saved.
		 	$tmpPrice = $EM_Ticket_Booking->get_price_with_taxes();
		 	if( $tmpPrice > 0 ){
				$price += round($tmpPrice,2);
			 	$count++;
			}
		}
		$committed_giving_vars['orderamount'] = $price;
		return apply_filters('em_gateway_committed_giving_get_committed_giving_vars', $committed_giving_vars, $EM_Booking, $this);
	}
	
	/**
	 * gets paypal gateway url (sandbox or live mode)
	 * @returns string 
	 */
	function get_committed_giving_url(){
		return  'https://www.committedgiving.uk.net/mdaukpublic/pay.aspx';
	}
	
	function say_thanks(){
		if( !empty($_REQUEST['thanks']) ){
			echo "<div class='em-booking-message em-booking-message-success'>".get_option('em_'.$this->gateway.'_booking_feedback_completed').'</div>';
		}
	}

	/**
	 * Runs when PayPal sends IPNs to the return URL provided during bookings and EM setup. Bookings are updated and transactions are recorded accordingly. 
	 */
	function handle_payment_return() {
		if(isset($_GET['details']) && isset($_GET['result']) && isset($_GET['orderref']) && isset($_GET['reference'])) {
    
		    $result = $_GET['result'];
		    $details = $_GET['details'];
		    $orderRef = $_GET['orderref'];
		    $reference = $_GET['reference'];
		    
		    $EM_Booking = em_get_booking($orderRef);
		    $EM_Booking->manage_override = true; //since we're overriding the booking ourselves.
			
		    //check result
		    if($result == "Successful") {
			//display success message
			global $EM_Event;
			$event = $EM_Booking->get_event();
			echo '<div class="clearfix alert alert-success" role="alert">'.do_shortcode('[event post_id="'.$event->post_id.'"]Your booking to the event <b>#_EVENTNAME</b> was successful[/event]').'</div>';
			//update booking record
			
			$user_id = $EM_Booking->person_id;
			// case: successful payment
			$this->record_transaction($EM_Booking, $amount, $currency, $timestamp, $reference, $result, '');

			$EM_Booking->approve(true, true); //approve and ignore spaces

			
		    } else {
			$EM_Booking->set_status(0); //Set back to normal "pending"
		       //display error message
		       echo '<div class="clearfix alert alert-danger" role="alert">Something went wrong, please contact us at <a href="mailto:info@mdauk.org">info@mdauk.org</a> if you have any issues"</div>';
		    }
		    do_action('em_payment_processed', $EM_Booking, $this);
		} 
	}
	
	/**
	 * Fixes SSL issues with wamp and outdated server installations combined with curl requests by forcing a custom pem file, generated from - http://curl.haxx.se/docs/caextract.html
	 * @param resource $handle
	 */
	public static function payment_return_local_ca_curl( $handle ){
	    curl_setopt($handle, CURLOPT_CAINFO, dirname(__FILE__).DIRECTORY_SEPARATOR.'gateway.paypal.pem');
	}
	/*
	 * --------------------------------------------------
	 * Gateway Settings Functions
	 * --------------------------------------------------
	 */
	
	/**
	 * Outputs custom PayPal setting fields in the settings page 
	 */
	function mysettings() {
		global $EM_options;
		?>
		<table class="form-table">
		<tbody>
		  <?php em_options_input_text( esc_html__('Success Message', 'em-pro'), 'em_'. $this->gateway . '_booking_feedback', esc_html__('The message that is shown to a user when a booking is successful whilst being redirected to Committed Giving for payment.','em-pro') ); ?>
		  <?php em_options_input_text( esc_html__('Success Free Message', 'em-pro'), 'em_'. $this->gateway . '_booking_feedback_free', esc_html__('If some cases if you allow a free ticket (e.g. pay at gate) as well as paid tickets, this message will be shown and the user will not be redirected to Committed Giving.','em-pro') ); ?>
		  <?php em_options_input_text( esc_html__('Thank You Message', 'em-pro'), 'em_'. $this->gateway . '_booking_feedback_completed', esc_html__('If you choose to return users to the default Events Manager thank you page after a user has paid on Committed Giving, you can customize the thank you message here.','em-pro') ); ?>
		</tbody>
		</table>
		
		<h3><?php echo sprintf(__('%s Options','em-pro'),'Committed Giving'); ?></h3>
		<p><strong><?php _e('Important:','em-pro'); ?></strong> <?php echo __('In order to connect Committed Giving with your site, you need to enable IPN on your account.'); echo " ". sprintf(__('Your return url is %s','em-pro'),'<code>'.$this->get_payment_return_url().'</code>'); ?></p> 
		<p><?php echo sprintf(__('Please visit the <a href="%s">documentation</a> for further instructions.','em-pro'), 'http://wp-events-plugin.com/documentation/'); ?></p>
		<table class="form-table">
		<tbody>
		  <tr valign="top">
			  <th scope="row"><?php _e('Committed Giving Email', 'em-pro') ?></th>
				  <td><input type="text" name="em_committed_giving_email" value="<?php esc_attr_e( get_option('em_'. $this->gateway . "_email" )); ?>" />
				  <br />
			  </td>
		  </tr>
		  <tr valign="top">
			  <th scope="row"><?php _e('Committed Giving Currency', 'em-pro') ?></th>
			  <td><?php echo esc_html(get_option('dbem_bookings_currency','USD')); ?><br /><i><?php echo sprintf(__('Set your currency in the <a href="%s">settings</a> page.','em-pro'),EM_ADMIN_URL.'&amp;page=events-manager-options#bookings'); ?></i></td>
		  </tr>
		  
		  <?php em_options_radio_binary(__('Include Taxes In Itemized Prices', 'em-pro'), 'em_'. $this->gateway .'_inc_tax', __('If set to yes, taxes are not included in individual item prices and total tax is shown at the bottom. If set to no, taxes are included within the individual prices.','em-pro'). ' '. __('We strongly recommend setting this to No.','em-pro') .' <a href="http://wp-events-plugin.com/documentation/events-with-paypal/paypal-displaying-taxes/">'. __('Click here for more information.','em-pro')) .'</a>'; ?>
		  
		  <tr valign="top">
			  <th scope="row"><?php _e('Committed Giving Language', 'em-pro') ?></th>
			  <td>
			  	<select name="em_commited_giving_lc">
			  		<option value=""><?php _e('Default','em-pro'); ?></option>
				  <?php
					$ccodes = em_get_countries();
					$committed_giving_lc = get_option('em_'.$this->gateway.'_lc', 'US');
					foreach($ccodes as $key => $value){
						if( $committed_giving_lc == $key ){
							echo '<option value="'.$key.'" selected="selected">'.$value.'</option>';
						}else{
							echo '<option value="'.$key.'">'.$value.'</option>';
						}
					}
				  ?>
				  
				  </select>
				  <br />
				  <i><?php _e('Committed Giving allows you to select a default language users will see. This is also determined by Committed Giving which detects the locale of the users browser. The default would be US.','em-pro') ?></i>
			  </td>
		  </tr>
		  <tr valign="top">
			  <th scope="row"><?php _e('Committed Giving Mode', 'em-pro') ?></th>
			  <td>
				  <select name="em_committed_giving_status">
					  <option value="live" <?php if (get_option('em_'. $this->gateway . "_status" ) == 'live') echo 'selected="selected"'; ?>><?php _e('Live Site', 'em-pro') ?></option>
					  <option value="test" <?php if (get_option('em_'. $this->gateway . "_status" ) == 'test') echo 'selected="selected"'; ?>><?php _e('Test Mode (Sandbox)', 'em-pro') ?></option>
				  </select>
				  <br />
			  </td>
		  </tr>
		  <tr valign="top">
			  <th scope="row"><?php _e('Return URL', 'em-pro') ?></th>
			  <td>
			  	<input type="text" name="em_committed_giving_return" value="<?php esc_attr_e(get_option('em_'. $this->gateway . "_return" )); ?>" style='width: 40em;' /><br />
			  	<em><?php _e('Once a payment is completed, users will be offered a link to this URL which confirms to the user that a payment is made. If you would to customize the thank you page, create a new page and add the link here. For automatic redirect, you need to turn auto-return on in your Committed Giving settings.', 'em-pro'); ?></em>
			  </td>
		  </tr>
		  <tr valign="top">
			  <th scope="row"><?php _e('Cancel URL', 'em-pro') ?></th>
			  <td>
			  	<input type="text" name="em_committed_giving_cancel_return" value="<?php esc_attr_e(get_option('em_'. $this->gateway . "_cancel_return" )); ?>" style='width: 40em;' /><br />
			  	<em><?php _e('Whilst paying on Committed Giving, if a user cancels, they will be redirected to this page.', 'em-pro'); ?></em>
			  </td>
		  </tr>
		  <tr valign="top">
			  <th scope="row"><?php _e('Committed Giving Page Logo', 'em-pro') ?></th>
			  <td>
			  	<input type="text" name="em_committed_giving_format_logo" value="<?php esc_attr_e(get_option('em_'. $this->gateway . "_format_logo" )); ?>" style='width: 40em;' /><br />
			  	<em><?php _e('Add your logo to the Committed Giving payment page. It\'s highly recommended you link to a https:// address.', 'em-pro'); ?></em>
			  </td>
		  </tr>
		  <tr valign="top">
			  <th scope="row"><?php _e('Border Color', 'em-pro') ?></th>
			  <td>
			  	<input type="text" name="em_committed_giving_format_border" value="<?php esc_attr_e(get_option('em_'. $this->gateway . "_format_border" )); ?>" style='width: 40em;' /><br />
			  	<em><?php _e('Provide a hex value color to change the color from the default blue to another color (e.g. #CCAAAA).','em-pro'); ?></em>
			  </td>
		  </tr>
		  <tr valign="top">
			  <th scope="row"><?php _e('Delete Bookings Pending Payment', 'em-pro') ?></th>
			  <td>
			  	<input type="text" name="em_committed_giving_booking_timeout" style="width:50px;" value="<?php esc_attr_e(get_option('em_'. $this->gateway . "_booking_timeout" )); ?>" style='width: 40em;' /> <?php _e('minutes','em-pro'); ?><br />
			  	<em><?php _e('Once a booking is started and the user is taken to Committed Giving, Events Manager stores a booking record in the database to identify the incoming payment. These spaces may be considered reserved if you enable <em>Reserved unconfirmed spaces?</em> in your Events &gt; Settings page. If you would like these bookings to expire after x minutes, please enter a value above (note that bookings will be deleted, and any late payments will need to be refunded manually via Committed Giving).','em-pro'); ?></em>
			  </td>
		  </tr>
		  <tr valign="top">
			  <th scope="row"><?php _e('Manually approve completed transactions?', 'em-pro') ?></th>
			  <td>
			  	<input type="checkbox" name="em_committed_giving_manual_approval" value="1" <?php echo (get_option('em_'. $this->gateway . "_manual_approval" )) ? 'checked="checked"':''; ?> /><br />
			  	<em><?php _e('By default, when someone pays for a booking, it gets automatically approved once the payment is confirmed. If you would like to manually verify and approve bookings, tick this box.','em-pro'); ?></em><br />
			  	<em><?php echo sprintf(__('Approvals must also be required for all bookings in your <a href="%s">settings</a> for this to work properly.','em-pro'),EM_ADMIN_URL.'&amp;page=events-manager-options'); ?></em>
			  </td>
		  </tr>
		</tbody>
		</table>
		<?php
	}

	/* 
	 * Run when saving Committed Giving settings, saves the settings available in EM_Gateway_Committed_Giving::mysettings()
	 */
	function update() {
	    $gateway_options = $options_wpkses = array();
		$gateway_options[] = 'em_'. $this->gateway . '_email';
		$gateway_options[] = 'em_'. $this->gateway . '_site';
		$gateway_options[] = 'em_'. $this->gateway . '_currency';
		$gateway_options[] = 'em_'. $this->gateway . '_inc_tax';
		$gateway_options[] = 'em_'. $this->gateway . '_lc';
		$gateway_options[] = 'em_'. $this->gateway . '_status';
		$gateway_options[] = 'em_'. $this->gateway . '_format_logo';
		$gateway_options[] = 'em_'. $this->gateway . '_format_border';
		$gateway_options[] = 'em_'. $this->gateway . '_manual_approval';
		$gateway_options[] = 'em_'. $this->gateway . '_booking_timeout';
		$gateway_options[] = 'em_'. $this->gateway . '_return';
		$gateway_options[] = 'em_'. $this->gateway . '_cancel_return';
		//add wp_kses filters for relevant options and merge in
		$options_wpkses[] = 'em_'. $this->gateway . '_booking_feedback';
		$options_wpkses[] = 'em_'. $this->gateway . '_booking_feedback_free';
		$options_wpkses[] = 'em_'. $this->gateway . '_booking_feedback_completed';
		foreach( $options_wpkses as $option_wpkses ) add_filter('gateway_update_'.$option_wpkses,'wp_kses_post');
		$gateway_options = array_merge($gateway_options, $options_wpkses);
		//pass options to parent which handles saving
		return parent::update($gateway_options);
	}
}
EM_Gateways::register_gateway('committed_giving', 'EM_Gateway_Committed_Giving');

?>