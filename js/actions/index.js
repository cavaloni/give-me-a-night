//fetch foursquare
//fetch fandango
//fetch bandsintown
//fetch eventbrite
//success and failures for each of these
//search to update state to search values

import fetch from 'isomorphic-fetch';
import moment from 'moment';

import oauthSignature from 'oauth-signature';  
import n from 'nonce';  
import qs from 'querystring';  
import _ from 'lodash';
import fetchJsonp from 'fetch-jsonp';
import geocoder from 'geocoder-geojson'
// var Autocomplete = require('google-places-browser/autocomplete');
// var Places = require('google-places-browser/places');

// var autocomplete = Autocomplete(window.google);
// var places = Places(window.google);
const google = window.google;
var autocomplete = new google.maps.places.AutocompleteService();

var document = require('global/document');
var element = document.createElement('div')
var places = new google.maps.places.PlacesService(element)



const nn = n();

export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const fetchSuccess = (results, provider) => ({
    type: FETCH_SUCCESS,
    results,
    provider
});

export const FETCH_FAILURE = 'FETCH_FAILURE';
export const fetchFailure = (err, provider) => ({
    type: FETCH_FAILURE,
    err,
    provider
});

export const SEARCH_VALUES = 'SEARCH_VALUES';
export const search = (loc, feel) => ({
    type: SEARCH_VALUES,
    loc,
    feel
})

export const RETURN_NEW_PHOTO = 'RETURN_NEW_PHOTO';
export const returnNewPhoto = (photo, id) => ({
    type: RETURN_NEW_PHOTO,
    photo,
    id
})

export const fetchZomato = (loc, feel) => dispatch => {
    let query;
    let order;
    const city = loc.split(/[ ,]+/);
    const cityQuery = city.map(item => {
        if (item == undefined) {
            return ''
        } else {
            return item
        }
    })

    // const cQuery = 

    let cityGeo;

    new Promise((resolve, reject) => {
        geocoder.google(loc).then((response) => {
            console.log('geo encoder responts', response)
            cityGeo = response;
            resolve();
        })
    }).then(() => {

        const cGeo = { 
            long: cityGeo.features[0].geometry.coordinates[0], 
            lat: cityGeo.features[0].geometry.coordinates[1]
        }

        if (feel == 'crazy') {
            query = 'mexican';
        } else if (feel = 'fun') {
            query = 'indian';
        } else if (feel = 'laid back') {
            query = 'cafe';
        } else if (feel = 'unique') {
            query = 'dinner';
            order = 'cost';
        }
        if (order === undefined) {
            order = 'rating';
        }
        const url = `https://developers.zomato.com/api/v2.1/search?&q=${query}&lon=${cGeo.long}&lat=${cGeo.lat}&sort=${order}`
        //balls
        return fetch(url, {
            headers: {
                'X-Zomato-API-Key': `78be78c81e2efb35f45588e55478c59f`,
                "Content-Type": "text/plain; charset=utf-8",
                'Accept': 'text/plain; charset=utf-8'
            }
        }).then((data) => {
            return data.json();
        }).then(response => {
            console.log('zomatoes results', response);
            dispatch(fetchSuccess(response.restaurants, 'zomatoResults'))
        }).catch(err => {
            console.log(err);
        })
    })
}
//butt
export const fetchImages = (data, name, id) => dispatch => {
    let placeID = '';
    autocomplete.getPlacePredictions({input: data + ' ' + name}, function (results, status) {
        console.log(results);
        placeID = results[0].place_id;
        console.log(placeID);
        places.getDetails({placeId: placeID}, function (results, status) {  
            console.log(results);
            const photo = results.photos[0].getUrl({'maxWidth': 300, 'maxHeight': 300})
            dispatch(returnNewPhoto(photo, id))
        })
    });
}

