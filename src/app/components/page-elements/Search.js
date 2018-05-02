import React from 'react';
import {search, createPosterURL, formatReleaseDate} from 'helpers/moviedb';

export default class Search extends React.Component {
  constructor(p){
    super(p);
    this.state = {
      searchTerm: ''
    }
  }
  updateSearchTerm(e){
    var val = e.target.value;
    this.setState({searchTerm: val});
  }
  searchMovies(e){
    e.preventDefault();
    this.props.toggleSearching(true);
    search(this.state.searchTerm, 'movie').then((r) => {
      let results = [];
      if(r.data && r.data.results.length){
        r.data.results.forEach((m) => {
          if(m.poster_path){
            m.image_src = createPosterURL(m.poster_path, 'medium');
          }
          if(m.release_date){
            m.formatted_release_date = formatReleaseDate(m.release_date);
          }
          results.push(m);
        });
      }
      this.props.updateSearchResults(results, this.state.searchTerm);
      this.setState({searchTerm: ''});
    });
  }
  render() {
    return(
      <div className='searchbar'>
        <form onSubmit={this.searchMovies.bind(this)}>
          <input placeholder="Search for a movie" value={this.state.searchTerm} onChange={this.updateSearchTerm.bind(this)}/>
          <button type="submit">Search</button>
        </form>
      </div>
    );
  }
}
