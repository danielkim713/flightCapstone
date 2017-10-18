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

        var tripObject = {
            goingThere: [],
            comingBack: [],
            price: null
        }

        var flight = {
            price: null,
            flightNumber: null,
            arrivalTime: null,
            departureTime: null
        };

        for (let i = 0; i <= 50; i+=10) {
            console.log(i);
            tripObject.price = data.trips.tripOption[i].saleTotal
            for (let j = 0; j < data.trips.tripOption[i].slice.length; j++) {
                for (let k = 0; k < data.trips.tripOption[i].slice[j].segment.length; k++) {
                    flight.flightNumber = data.trips.tripOption[i].slice[j].segment[k].flight.carrier + data.trips.tripOption[i].slice[j].segment[k].flight.number;
                    flight.arrivalTime = data.trips.tripOption[i].slice[j].segment[k].leg[0].arrivalTime
                    flight.departureTime = data.trips.tripOption[i].slice[j].segment[k].leg[0].departureTime
                    if (j === 0) {
                        tripObject.goingThere.push(flight);
                    } else if (j === 1) {
                        tripObject.comingBack.push(flight);
                    } 

                    flight = {
                        price: null,
                        flightNumber: null,
                        arrivalTime: null,
                        departureTime: null
                    };
                }
            };
            results.push(tripObject);
            tripObject = {
                goingThere: [],
                comingBack: [],
                price: null
            } 
        };
        populateResults(results);
    }).catch(function(err) {
        console.log(err);
    });
}

function populateResults(results) {
    for (let i = 0; i < results.length; i++) {
        for (let j = 0; j < results[i].length; j++) {
            for (let i=0; i < goingThere.length; i++) {
                let result = '<div data-key="trip' + i + 'flight' + j + '">'+ results[i][j].flightNumber + ' ' + results[i][j].price + ' ' + results[i][j].departureTime + ' ' + results[i][j].arrivalTime + ' </div>'
                $('.js-search-results').append(result);
            }
            for (let i=0; i < comingBack.length; i++){
                let result = '<div data-key="trip' + i + 'flight' + j + '">'+ results[i][j].flightNumber + ' ' + results[i][j].price + ' ' + results[i][j].departureTime + ' ' + results[i][j].arrivalTime + ' </div>'
                $('.js-search-results').append(result);               
            }
        }
    }
}

$(document).ready(function() {
    $("button").click(function(){
          $(".flight-intro").hide();
    });

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