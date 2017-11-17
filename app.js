let google_url = 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=';
let api_key = 'AIzaSyAtDSnmVSyt7-55EYpE1milbl1KvwXrGGA';

let cCities = [
    {label: "Chicago (ORD)", value: "ORD"},
    {label: "Los Angeles (LAX)", value: "LAX"},
    {label: "Boston (BOS)", value: "BOS"},
    {label: "Seoul (ICN)", value: "ICN"},
    {label: "Beijing (PEK)", value: "PEK"},
    {label: "London (LHR)", value: "LHR"},
    {label: "Tokyo (NRT)", value: "NRT"},
    {label: "Paris (CDG)", value: "CDG"},
    {label: "Frankfurt (FRA)", value: "FRA"},
    {label: "Hong Kong (HKG)", value: "HKG"},
    {label: "Denver (DEN)", value: "DEN"},
    {label: "Dubai (DXB)", value: "DXB"},
    {label: "Amsterdam (AMS)", value: "AMS"},
    {label: "Madrid (MAD)", value: "MAD"},
    {label: "Bangkok (BKK)", value: "BKK"},
    {label: "New York (JFK)", value: "JFK"},
    {label: "Singapore (SIN)", value: "SIN"},
    {label: "Shanghai (PVG)", value: "PVG"},
    {label: "San Francisco (SFO)", value: "SFO"},
    {label: "Miami (MIA)", value: "MIA"},
    {label: "Munich (MUC)", value: "MUC"},
    {label: "Rome (FCO)", value: "FCO"},
    {label: "Sydney (SYD)", value: "SYD"},
    {label: "London (LGW)", value: "LGW"},
    {label: "Seoul (GIM)", value: "GIM"},
    {label: "Tokyo (ZRH)", value: "ZRH"},
    {label: "Copenhagen (CPH)", value: "CPH"},
    {label: "Washington D.C. (IAD)", value: "IAD"},
    {label: "Brussels (BRU)", value: "BRU"},
    {label: "Vancouver BC (YVR)", value: "YVR"},
    {label: "Berlin (TXL)", value: "TXL"},
    {label: "Sao Paulo (GRU)", value: "GRU"},
    {label: "Rio De Janeiro (GIG)", value: "GIG"},
    {label: "Lisbon (LIS)", value: "LIS"},
    {label: "Athens (ATH)", value: "ATH"},
    {label: "Tampa (TPA)", value: "TPA"},
    {label: "Grand Rapids (GRR)", value: "GRR"},
    {label: "Helsinki (HEL)", value: "HEL"},
    {label: "Auckland (AKL)", value: "AKL"},
    {label: "Reykjavik (KEF)", value: "KEF"},
    {label: "Nairobi (NBO)", value: "NBO"}
];


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
        $(".buttonload").html('Search Again');
        $(".js-search-results").removeClass('hidden');

    }).catch(function(err) {
        console.log(err);
        $(".buttonload").html('Sorry, no flights found! Try again!')
        $(".buttonload").css("background-color","red")
    });
}

