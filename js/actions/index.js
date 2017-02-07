import fetch from 'isomorphic-fetch';
import moment from 'moment';
import geocoder from 'geocoder-geojson'
import {Observable} from 'rxjs/Rx';

//google JS API
const google = window.google;
const autocomplete = new google
    .maps
    .places
    .AutocompleteService();
const document = require('global/document');
const element = document.createElement('div')
const places = new google
    .maps
    .places
    .PlacesService(element)

export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const fetchSuccess = (results) => ({type: FETCH_SUCCESS, results});

export const FETCH_FAILURE = 'FETCH_FAILURE';
export const fetchFailure = (err, provider) => ({type: FETCH_FAILURE, err, provider});

export const SEARCH_VALUES = 'SEARCH_VALUES';
export const search = (loc, feel) => ({type: SEARCH_VALUES, loc, feel})

export const RETURN_NEW_PHOTO = 'RETURN_NEW_PHOTO';
export const returnNewPhoto = (photo, id) => ({type: RETURN_NEW_PHOTO, photo, id})

export const NO_RESULTS = 'NO_RESULTS';
export const noResults = provider => ({type: NO_RESULTS, provider})

export const CURRENT_CLICKED_BOX = 'CURRENT_CLICKED_BOX';
export const currentClickedBox = (num, eventType) => ({type: CURRENT_CLICKED_BOX, num, eventType})

export const TOGGLE_CARD_SIDES = 'TOGGLE_CARD_SIDES';
export const toggleCardSides = () => ({type: TOGGLE_CARD_SIDES})

// export const RESET_FLIPPERS = 'RESET_FLIPPERS';
// export const resetFlippers = () => ({type: RESET_FLIPPERS})

// export const FLIPPERS_ON = 'FLIPPERS_ON';
// export const flippersOn = () => ({type: FLIPPERS_ON})

