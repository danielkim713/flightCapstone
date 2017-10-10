function displayOptions(){
	$(".parameters").on("submit" , function(e)) {
		e.preventDefault();
		$(this).children('input[type=submit]').prop('disabled', true);
		if ($('input[type=text]').value === "") {
			console.log("REQUIRED");
		}
			else {
			searchFlights();
		}
	}
}

$(function(){
    var dtToday = new Date();
    
    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();
    if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();
    
    var minDate= year + '-' + month + '-' + day;
    
    $('#id').attr('min', minDate);
});

function();
