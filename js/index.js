'use strict';

$('document').ready(function() {


	$('.input').keypress(function (e) {
	  if (e.which == 13) {
	    $('#myForm').submit();
	    return false;
	  }
	});

	$('#myForm').submit(function(e) {
		e.preventDefault();
		var val = $('input:text').val();
		$('#myForm').append(val);
	});

});

