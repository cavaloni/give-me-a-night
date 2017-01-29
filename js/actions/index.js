import fetch from 'isomorphic-fetch';
import moment from 'moment';
import geocoder from 'geocoder-geojson'

//google JS API
const google = window.google;
const autocomplete = new google.maps.places.AutocompleteService();
const document = require('global/document');
const element = document.createElement('div')
const places = new google.maps.places.PlacesService(element)


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

export const NO_RESULTS = 'NO_RESULTS';
export const noResults = provider => ({
    type: NO_RESULTS,
    provider
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

export const fetchImages = (data, name, id) => dispatch => {
    let placeID = '';
    autocomplete.getPlacePredictions({input: data + ' ' + name}, function (results, status) {
        if (status !== 'OK') {
            dispatch(returnNewPhoto('default', id))
            return
        }
        placeID = results[0].place_id;
        console.log(placeID);
        places.getDetails({placeId: placeID}, function (results, status) {  
            if(!results.photos) {
                dispatch(returnNewPhoto('default', id))
                return
            }
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
       if (!oData.events) {
           dispatch(noResults('bitResults'))
           return
       }
       dispatch(fetchSuccess(oData.events.event, 'bitResults'));
   })
}

export const fetchEventBrite = (loc, feel, attempt2) => dispatch => {
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
 
    let locationQuery;

    if (!cityQuery[2]) {
        locationQuery = `${cityQuery[0]}%2C+${cityQuery[1]}`
    } else {
        locationQuery = `${cityQuery[0]}+${cityQuery[1]}%2C+${cityQuery[2]}`
    }

    console.log(locationQuery);
    const url = `https://www.eventbriteapi.com/v3/events/search/?location.address=${locationQuery}&location.within=30mi&${catQuery}start_date.keyword=today&token=6SVNTPUPXW5HGNKP5ZGW`

    return fetch(url, {
        "data": {
            "near": city
  }
    }).then((data) => {
        return data.json();
    }).then(response => {
        console.log(response);
        console.log(response.events);
        console.log(!feel);
        if (response.events  === undefined && !attempt2) {
            console.log('-----------------------------');
            console.log('this happened');
            console.log(!feel);
            counter++
            return dispatch(fetchEventBrite(loc, null, true))
        }
        if (response.error && !feel) {
            console.log('-----------------------------');
            console.log('and then this happened');
            dispatch(noResults('ebResults'));
            return
        }
        dispatch(fetchSuccess(response.events, 'ebResults'))
    }).catch(err => {
        console.log(err);
    })
}
