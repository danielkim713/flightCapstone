function displayOptions(){
	$(".parameters").on("submit" , function(e) {
		e.preventDefault();
		$(this).children('input[type=submit]').prop('disabled', true);
		if ($('input[type=text]').value === "") {
			console.log("REQUIRED");
		}
			else {
			searchFlights();
		}
	});
}

function fetchData () {
	var body = {
		request: {
			passengers: {
				kind: 'qpxexpress#passengerCounts',
				adultCount: 1
			},
			slice: [
				{
					kind: 'qpxexpress#sliceInput',
					origin: 'LAX',
					destination: 'BOS',
					date: '2017-10-20',
				}
			]
		}
	};

	var headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
	};

	fetch('https://www.googleapis.com/qpxExpress/v1/trips/search?key=' + 'AIzaSyAtDSnmVSyt7-55EYpE1milbl1KvwXrGGA', 
		{
			headers: headers,
			method: 'POST',
			body: JSON.stringify(body)
		}
	).then(function(response) {
		return response.json();
	}).then(function(data) {
		console.log(data);
	});
}

$(document).ready(function() {
    fetchData();
});
