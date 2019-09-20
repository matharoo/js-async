import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// Author: Rupinder Matharoo, https://www.linkedin.com/in/matharoo/
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hash: [
        { url:"https://t6v3t4hh5i.execute-api.us-west-2.amazonaws.com/latest/haiku/stanza1", message:"Fetching...", responsetime:"", statuscode: null},
        { url:"https://t6v3t4hh5i.execute-api.us-west-2.amazonaws.com/latest/haiku/stanza2", message:"Fetching...", responsetime:"", statuscode: null},
        { url:"https://t6v3t4hh5i.execute-api.us-west-2.amazonaws.com/latest/haiku/stanza3", message:"Fetching...", responsetime:"", statuscode: null},
        { url:"https://t6v3t4hh5i.execute-api.us-west-2.amazonaws.com/latest/haiku/author", message:"Fetching...", responsetime:"", statuscode: null}
      ]
    };
    this.getMessages = this.getMessages.bind(this);
    this.updateItem = this.updateItem.bind(this);
  }
  
  componentDidMount() {
    //do the api call after the render..
    this.getMessages(this.state.hash);
  }

  // call api and using fetch and call it asynchoronously and then update the endpoints whenever we recieve the response in the future..
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

  //update the hash table with response,codes and times.
  updateItem(index, itemAttributes) {
    // console.log("updating index with "+index+" , msg: "+JSON.stringify(itemAttributes));
    if (index === -1)
      return null;
    else
    // console.log("trying to update with "+JSON.stringify(itemAttributes))
      //once we have recieved the reponse update the appropriate entry in hash table based on index
      this.setState({
        hash: [
           ...this.state.hash.slice(0,index),
           Object.assign({}, this.state.hash[index], itemAttributes),
           ...this.state.hash.slice(index+1)
        ]
      });
  }

  // another method i did  can make sure the calls are made one after one and they have have to wait until first one recieves a response..
  // getMessages = async (hash) => {
  //   for(let obj of hash) {
  //     await this.callApi(obj.url);
  //   }
  // };

  //fire up all the endpoint calls..
  getMessages = (hash) => {
    //passing in the hash with endpoints
    for(let [index,obj] of hash.entries()) {
      // console.log(index,obj);
      //firing up the api calls for all endpoints in hash and passing in index to keep track of which one to update once we recieve the response
      this.callApi(index,obj.url);
    }
  };

  render() {
    return (
      <div className="App">
      <header className="App-header">
        <p>
          <code>
            {/* show the endpoints results*/}
            {this.state.hash.map((item,index) => (
              <span key={index} className={`${item.statuscode === 200 ? 's200' : 'statusother'}`}>{item.message} <i>{item.statuscode} {item.responsetime}</i><br/></span>
            ))}
          </code>
        </p>
      </header>
    </div>
    );
  }
}

export default App;
