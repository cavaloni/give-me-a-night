import objectPath from 'object-path';
import fetch from 'isomorphic-fetch';
import moment from 'moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import dataPaths from '../helper/data_paths';


const document = require('global/document');

// google JS API
const google = window.google;
const autocomplete = new google
    .maps
    .places
    .AutocompleteService();

const element = document.createElement('div');
const places = new google
    .maps
    .places
    .PlacesService(element);

export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const fetchSuccess = results => ({ type: FETCH_SUCCESS, results });

export const FETCH_FAILURE = 'FETCH_FAILURE';
export const fetchFailure = (err, provider) => ({ type: FETCH_FAILURE, err, provider });

export const SEARCH_VALUES = 'SEARCH_VALUES';
export const search = (loc, feel) => ({ type: SEARCH_VALUES, loc, feel });

export const CURRENT_CLICKED_BOX = 'CURRENT_CLICKED_BOX';
export const currentClickedBox = (num, eventType) => ({
  type: CURRENT_CLICKED_BOX, num, eventType,
});

export const TOGGLE_CARD_SIDES = 'TOGGLE_CARD_SIDES';
export const toggleCardSides = () => ({ type: TOGGLE_CARD_SIDES });

export const TOGGLE_SEARCHING = 'TOGGLE_SEARCHING';
export const toggleSearching = () => ({ type: TOGGLE_SEARCHING });

