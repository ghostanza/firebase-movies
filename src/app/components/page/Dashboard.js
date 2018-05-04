import React from 'react';
import * as moviedb from 'helpers/moviedb';
import {db} from 'helpers/firebase';

export default class Dashboard extends React.Component {
  constructor(p){
    super(p);
    this.state = {
      library: '',
      movieData: [],
    }
  }
  componentDidMount(){
    db(`users/${this.props.user.uid}/library`).on('value', (data) => {
      let movies = data.val();
      if(movies){
        this.setState((pp)=>({...pp, library: movies}));
        Object.keys(movies).forEach((movieID) => {
          moviedb.getInfo('movie', movieID).then((info) => {
            if(info && info.data){
              let tmp = info.data,
                  tmpState = Array.from(this.state.movieData);
              if(tmp.poster_path){
                tmp.image_src = moviedb.createPosterURL(tmp.poster_path, 'medium');
              }
              tmpState.push(tmp);
              this.setState((op)=>({...op, movieData: tmpState}));
            }
          });
        });
      }
    });
  }
  componentWillUnmount(){
    // to avoid trying to update the state when it unmounts
    db(`users/${this.props.user.uid}/library`).off('value');
  }

  render() {
    return(
      <div className='dashboard'>
        { this.state.library && this.state.movieData.length ? (
          <ul>
            {this.state.movieData.map((movie) => {
              return (
                <li key={movie.id}>
                  {movie.image_src ? (<img src={movie.image_src}/>) : (<div className='placeholder'>No Image</div>)}
                  <p>{movie.title || ''}</p>
                  {this.state.library[movie.id].added ? (<p>Added on {this.state.library[movie.id].added}</p>): ''}
                </li>)
            })}
          </ul>
        ) : (<p>No Items In Your Library</p>)}
      </div>
    )
  }
}
