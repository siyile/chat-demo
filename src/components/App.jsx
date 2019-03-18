import React, { Component } from 'react'
import { fetchChatData, addMessage, addUser } from '../utils/api'
import { convertTimestamp, generateUUID } from "../utils/helpers"

export default class App extends Component {
  state = {
    data: [],
    loading: true,
    text: "",
  }

  componentDidMount(){
    this.handleFetchData();
  }

  handleFetchData = async () => {
    let data = await fetchChatData();
    data = Object.keys(data).map((id) => {
      if (data[id].name === "Me"){
        // Octocat img is not available, replacing it with new one.
        data[id].avatar = "https://github.githubassets.com/images/modules/logos_page/Octocat.png";
      }
      return ({
        ...data[id],
        id
      })
    }).sort((a, b) => a.timestamp - b.timestamp)
    this.setState({data: data, loading: false});
  }

  handleInput = (e) => {
    this.setState({text: e.target.value})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { data } = this.state
    const message = {
      id: generateUUID(),
      time: Date.now() / 1000,
      text: this.state.text,
      // Name and avatar should be replaced by props authedUser, but I just hard code here.
      name: 'Me',
      avatar: "https://github.githubassets.com/images/modules/logos_page/Octocat.png"
    }
    this.setState({data: data.concat(message), text: ""})
    // communicate with api
    addUser().catch(() => {
      // If failed, set failed mark on message
    })
  }

  render() {
    const { data, loading } = this.state;
    let previousName = null;
    let sameAuthor = false;
    let previousTime = 0;
    let timeGap = true;
    return (
      loading
      ?<p>Loading</p>
      :<div className="container">
        <h1 className="text-center">Chat Demo</h1>
        <div className="border border-dark pb-3">
          <ul className="p-4">
            {
              data.map(message => {
                const {avatar, name, text, time, id} = message;
                timeGap = time - previousTime > 5 * 60;
                previousTime = time;
                sameAuthor = previousName === name && !timeGap;
                previousName = name;
                return (
                  <li key={id} className="m-1">
                    <div className="text-center">
                      {timeGap?convertTimestamp(time):null}
                    </div>
                    <div className={`d-flex align-items-center my-0 ${name==="Me"?"flex-row-reverse":"null"}`}>
                      <div className="d-flex flex-column align-items-center mx-3">
                        <img className={`avatar info ${sameAuthor?"hidden-info":""}`}  src={avatar} alt={`avatar for ${name}`} />
                        <div className={`text-center info name ${sameAuthor?"hidden-info":""}`}>{name}</div>                         
                      </div>
                      <div className={`text-white px-3 py-2 ${name==="Me"?"bg-success":"bg-secondary"}`}>
                        {text}
                      </div>
                    </div>
                  </li>
                )
              })
            }
          </ul>
          <hr />
          <div className="d-flex justify-content-center">
            <input
              type="text"
              onChange={this.handleInput}
              value={this.state.text}
              className="mx-2 send-message"
            />
            <button
              className="btn btn-success"
              onClick={this.handleSubmit}
              disabled={!this.state.text}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    )
  }
}
