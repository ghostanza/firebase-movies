import React from 'react';

export default class MyStuff extends React.Component {
  constructor(p){
    super(p);
    this.state = {
      db: this.props.firebase.database().ref(`stuff/${this.props.user.uid}`),
      newItem: '',
      items: []
    }
    this.state.db.on('child_added', (d) => {
      var currentItems = Array.from(this.state.items);
      currentItems.push(d.val());
      this.setState((p) => ({...p, items: currentItems}));
    });
  }

  handleInput(e){
    var val = e.target.value;
    this.setState((p) => ({...p, newItem: val}));
  }
  addItem(){
    this.state.db.push({text: this.state.newItem});
    this.setState((p) => ({...p, newItem: ''}));
  }

  render() {
    return(
      <div className="my-stuff">
        <ul>
          { this.state.items.map((v,i) => { return (<li key={`${v.text}-${i}`}>{v.text}</li>) }) }
        </ul>
        <div className="enter">
          <input onChange={this.handleInput.bind(this)} value={this.state.newItem}/>
          <button onClick={this.addItem.bind(this)}>Add Item</button>
        </div>
      </div>
    )
  }
}