export const fetchResults = (loc, feel) => dispatch => {

    let returnedItems = {
        zomatoResults : [],
        ebResults : [],
        bitResults : [],
        movieResults : []
    };

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
        geocoder
            .google(loc)
            .then((response) => {
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
        return `https://developers.zomato.com/api/v2.1/search?&q=${query}&lon=${cGeo.long}&lat=${cGeo.lat}&sort=${order}`
    }).then(zomatoUrl => {

        const moviesUrl = ((loc, feel) => {
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
            const toDate = moment()
                .subtract(2, 'months')
                .format('YYYY-MM-DD');
            return `https://api.themoviedb.org/3/discover/movie?api_key=78a549a366831e6da5647a51ebe710d9&primary_release_date.gte=${toDate}&primary_release_date.lte=${date}${query}`
        })(loc, feel)

        const bandsInTownArgs = ((loc, feel) => {
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
            return {
                app_key: 'HkqR6GDf6r2P4h23',
                keywords: query,
                within: 30,
                where: loc,
                "date": dateNow,
                page_size: 5,
                sort_order: "popularity"
            };
        })(loc, feel)

        console.log(bandsInTownArgs);

        const eventBriteUrl = ((loc, feel, attempt2) => {

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
            return `https://www.eventbriteapi.com/v3/events/search/?location.address=${locationQuery}&location.within=30mi&${catQuery}start_date.keyword=today&token=6SVNTPUPXW5HGNKP5ZGW`
        })(loc, feel)

        const fetchZomato = fetch(zomatoUrl, {
            headers: {
                'X-Zomato-API-Key': `78be78c81e2efb35f45588e55478c59f`,
                "Content-Type": "text/plain; charset=utf-8",
                'Accept': 'text/plain; charset=utf-8'
            }
        }).then((data) => {
            return data.json();
        }).then(response => {
            console.log('zomatoes results', response);
            return response.restaurants
        }).catch(err => {
            console.log(err);
        })

        const fetchMovies = fetch(moviesUrl).then((data) => {
            return data.json();
        }).then(response => {
            console.log(response);
            return response.results
        }).catch(err => {
            console.log(err);
        })

        const fetchBandsInTown = new Promise((resolve, reject) => {
            console.log(bandsInTownArgs);
            EVDB
                .API
                .call("/events/search", bandsInTownArgs, function (oData) {
                    console.log(oData);
                    if (!oData.events) {
                        reject('BIT is fucked')
                        return
                    }
                    resolve(oData.events.event)
                })
        })

        const fetchEventBrite = fetch(eventBriteUrl, {
            // "data": {     "near": city }
        }).then((data) => {
            return data.json();
        }).then(response => {
            if (response.events === undefined && !attempt2) {
                counter++ 
                return eventBriteUrl(loc, null, true)
            }
            if (response.error && !feel) {
                dispatch(noResults('ebResults'));
                return
            }
            return response.events
        }).catch(err => {
            console.log(err);
        })

        function getGooglePhotos1 (rest){ 
            return new Promise((resolve, reject) => {
                    if (rest.restaurant.featured_image !== '') {                
                        resolve(rest)
                    }
                    let placeID = '';
                    autocomplete.getPlacePredictions({
                        input: rest.restaurant.location.address + ' ' + rest.restaurant.name
                    }, (results, status) => {
                        if (status !== 'OK' || results === null) {
                            console.log(results);
                            console.log(status);
                            const photo = "http://freedesignfile.com/upload/2012/10/Restaurant_menu__11-1.jpg"        
                            rest.restaurant.featured_image = photo                            
                            resolve(rest)
                            return
                        }
                        placeID = results[0].place_id;
                        places.getDetails({
                            placeId: placeID
                        }, (results, status) => {
                            if (!results.photos) {
                                const photo = "http://freedesignfile.com/upload/2012/10/Restaurant_menu__11-1.jpg"            
                                rest.restaurant.featured_image = photo                                
                                resolve(rest)
                                return
                            }
                            const photo = results
                                .photos[0]
                                .getUrl({'maxWidth': 300, 'maxHeight': 300})            
                            rest.restaurant.featured_image = photo                            
                            resolve(rest)
                        })
                    });
                })
        }

        const zomatoObs = Observable.fromPromise(fetchZomato);
        const movieObs = Observable.fromPromise(fetchMovies);
        const bandsInTownObs = Observable.fromPromise(fetchBandsInTown)
        const eventbriteObs = Observable.fromPromise(fetchEventBrite)

        let observerArr = [];
        let errored = [];

        movieObs.subscribe(x => {
            console.log(x);
            returnedItems.movieResults = x;
        }, err => {
            errored.push('movieResults')
        }, () => {
            console.log('completed');
        })

        bandsInTownObs.subscribe(x => {
            returnedItems.bitResults = x;
            console.log(x);
        }, err => {
            console.log(err);
            errored.push('bitResults')
        }, () => {
            console.log('completed');
        })

        zomatoObs.subscribe(x => {
            console.log(x);
            if (x.length === 0) {
                errored.push('zomatoResults')
            }
            returnedItems.zomatoResults = x;
        }, err => {
            errored.push('zomatoResults')
        }, () => {
            console.log('zoms completed');
        })

        eventbriteObs.subscribe((x) => {
            console.log(x);
            if (x.length === 0) {
                errored.push('ebResults');
            }
            returnedItems.ebResults = x;
        }, err =>  {
            errored.push('ebResults');
         }, () => { 
            console.log('completed');
        } )        

        const zomatoResults = zomatoObs.flatMap(x => {
            return Observable.from(x)
        })
        
        const googlePhotosObs = zomatoResults
            .take(5)
            .flatMap(rest => {
            return Observable.fromPromise(getGooglePhotos1(rest))
        })
        
        returnedItems.zomatoResults = [];
        googlePhotosObs.subscribe(rest => {
            returnedItems.zomatoResults.push(rest)
    }, err => {console.log(err);})

//----------------------------

        const allFetchDataObservable = Observable.onErrorResumeNext(movieObs, bandsInTownObs, eventbriteObs, zomatoObs, googlePhotosObs)

        allFetchDataObservable
        .finally(() => {
            console.log(returnedItems);
            console.log(errored);
            dispatch(fetchSuccess(returnedItems));
            dispatch(toggleCardSides());
            errored.forEach(err => dispatch(noResults(err)))
        })
        .subscribe(x => {
            console.log('non error: ' + x);
        }, err => {
            console.log('error on merge: ' + err);
        })

        // const finalAdd = allFetchDataObservable
        // .finally(() => {
        //     console.log(returnedItems);
        //     console.log(errored);
        //     dispatch(fetchSuccess(returnedItems));
        //     dispatch(toggleCardSides());
        //     errored.forEach(err => dispatch(noResults(err)))
        // })

        // finalAdd.subscribe(x => {
        //     console.log(x);
        // })

        // const zomsImagesStuff = returnedItems.zomatoResults
        //     let promises = getGooglePhotos(zomsImagesStuff);
        //     Promise
        //         .all(promises)
        //         .then(() => {
        //             dispatch(fetchSuccess(returnedItems));
        //             dispatch(toggleCardSides());
        //         })

        // function getGooglePhotos(items) {
        //     let zomsLength = items.length;
        //     if (zomsLength > 4) {zomsLength = 4}
        //     let promises = [];
        //     for (i = 0; i < zomsLength; i++) {  
        //         let origRest;
        //         let rest = items[i];
        //         let aPromise = new Promise((resolve, reject) => {
        //             if (rest.restaurant.featured_image !== '') {
        //                 returnedItems.zomatoResults[i] = rest
        //                 resolve()
        //             }
        //             console.log(rest);
        //             console.log(returnedItems);
        //             let placeID = '';
        //             autocomplete.getPlacePredictions({
        //                 input: rest.restaurant.location.address + ' ' + rest.restaurant.name
        //             }, (results, status) => {
        //                 if (status !== 'OK') {
        //                     console.log(status);
        //                     const photo = "http://freedesignfile.com/upload/2012/10/Restaurant_menu__11-1.jpg"
        //                     rest.restaurant.featured_image = photo
        //                     returnedItems.zomatoResults[i] = rest
        //                     resolve()
        //                 }
        //                 placeID = results[0].place_id;
        //                 places.getDetails({
        //                     placeId: placeID
        //                 }, (results, status) => {
        //                     if (!results.photos) {
        //                         const photo = "http://freedesignfile.com/upload/2012/10/Restaurant_menu__11-1.jpg"
        //                         rest.restaurant.featured_image = photo
        //                         returnedItems.zomatoResults[i] = rest
        //                         resolve()
        //                     }
        //                     const photo = results
        //                         .photos[0]
        //                         .getUrl({'maxWidth': 300, 'maxHeight': 300})
        //                     rest.restaurant.featured_image = photo
        //                     returnedItems.zomatoResults[i] = rest
        //                     resolve()
        //                 })
        //             });
        //         })
        //         promises.push(aPromise)
        //     }
        //     return promises
        // }
    })
}
