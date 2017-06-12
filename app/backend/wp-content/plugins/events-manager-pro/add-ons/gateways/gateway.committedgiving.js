//add paypal redirection
$(document).bind('em_booking_gateway_add_committed_giving', function(event, response){ 
	// called by EM if return JSON contains gateway key, notifications messages are shown by now.
	if(response.result){
		var cgForm = $('<form action="'+response.committed_giving_url+'" method="post" id="em-committed-giving-redirect-form"></form>');
		$.each( response.committed_giving_vars, function(index,value){
			cgForm.append('<input type="hidden" name="'+index+'" value="'+value+'" />');
		});
		cgForm.append('<input id="em-committed-giving-submit" type="submit" style="display:none" />');
		cgForm.appendTo('body').trigger('submit');
	}
});