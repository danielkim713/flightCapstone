let google_url = 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=';
let api_key = 'AIzaSyAtDSnmVSyt7-55EYpE1milbl1KvwXrGGA';


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
	let body = {
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

	let headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
	};

	fetch(google_url + api_key, 
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
