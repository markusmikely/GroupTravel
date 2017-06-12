<?php
	

	if(isset($_POST['post_type']) && $_POST['post_type'] == 'sendContact') {

		//send contact message
		// get data

		$contact = array(
			'name' => $_POST['name'], 
			'email' => $_POST['email'], 
			'subject' => $_POST['subject'], 
			'message' =>  $_POST['message'], 
		); 

		// // send email
		$to = "info@xpozure.org.uk";
		$subject = $contct['subject'];
		$txt = 'From: '.$contact['name'].':'.$contact['email'].' '.$contact['message'];
		$headers = "From: webmasetr@xpozure.org.uk" . "\r\n" .
		"CC: markusmikely@gmail.com";

		mail($to,$subject,$txt,$headers);

		$result =  array(
			'status' => 200,
			'message' => 'Contact message sent successfully'	
		);

		return json_encode($result);
	
	} else {

		$error = array(
			'status' => 500,
			'error' => 'Invalid post request'	
		);

		return json_encode($error);
	}

			
?>