function populateResults(results) {
    let result0 = results[0].price   
        $('.price0').append(result0);
        for (j = 0; j < results[0].goingThere.length; j++) {
            let result = '<div data-key="tripObject' + 0 + 'flight' + results[0].goingThere[j].flightNumber + '">' + "Flight Number:" + ' ' + results[0].goingThere[j].flightNumber + ' ' + "Departure Time:" + ' ' + results[0].goingThere[j].departureTime.split('').slice(0,10).join('') + ' ' + militarytoAMPM(results[0].goingThere[j].departureTime.split('').slice(11,16).join('')) + ' ' + "-" + ' '+ militarytoAMPM(results[0].goingThere[j].arrivalTime.split('').slice(11,16).join('')) + ' </div>'
            $('.departure0').append(result);
      }
        for (k = 0; k < results[0].comingBack.length; k++) {
            let result = '<div class="tripFlight" data-key="tripObject' + 0 + 'flight' + results[0].comingBack[k].flightNumber + '">' + "Flight Number:" + ' ' + results[0].comingBack[k].flightNumber + ' ' + "Return Time:" + ' ' + results[0].comingBack[k].departureTime.split('').slice(0,10).join('') + ' ' + militarytoAMPM(results[0].comingBack[k].departureTime.split('').slice(11,16).join('')) + ' ' + "-" + ' '+ militarytoAMPM(results[0].comingBack[k].arrivalTime.split('').slice(11,16).join('')) + ' </div>'
            $('.arrival0').append(result);
      }
    let result1 = results[1].price   
        $('.price1').append(result1);
        for (j = 0; j < results[1].goingThere.length; j++) {
            let result = '<div data-key="tripObject' + 1 + 'flight' + results[1].goingThere[j].flightNumber + '">' + "Flight Number:" + ' ' + results[1].goingThere[j].flightNumber + ' ' + "Departure Time:" + ' ' + results[1].goingThere[j].departureTime.split('').slice(0,10).join('') + ' ' + militarytoAMPM(results[1].goingThere[j].departureTime.split('').slice(11,16).join('')) + ' ' + "-" + ' '+ militarytoAMPM(results[1].goingThere[j].arrivalTime.split('').slice(11,16).join('')) + ' </div>'
            $('.departure1').append(result);
      }
        for (k = 0; k < results[1].comingBack.length; k++) {
            let result = '<div class="tripFlight" data-key="tripObject' + 1 + 'flight' + results[1].comingBack[k].flightNumber + '">' + "Flight Number:" + ' ' + results[1].comingBack[k].flightNumber + ' ' + "Return Time:" + ' ' + results[1].comingBack[k].departureTime.split('').slice(0,10).join('') + ' ' + militarytoAMPM(results[1].comingBack[k].departureTime.split('').slice(11,16).join('')) + ' ' + "-" + ' '+ militarytoAMPM(results[1].comingBack[k].arrivalTime.split('').slice(11,16).join('')) + ' </div>'
            $('.arrival1').append(result);
      }
    let result2 = results[2].price   
        $('.price2').append(result2);
        for (j = 0; j < results[0].goingThere.length; j++) {
            let result = '<div data-key="tripObject' + 2 + 'flight' + results[2].goingThere[j].flightNumber + '">' + "Flight Number:" + ' ' + results[2].goingThere[j].flightNumber + ' ' + "Departure Time:" + ' ' + results[2].goingThere[j].departureTime.split('').slice(0,10).join('') + ' ' + militarytoAMPM(results[2].goingThere[j].departureTime.split('').slice(11,16).join('')) + ' ' + "-" + ' '+ militarytoAMPM(results[2].goingThere[j].arrivalTime.split('').slice(11,16).join('')) + ' </div>'
            $('.departure2').append(result);
      }
        for (k = 0; k < results[0].comingBack.length; k++) {
            let result = '<div class="tripFlight" data-key="tripObject' + 2 + 'flight' + results[2].comingBack[k].flightNumber + '">' + "Flight Number:" + ' ' + results[2].comingBack[k].flightNumber + ' ' + "Return Time:" + ' ' + results[2].comingBack[k].departureTime.split('').slice(0,10).join('') + ' ' + militarytoAMPM(results[2].comingBack[k].departureTime.split('').slice(11,16).join('')) + ' ' + "-" + ' '+ militarytoAMPM(results[2].comingBack[k].arrivalTime.split('').slice(11,16).join('')) + ' </div>'
            $('.arrival2').append(result);
      }
    let result3 = results[3].price   
        $('.price3').append(result3);
        for (j = 0; j < results[3].goingThere.length; j++) {
            let result = '<div data-key="tripObject' + 3 + 'flight' + results[3].goingThere[j].flightNumber + '">' + "Flight Number:" + ' ' + results[3].goingThere[j].flightNumber + ' ' + "Departure Time:" + ' ' + results[3].goingThere[j].departureTime.split('').slice(0,10).join('') + ' ' + militarytoAMPM(results[3].goingThere[j].departureTime.split('').slice(11,16).join('')) + ' ' + "-" + ' '+ militarytoAMPM(results[3].goingThere[j].arrivalTime.split('').slice(11,16).join('')) + ' </div>'
            $('.departure3').append(result);
      }
        for (k = 0; k < results[3].comingBack.length; k++) {
            let result = '<div class="tripFlight" data-key="tripObject' + 3 + 'flight' + results[3].comingBack[k].flightNumber + '">' + "Flight Number:" + ' ' + results[3].comingBack[k].flightNumber + ' ' + "Return Time:" + ' ' + results[3].comingBack[k].departureTime.split('').slice(0,10).join('') + ' ' + militarytoAMPM(results[3].comingBack[k].departureTime.split('').slice(11,16).join('')) + ' ' + "-" + ' '+ militarytoAMPM(results[3].comingBack[k].arrivalTime.split('').slice(11,16).join('')) + ' </div>'
            $('.arrival3').append(result);
      }
    let result4 = results[4].price   
        $('.price4').append(result4);
        for (j = 0; j < results[4].goingThere.length; j++) {
            let result = '<div data-key="tripObject' + 4 + 'flight' + results[4].goingThere[j].flightNumber + '">' + "Flight Number:" + ' ' + results[4].goingThere[j].flightNumber + ' ' + "Departure Time:" + ' ' + results[4].goingThere[j].departureTime.split('').slice(0,10).join('') + ' ' + militarytoAMPM(results[4].goingThere[j].departureTime.split('').slice(11,16).join('')) + ' ' + "-" + ' '+ militarytoAMPM(results[4].goingThere[j].arrivalTime.split('').slice(11,16).join('')) + ' </div>'
            $('.departure4').append(result);
      }
        for (k = 0; k < results[4].comingBack.length; k++) {
            let result = '<div class="tripFlight" data-key="tripObject' + 4 + 'flight' + results[4].comingBack[k].flightNumber + '">' + "Flight Number:" + ' ' + results[4].comingBack[k].flightNumber + ' ' + "Return Time:" + ' ' + results[4].comingBack[k].departureTime.split('').slice(0,10).join('') + ' ' + militarytoAMPM(results[4].comingBack[k].departureTime.split('').slice(11,16).join('')) + ' ' + "-" + ' '+ militarytoAMPM(results[4].comingBack[k].arrivalTime.split('').slice(11,16).join('')) + ' </div>'
            $('.arrival4').append(result);
      }
    let result5 = results[5].price   
        $('.price5').append(result5);
        for (j = 0; j < results[0].goingThere.length; j++) {
            let result = '<div data-key="tripObject' + 5 + 'flight' + results[5].goingThere[j].flightNumber + '">' + "Flight Number:" + ' ' + results[5].goingThere[j].flightNumber + ' ' + "Departure Time:" + ' ' + results[5].goingThere[j].departureTime.split('').slice(0,10).join('') + ' ' + militarytoAMPM(results[5].goingThere[j].departureTime.split('').slice(11,16).join('')) + ' ' + "-" + ' '+ militarytoAMPM(results[5].goingThere[j].arrivalTime.split('').slice(11,16).join('')) + ' </div>'
            $('.departure5').append(result);
      }
        for (k = 0; k < results[0].comingBack.length; k++) {
            let result = '<div class="tripFlight" data-key="tripObject' + 5 + 'flight' + results[5].comingBack[k].flightNumber + '">' + "Flight Number:" + ' ' + results[5].comingBack[k].flightNumber + ' ' + "Return Time:" + ' ' + results[5].comingBack[k].departureTime.split('').slice(0,10).join('') + ' ' + militarytoAMPM(results[5].comingBack[k].departureTime.split('').slice(11,16).join('')) + ' ' + "-" + ' '+ militarytoAMPM(results[5].comingBack[k].arrivalTime.split('').slice(11,16).join('')) + ' </div>'
            $('.arrival5').append(result);
      }
}

function militarytoAMPM(militarytime) {
    militarytime = militarytime.split(':'); // convert to array

    // fetch
    var hours = Number(militarytime[0]);
    var minutes = Number(militarytime[1]);

    // calculate
    var timeValue;

    if (hours > 0 && hours <= 12)
    {
      timeValue= "" + hours;
    } else if (hours > 12)
    {
      timeValue= "" + (hours - 12);
    }
    else if (hours == 0)
    {
      timeValue= "12";
    }
     
    timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
    timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM

    // show
    return timeValue;
}


$(document).ready(function() {
    $("button").click(function(){
          $(".flight-intro").hide();
          $(".search").css("display", "block")
    });


    $('.autoSuggest').autocomplete({
        source: cCities
    });


    $('#myForm').submit(function() {
        event.preventDefault();

        $(".buttonload").html('<i class="fa fa-spinner fa-spin"></i> Searching for your flights so sit tight!');
        $(".buttonload").css("background-color","#4CAF50")

        let values = {};

        let $inputs = $('#myForm .form-input');

        $inputs.each(function() {
            values[this.name] = $(this).val();
        });
        fetchData(values);
    });
});