export const fetchMovies = (loc, feel) => dispatch => {
    let query;
    if (feel == 'crazy') {
        query = '&certification_country=US&certification=R&sort_by=vote_average.desc';
    } else if (feel = 'fun') {
        query = '&certification_country=US&certification=PG&sort_by=vote_average.desc';
    } else if (feel = 'laid back') {
        query = '&certification_country=US&certification=PG13&sort_by=vote_average.desc';
    } else if (feel = 'unique') {
        query = '&sort_by=popularity.asc'
    }
 
    const date = moment().format('YYYY-MM-DD');
    const toDate = moment().subtract(2, 'months').format('YYYY-MM-DD');
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=78a549a366831e6da5647a51ebe710d9&primary_release_date.gte=${toDate}&primary_release_date.lte=${date}${query}`
    
    return fetch(url)
    .then((data) => {
        return data.json();
    }).then(response => {
        console.log(response);
        dispatch(fetchSuccess(response.results, 'movieResults'))
    }).catch(err => {
        console.log(err);
    })
}

export const fetchBandsInTown = (loc, feel) => dispatch => {
    let query;
    const city = loc.split(/[ ,]+/);
    const cityQuery = city.map(item => {
        if (item == undefined) {
            return ''
        } else {
            return item
        }
    })

    if (feel == 'crazy') {
        query = 'dance';
    } else if (feel = 'fun') {
        query = 'rock';
    } else if (feel = 'laid back') {
        query = 'guitar';
    } else if (feel = 'unique') {
        query = 'jazz'
    }

    const dateNow = moment().format('YYYY-MM-DD');
    const oArgs = {
      app_key: 'HkqR6GDf6r2P4h23' ,
      keywords: query,
      within: 30,
      where: loc,
      "date": dateNow,
      page_size: 5,
      sort_order: "popularity",
   };
   return EVDB.API.call("/events/search", oArgs, function(oData) {
       console.log(oData);
       dispatch(fetchSuccess(oData.events.event, 'bitResults'));
   })
}

export const fetchEventBrite = (loc, feel) => dispatch => {
    console.log(feel);
    
    let query;
    let catQuery;
    let counter = 0;

    const city = loc.split(/[ ,]+/);
    const cityQuery = city.map(item => {
        if (item == undefined) {
            return ''
        } else {
            return item
        }
    })

    if (feel == 'crazy') {
        query = '105%2C108%2C110';
    } else if (feel == 'fun') {
        query = '113%2C105';
    } else if (feel == 'laid-back') {
        query = '107%2C109';
    } else if (feel == 'unique') {
        query = '114%2C102';
    } 
    if (query) {
        catQuery = `categories=${query}&`;
    } else {
        catQuery = '';
    }
    console.log(query);
    console.log(catQuery);
    const url = `https://www.eventbriteapi.com/v3/events/search/?location.address=${cityQuery[0]}+${cityQuery[1]}%2C+${cityQuery[2]}&location.within=30mi&${catQuery}start_date.keyword=today&token=6SVNTPUPXW5HGNKP5ZGW`

    return fetch(url, {
        "data": {
            "near": city
  }
    }).then((data) => {
        return data.json();
    }).then(response => {
        console.log(response.events);
        if (!response.events.length && counter < 1) {
            counter++
            dispatch(fetchEventBrite(loc))
        }
        dispatch(fetchSuccess(response.events, 'ebResults'))
    }).catch(err => {
        console.log(err);
    })
}




/* Function for yelp call
 * ------------------------
 * set_parameters: object with params to search
 * callback: callback(error, response, body)
 */
export const fetchZomatos = (loc, feel) => dispatch => {
    const city = loc.split(/[ ,]+/);
    const cityQuery = city.map(item => {
        if (item == undefined) {
            return ''
        } else {
            return item
        }
    })

    

    let query;
    if (feel == 'crazy') {
        query = 'mexican';
    } else if (feel = 'fun') {
        query = 'indian';
    } else if (feel = 'laid back') {
        query = 'cafe';
    } else if (feel = 'unique') {
        query = 'dinner';
    }

    

    const set_parameters = {
        term: query,
        location: `${cityQuery[0]}+${cityQuery[1]}+${cityQuery[2]}`
    }

    /* The type of request */
    var httpMethod = 'GET';

    /* The url we are using for the request */
    var url = 'http://api.yelp.com/v2/search';

    /* We can setup default parameters here */
    var default_parameters = {
        location: 'San+Francisco',
        sort: '2'
    };

    /* We set the require parameters here */
    var required_parameters = {
        oauth_consumer_key: '90pqj46kzLBYNMlCJVz7jA',
        oauth_token: 'V39KlRwQsE4Muw93eEiv6h-VwT9ICrKh',
        oauth_nonce: nn(),
        oauth_timestamp: nn().toString().substr(0, 10),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_version: '1.0'
    };

    /* We combine all the parameters in order of importance */
    var parameters = _.assign(default_parameters, set_parameters, required_parameters);

    /* We set our secrets here */
    var consumerSecret = 'DJFwzo5zMrm29glQnyJ3kky7h9k';
    var tokenSecret = 'Y15jkufJYR99XYL3mDB7kaC9oUM';

    /* Then we call Yelp's Oauth 1.0a server, and it returns a signature */
    /* Note: This signature is only good for 300 seconds after the oauth_timestamp */
    var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, {
        encodeSignature: false
    });

    /* We add the signature to the list of paramters */
    parameters.oauth_signature = signature;

    /* Then we turn the paramters object, to a query string */
    var paramURL = qs.stringify(parameters);

    /* Add the query string to the url */
    var apiURL = url + '?' + paramURL;
    function custom_callback() {  
        console.log('this happened');
    }
    /* Then we use request to send make the API Request */
    return fetch(apiURL, {
     
    }).then((data) => {
        return data.json();
    }).then(response => {
        console.log(response);
        dispatch(fetchSuccess(response, 'zomatoResults'))
    }).catch(err => {
        console.log(err);
    })

};