export const fetchResults = (loc, feel, coordinates) => (dispatch) => {
  // --------location processing to feed into url creators
  let query = '';
  let order = '';
  const city = loc.split(/[ ,]+/);
  const cityQuery = city.map((item) => {
    if (item === undefined) {
      return '';
    }
    return item;
  });

  let cGeo;

  if (!coordinates) {
    cGeo = '';
  } else {
    cGeo = {
      long: coordinates.longitude,
      lat: coordinates.latitude,
    };
  }

  // URLs creators for each API
  const zomatoUrl = (() => {
    if (feel === 'crazy') {
      query = 'mexican';
    } else if (feel === 'fun') {
      query = 'indian';
    } else if (feel === 'laid back') {
      query = 'cafe';
    } else if (feel === 'unique') {
      query = 'dinner';
      order = 'cost';
    }
    if (order === undefined) {
      order = 'rating';
    }
    return `https://developers.zomato.com/api/v2.1/search?&q=${query}&lon=${cGeo.long}&lat=${cGeo.lat}&sort=${order}`;
  })();

  const moviesUrl = (() => {
    if (feel === 'crazy') {
      query = '&certification_country=US&certification=R&sort_by=vote_average.desc';
    } else if (feel === 'fun') {
      query = '&certification_country=US&certification=PG&sort_by=vote_average.desc';
    } else if (feel === 'laid back') {
      query = '&certification_country=US&certification=PG13&sort_by=vote_average.desc';
    } else if (feel === 'unique') {
      query = '&sort_by=popularity.asc';
    }

    const date = moment().format('YYYY-MM-DD');
    const toDate = moment()
                .subtract(2, 'months')
                .format('YYYY-MM-DD');
    return `https://api.themoviedb.org/3/discover/movie?api_key=78a549a366831e6da5647a51ebe710d9&primary_release_date.gte=${toDate}&primary_release_date.lte=${date}${query}`;
  })();

  const bandsInTownArgs = (() => {
    if (feel === 'crazy') {
      query = 'dance';
    } else if (feel === 'fun') {
      query = 'rock';
    } else if (feel === 'laid back') {
      query = 'guitar';
    } else if (feel === 'unique') {
      query = 'jazz';
    }

    const dateNow = moment().format('YYYY-MM-DD');
    return {
      app_key: 'HkqR6GDf6r2P4h23',
      keywords: query,
      within: 30,
      where: loc,
      date: dateNow,
      page_size: 5,
      sort_order: 'popularity',
      category: 'Concerts &amp; Tour Dates',
    };
  })();

  const eventBriteUrl = () => {
    let catQuery;

    if (feel === 'crazy') {
      query = '105%2C108%2C110';
    } else if (feel === 'fun') {
      query = '113%2C105';
    } else if (feel === 'laid-back') {
      query = '107%2C109';
    } else if (feel === 'unique') {
      query = '114%2C102';
    }
    if (query) {
      catQuery = `categories=${query}&`;
    } else {
      catQuery = '';
    }

    const locationQuery = encodeURIComponent(cityQuery);

    return `https://www.eventbriteapi.com/v3/events/search/?location.address=${locationQuery}&location.within=30mi&${catQuery}start_date.keyword=today&token=6SVNTPUPXW5HGNKP5ZGW`;
  };

  const eventBriteUrlAtmpt2 = eventBriteUrl(loc, null);
  // EventBrite needs 2 attempts
  // because often first search returns no results -------

  // -------Fetches -------
  const fetchZomato = fetch(zomatoUrl, {
    headers: {
      'X-Zomato-API-Key': '78be78c81e2efb35f45588e55478c59f',
      'Content-Type': 'text/plain; charset=utf-8',
      Accept: 'text/plain; charset=utf-8',
    },
  }).then(data => data.json()).then((response) => {
    if (response.restaurants.length === 0) {
      throw new Error('no zomato results');
    } else { return response.restaurants; }
  });

  const fetchMovies = fetch(moviesUrl).then(data => data.json()).then(response => response.results);

  const fetchBandsInTown = new Promise((resolve, reject) => {
    EVDB
      .API
      .call('/events/search', bandsInTownArgs, (oData) => {
        if (!oData.events) {
          reject('no eventful results');
          return;
        }
        resolve(oData.events.event);
      });
  });

  const fetchEventBriteFunc = ebUrl => fetch(ebUrl, {})
    .then(data => data.json())
    .then((response) => {
      if (response.error) {
        throw new Error('no ebResults 2');
      }
      if (response.events.length === 0 || response.error) {
        throw new Error('no ebResults 1');
      } else {
        return response.events;
      }
    });

  const fetchEventBrite = fetchEventBriteFunc(eventBriteUrl());
  const fetchEventBriteAtmpt2 = fetchEventBriteFunc(eventBriteUrlAtmpt2);

  function getGooglePhotos1(rest) {
    return new Promise((resolve) => {
      if (rest.restaurant.featured_image !== '') {
        resolve(rest);
      }
      let placeID = '';
      autocomplete.getPlacePredictions({
        input: `${rest.restaurant.location.address} ${rest.restaurant.name}`,
      }, (results, status) => {
        if (status !== 'OK' || results === null) {
          const photo = 'http://freedesignfile.com/upload/2012/10/Restaurant_menu__11-1.jpg';
          const newRest = rest;
          newRest.restaurant.featured_image = photo;
          resolve(newRest);
          return;
        }
        placeID = results[0].place_id;
        places.getDetails({
          placeId: placeID,
        }, (photoResults) => {
          if (!photoResults.photos) {
            const photo = 'http://freedesignfile.com/upload/2012/10/Restaurant_menu__11-1.jpg';
            const newRest = rest;
            newRest.restaurant.featured_image = photo;
            resolve(newRest);
            return;
          }
          const photo = photoResults.photos[0].getUrl({ maxWidth: 300, maxHeight: 300 });
          const newRest = rest;
          newRest.restaurant.featured_image = photo;
          resolve(newRest);
        });
      });
    });
  }

  // Fetches are converted into observables to be able
  // process each fetch individual and for more declarative code
  const zomatoObs = Observable.fromPromise(fetchZomato);
  const movieObs = Observable.fromPromise(fetchMovies);
  const bandsInTownObs = Observable.fromPromise(fetchBandsInTown);
  const eventbriteObs = Observable.fromPromise(fetchEventBrite);
  const eventbriteObs2 = Observable.fromPromise(fetchEventBriteAtmpt2);

  // errored object is returned for each api result
  // if the fetch errors (read ../helpers/data_paths for more info on dataPaths)
  function erroredObj(provider) {
    const errObj = {};
    objectPath.set(errObj, `${dataPaths[provider].image}`, '../../../assets/img/no-results.png');
    objectPath.set(errObj, `${dataPaths[provider].title}`, 'Small Town?');
    return [errObj];
  }

  // two attempts for eventbrite, one without 'feel' argument
  const eventBrite2Attempts = Observable
    .of(eventbriteObs, eventbriteObs2)
    .reduce((ob1, ob2) => ob1.catch(() => ob2), Observable.throw(''))
    .mergeAll();

  // zomatos results often come back without images
  // so fetches are needed to google places to get new images
  const zomatoResults = zomatoObs.flatMap(x => Observable.from(x));

  const fiveZomsResults = zomatoResults
    .take(5);

  const googlePhotosObs = fiveZomsResults
    .filter(result => result.restaurant.featured_image === '')
    .flatMap(rest => Observable.fromPromise(getGooglePhotos1(rest)));

  const zomsWithPics = fiveZomsResults
    .filter(result => result.restaurant.featured_image !== '');

  const updatedZomsResults = Observable.merge(
      zomsWithPics,
      googlePhotosObs,
    ).toArray();

  // Each result gets an observer to be abe to return an errored object if needed

  const zomatoRes = updatedZomsResults
    .map(results => ({
      zomatoResults: results,
    }))
    .catch(() => Observable.of({
      zomatoResults: erroredObj('zomatoResults'),
    }));

  const movieRes = movieObs
    .map(results => ({
      movieResults: results,
    }))
    .catch(() => Observable.of({
      movieResults: erroredObj('movieResults'),
    }));

  const bitRes = bandsInTownObs
    .map(results => ({
      bitResults: results,
    }))
    .catch(() => Observable.of({
      bitResults: erroredObj('bitResults'),
    }));

  const evRes = eventBrite2Attempts
    .map(results => ({
      ebResults: results,
    }))
    .catch(() => Observable.of({
      ebResults: erroredObj('ebResults'),
    }));

  const allResultsMerge = Observable.merge(zomatoRes, bitRes, movieRes, evRes)
    .finally()
    .scan((acc, curr) =>
      Object.assign({}, acc, curr), {});

  const finalResults = allResultsMerge.toPromise();
  return finalResults.then((x) => {
    dispatch(fetchSuccess(x));
    dispatch(toggleCardSides());
    dispatch(toggleSearching());
  });
};
