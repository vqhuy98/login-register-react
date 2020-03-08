import React from "react";
import loginImg from "../../login.svg";
import axios from "axios";

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "" , isLoading : false, isFailed : false};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (prop, value) => {
    this.setState({ [prop]: value });
  };

  async handleSubmit(event) {  
    event.preventDefault();
    const self = this;
    await self.setState({ isLoading : true});
    await self.setState({isFailed : false});
    axios({
      method: "post",
      url: "",
      data: {
        username: this.state.username,
        password: this.state.password
      },
      headers :{
        'Access-Control-Allow-Origin' :'*'
      }
    })
      .then(function(response) {
        console.log(response);
        self.setState({ isLoading : false});
        
      })
      .catch(function(error) {
        console.log(error);
        self.setState({ isLoading : false});
        self.setState({isFailed : true});
      });
  }

  render() {
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Login</div>
        <div className="content">
          <div className="image">
            <img src={loginImg} alt="photo"/>
          </div>
          {this.state.isFailed && <p style={{color:"red"}}>Loggin failed.Username or password is incorrect.</p>}
          <form className="form" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                placeholder="username"
                value={this.state.username}
                onChange={e => this.handleChange("username", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                placeholder="password"
                value={this.state.password}
                onChange={e => this.handleChange("password", e.target.value)}
              />
            </div>
            <div className="footer">
              <input type="submit" className="btn" value="Login" />
            </div>
          </form>
          {this.state.isLoading && <p>loading...</p>}
        </div>
      </div>
    );
  }
}
