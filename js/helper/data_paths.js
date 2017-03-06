// The dataPaths object stores the strings of the paths to the specific data from each
// API provider, which is needed for objectPath. This way the algorithm in the appReducer
// of type FETCH_SUCCESS can very simply extract the data. Most importantly, this also makes it very easy
// to add or subtract different types of data for each of the API calls in a straight-forward way.

const dataPaths = Object.freeze({
  dataCategories: ['image', 'title', 'location', 'description', 'link', 'startTime', 'score'],
  ebResults: {
    image: 'logo.url',
    title: 'name.text',
    location: 'placeholder',
    description: 'description.text',
    link: 'url',
    startTime: 'start.local',
    score: undefined,
  },
  zomatoResults: {
    image: 'restaurant.featured_image',
    title: 'restaurant.name',
    location: 'restaurant.location.address',
    description: 'restaurant.cuisines',
    link: 'restaurant.url',
    startTime: undefined,
    score: 'restaurant.user_rating',
  },
  movieResults: {
    image: 'poster_path',
    title: 'original_title',
    location: undefined,
    description: 'overview',
    link: undefined,
    startTime: undefined,
    score: 'vote_average',
  },
  bitResults: {
    image: 'image.medium.url',
    title: 'title',
    location: 'venue_name',
    description: 'description',
    link: 'url',
    startTime: 'start_time',
    score: undefined,
  },
});

export default dataPaths;
