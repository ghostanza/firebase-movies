const axios = require('axios');
const apiKey = process.env.MOVIE_DB_API_KEY;
const apiURL = 'https://api.themoviedb.org/3';

module.exports.search = (query, type) => {
  const searchOptions = ['company', 'collection', 'keyword', 'movie', 'tv'];
  type = (type && searchOptions.includes(type)) ? type : 'movie';
  query = query.length ? encodeURIComponent(query) : '';
  let excludeAdult = type == 'movie' ? '&include_adult=false' : '';
  return axios.get(`${apiURL}/search/${type}?query=${query}&api_key=${apiKey}${excludeAdult}`);
}

/* posterURL
** takes the poster_path returned from the api (ex: '/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg')
** also takes a size option (default is "original")
** returns the formatted poster URL to use as the image source:
** ex: posterURL('/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg', 'medium')
***** https://image.tmdb.org/t/p/w300/3AJHSOszX0oNlYWfuJA5Ei9r0X0.jpg
*/
module.exports.createPosterURL = (imgPath, size) => {
  const sizeOptions = ['w45', 'w92', 'w154', 'w185', 'w300', 'w500', 'original'];
  const namedOptions = {
    'small' : 'w154',
    'medium' : 'w300',
    'large' : 'w500',
    'xlarge' : 'orginal'
  };
  size = size.length && sizeOptions.includes(size) ? size
    : size.length && sizeOptions.includes(namedOptions[size]) ? namedOptions[size]
    : 'original';
  return `https://image.tmdb.org/t/p/${size}${imgPath}`;
}

/*** General Information Based on IDs ***/
module.exports.getInfo = (type, id) => {
  return axios.get(`${apiURL}/${type}/${id}?api_key=${apiKey}`);
}
module.exports.getImagesFor = (type, id) => {
  return axios.get(`${apiURL}/${type}/${movieID}/images?api_key=${apiKey}`);
}
module.exports.getRecommendationsBasedOn = (type, id) => {
  return axios.get(`${apiURL}/${type}/${id}/recommendations?api_key=${apiKey}`);
}
module.exports.getResultSimilarTo = (type, id) => {
  return axios.get(`${apiURL}/${type}/${id}/similar?api_key=${apiKey}`);
}

/*** Movies ***/
module.exports.getMovieReleaseDates = (movieID) => {
  return axios.get(`${apiURL}/movie/${movieID}/release_dates?api_key=${apiKey}`);
}

module.exports.getMovieGenres = () => {
  return axios.get(`${apiURL}/genre/movie/list?api_key=${apiKey}`);
}

/*** Discover ***/

module.exports.discover = (type, options) => {
  // this will allow for the names the user passes for the options to be a little more semantic
  const lookup = {
    'genres' : 'with_genres',
    'min_user_rating' : 'vote_average.gte',
    'page' : 'page',
    'sort_by' : 'sort_by'
  }
  let optionsQuery = '',
      optionsLength = Object.keys(options).length,
      count = 0;
  for( let option in options ){
    let tmp = '';
    count++;
    tmp += count == 1 ? '' : '&';
    if(lookup[option] != undefined){
      tmp += `${lookup[option]}=`
      if(typeof(options[option]) == 'object'){
        // TODO: commas indicate "AND", pipes (|) indicate "OR"
        // determine if this should use "AND" instead of "OR"
        tmp += options[option].join(',');
      } else{
        tmp += options[option]
      }
      optionsQuery += tmp
    }
  }
  return axios.get(`${apiURL}/discover/${type}?${optionsQuery}&api_key=${apiKey}`);
}

module.exports.test = () => {
  module.exports.search('terrifier').then((r) => {
    if(r.data && r.data.results){
      console.log("Results for search term 'terrifier': ");
      console.log(r.data.results);
      let id = r.data.results[0].id,
          title = r.data.results[0].title;
      console.log(`Fetching Info for ${title} (ID: ${id})...`);
      module.exports.getInfo('movie', id).then((d) => {
        if(d.data){
          console.log(`MOVIE DATA FOR ${title}: `, d.data);
        }
      });
      console.log("POSTER: ", module.exports.createPosterURL(r.data.results[0]['poster_path'], 'medium'));
      module.exports.getRecommendationsBasedOn('movie', id).then((d) => {
        if(d.data){
          console.log(`RECOMMENDATIONS BASED ON ${title}: `, d.data);
        }
      });
      module.exports.getResultSimilarTo('movie', id).then((d) => {
        if(d.data){
          console.log(`SIMILAR TO ${title}: `, d.data);
        }
      });
      module.exports.getMovieReleaseDates(id).then((d) => {
        if(d.data){
          console.log(`RELEASE DATES FOR ${title}`, d.data);
        }
      });
    }
  });
  module.exports.getMovieGenres().then((r) => {
    if(r.data){
      console.log("AVAILABLE MOVIE GENRES: ", r.data);
    }
  });
  module.exports.discover('movie', { genres: [27,53], min_user_rating: 8, sort_by: 'primary_release_date.desc'}).then((r) => {
    if(r.data){
      console.log("DISCOVER: ", r.data);
    }
  })
}
