//fetch foursquare
//fetch fandango
//fetch bandsintown
//fetch eventbrite
//success and failures for each of these
//search to update state to search values

import fetch from 'isomorphic-fetch';
import moment from 'moment';

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

export const fetchZomato = (loc, feel) => dispatch => {
    let query;
    let order;
    const city = loc.split(/[ ]+/);
    const cityQuery = city.map(item => {
        if (item == undefined) {
            return ''
        } else {
            return item
        }
    })
    if (feel == 'crazy') {
        query = 'nightlife';
    } else if (feel = 'fun') {
        query = 'drinks';
    } else if (feel = 'laid back') {
        query = 'cafe';
    } else if (feel = 'unique') {
        query = 'dinner';
        order = 'cost';
    }
    if (order == '') {
        order = 'rating';
    }
    const url = `https://developers.zomato.com/api/v2.1/search?entity_id=${cityQuery[0]}%2B${cityQuery[1]},${cityQuery[2]}&entity_type=city&q=${query}&radius=1500&sort=${order}`
    
    return fetch(url, {
        headers: {
            'user-key': `78be78c81e2efb35f45588e55478c59f`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
    ).then((data) => {
        return data.json();
    }).then(response => {
        console.log(response);
        dispatch(fetchSuccess(response, 'zomatoResults'))
    }).catch(err => {
        console.log(err);
    })
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
        dispatch(fetchSuccess(response, 'movieResults'))
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
        query = 'electronic';
    } else if (feel = 'fun') {
        query = 'rock';
    } else if (feel = 'laid back') {
        query = 'acoustic';
    } else if (feel = 'unique') {
        query = 'jazz'
    }

    const dateNow = moment().format('YYYY-MM-DD');
    const oArgs = {
      app_key: 'HkqR6GDf6r2P4h23' ,
      q: query,
      where: loc,
      "date": dateNow,
      page_size: 5,
      sort_order: "popularity",
   };
   return EVDB.API.call("/events/search", oArgs, function(oData) {
       console.log(oData);
       dispatch(fetchSuccess(oData, 'bitResults'));
   })
}

export const fetchEventBrite = (loc, feel) => dispatch => {
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
    } else if (feel = 'fun') {
        query = '113%2C105';
    } else if (feel = 'laid back') {
        query = '107%2C109';
    } else if (feel = 'unique') {
        query = '114%2C102';
    } 
    if (query) {
        catQuery = `categories=${query}&`;
    } else {
        catQuery = '';
    }
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
        dispatch(fetchSuccess(response, 'ebResults'))
    }).catch(err => {
        console.log(err);
    })
}