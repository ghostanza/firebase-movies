import React from 'react';
import MovieDetails from 'page/MovieDetails';
import Listing from 'page_elements/Listing';

export default class SearchResults extends React.Component {
  constructor(p){
    super(p);
    this.state = {
      details: '',
      searchResults: p.results || []
    }
  }
  componentWillReceiveProps(np){
    this.setState((p) => ({...p, searchResults: np.results}));
  }
  showDetails(e){
    let index = e.currentTarget.dataset.resultsIndex;
    this.setState((p)=>({...p, details: this.state.searchResults[index]}));
  }
  showListings(e){
    e.preventDefault();
    this.setState((p) => ({...p, details:''}));
  }

  render() {
    let results = [];
    if(this.state.searchResults){
      results = this.state.searchResults.map(
        (m,i) => {
          return (
            <li key={m.id} data-results-index={i} onClick={this.showDetails.bind(this)}>
              {m.image_src ? (<img src={m.image_src}/>) : (<div className='placeholder'>No Image</div>)}
              <p>{m.title || ''}</p>
              {m.formatted_release_date ? (<p>{m.formatted_release_date.year}</p>): ''}
            </li>
          );
        });
    }
    return(
      <div className='search-results'>
        {this.state.details ?
          (<MovieDetails data={this.state.details} back={this.showListings.bind(this)} uid={this.props.uid} firebase={this.props.firebase}/>)
          : (<Listing items={results} term={this.props.term}/>)}
      </div>)
  }
}
