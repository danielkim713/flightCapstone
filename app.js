let google_url = 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=';
let api_key = 'AIzaSyAtDSnmVSyt7-55EYpE1milbl1KvwXrGGA';

function fetchData(userInput) {
	let body = {
		request: {
			passengers: {
				kind: 'qpxexpress#passengerCounts',
				adultCount: userInput.passengers
			},
			slice: [
				{
					kind: 'qpxexpress#sliceInput',
					origin: userInput.origin.toUpperCase(),
					destination: userInput.destination.toUpperCase(),
					date: userInput.departure,
				},
                {
                    kind: 'qpxexpress#sliceInput',
                    origin: userInput.destination.toUpperCase(),
                    destination: userInput.origin.toUpperCase(),
                    date: userInput.arrival,
                }
			],
            maxPrice: 'USD' + userInput.budget.toString()
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
        var results = [];

        var dataArray = []

        var flightObject = {
            price: null,
            flightNumber: null,
            arrivalTime: null,
            departureTime: null
        };

		for (let i = 0; i <= 50; i+=10) {
            console.log(i);
            flightObject.price = data.trips.tripOption[i].saleTotal
            for (let j = 0; j < data.trips.tripOption[i].slice[1].segment.length; j++) {
                flightObject.flightNumber = data.trips.tripOption[i].slice[1].segment[j].flight.carrier + data.trips.tripOption[i].slice[1].segment[j].flight.number;
                flightObject.arrivalTime = data.trips.tripOption[i].slice[1].segment[j].leg[0].arrivalTime
                flightObject.departureTime = data.trips.tripOption[i].slice[1].segment[j].leg[0].departureTime
                dataArray.push(flightObject);

                flightObject = {
                    price: null,
                    flightNumber: null,
                    arrivalTime: null,
                    departureTime: null
                };
            };
            results.push(dataArray);
            dataArray = [];
        };
        populateResults(results);
	}).catch(function(err) {
        console.log(err);
    });
}

function populateResults(results) {
    for (let i = 0; i < results.length; i++) {
        console.log(results);
        for (let j = 0; j < results[i].length; j++) {
            let result = '<div data-key="trip' + i + 'flight' + j + '">'+ results[i][j].flightNumber + ' ' + results[i][j].price + ' ' + results[i][j].departureTime + ' ' + results[i][j].departureTime + ' </div>'
            $('.js-search-results').append(result);
        }
    }
}

$(document).ready(function() {
    $('#myForm').submit(function() {
        event.preventDefault();
        let values = {};

        let $inputs = $('#myForm .form-input');

        $inputs.each(function() {
            values[this.name] = $(this).val();
        });

        fetchData(values);
    });
});