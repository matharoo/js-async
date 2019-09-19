import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hash: [
        { id:1, url:"https://t6v3t4hh5i.execute-api.us-west-2.amazonaws.com/latest/haiku/stanza1", message:"Fetching...", responsetime:"", statuscode: null},
        { id:2, url:"https://t6v3t4hh5i.execute-api.us-west-2.amazonaws.com/latest/haiku/stanza2", message:"Fetching...", responsetime:"", statuscode: null},
        { id:3, url:"https://t6v3t4hh5i.execute-api.us-west-2.amazonaws.com/latest/haiku/stanza3", message:"Fetching...", responsetime:"", statuscode: null},
        { id:4, url:"https://t6v3t4hh5i.execute-api.us-west-2.amazonaws.com/latest/haiku/author", message:"Fetching...", responsetime:"", statuscode: null}
      ]
    };
    this.getMessages = this.getMessages.bind(this);
    this.updateItem = this.updateItem.bind(this);
  }
  
  componentDidMount() {
    //do the api call after the render..
    this.getMessages(this.state.hash);
  }

  callApi = async (index,url) => {
    let starttime= new Date().getTime();
    let statuscode = null;
    await fetch(url,{
      method: 'GET',
      headers: {'Content-Type':'application/json','x-api-key':'tsf0ZEU6ZCeNgss2wVsc9gWV5BXJ7nAmOl5pC5j0'}
    })
    .then((res) => {
        statuscode = res.status;
        return res.json();
    })
    .then(json=> this.updateItem(index, {message: json.message,responsetime:(new Date().getTime()-starttime)+"ms",statuscode:statuscode}))
    .catch((e)=> this.updateItem(index, {message: e.message, responsetime:(new Date().getTime()-starttime)+"ms",statuscode: e.status}));
  };

  updateItem(index, itemAttributes) {
    // console.log("updating index with "+index+" , msg: "+JSON.stringify(itemAttributes));
    if (index === -1)
      return null;
    else
    // console.log("trying to update with "+JSON.stringify(itemAttributes))
      this.setState({
        hash: [
           ...this.state.hash.slice(0,index),
           Object.assign({}, this.state.hash[index], itemAttributes),
           ...this.state.hash.slice(index+1)
        ]
      });
  }
  

  // this can make sure the calls are made one after one
  // getMessages = async (hash) => {
  //   for(let obj of hash) {
  //     await this.callApi(obj.url);
  //   }
  // };

  getMessages = (hash) => {
    for(let [index,obj] of hash.entries()) {
      // console.log(index,obj);
      this.callApi(index,obj.url);
    }
  };
  

  render() {
    return (
      <div className="App">
      <header className="App-header">
        <p>
          <code>{this.state.hash.map((item,index) => (
            <span key={index} className={`${item.statuscode === 200 ? 's200' : 'statusother'}`}>{item.message} <i>{item.statuscode} {item.responsetime}</i><br/></span>
          ))}</code>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
    );
  }
}

export default App;
