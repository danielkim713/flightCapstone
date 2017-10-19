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
        let results = [];

        let tripObject = {
            goingThere: [],
            comingBack: [],
            price: null
        }

        let flight = {
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
                    flight.arrivalTime = data.trips.tripOption[i].slice[j].segment[k].leg[0].arrivalTime;
                    flight.departureTime = data.trips.tripOption[i].slice[j].segment[k].leg[0].departureTime;
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
        //console.log(results);
        populateResults(results);
    }).catch(function(err) {
        console.log(err);
    });
}

function populateResults(results) {
    for (i = 0; i < results.length; i++) {
        for (j = 0; j < results[i].goingThere.length; j++) {
            let result = '<div data-key="tripObject' + i + 'flight' + j + '">'+ results[i][j].flightNumber + ' ' + results[i][2].price + ' ' + results[i][j].departureTime + ' ' + results[i][j].arrivalTime + ' </div>'
            $('.js-search-results').append(result);
      }
        for (k = 0; k < results[i].comingBack.length;k++) {
            let result = '<div data-key="tripObject' + i + 'flight' + j + '">'+ results[i][j].flightNumber + ' ' + results[i][2].price + ' ' + results[i][j].departureTime + ' ' + results[i][j].arrivalTime + ' </div>'
            $('.js-search-results').append(result);
      }
        let result = price
        $('.js-search-results').append(result);
    }
}
   // for (let i = 0; i < results.length; i++) {
   //     for (let j = 1; j >= 0; j--) {
   //         let result = '<div data-key="tripObject' + i + 'flight' + j + '">'+ results[i][j].flightNumber + ' ' + results[i][2].price + ' ' + results[i][j].departureTime + ' ' + results[i][j].arrivalTime + ' </div>'
   //         $('.js-search-results').append(result);
   //     }
   // }
   //}

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