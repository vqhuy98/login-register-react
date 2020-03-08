import React from "react";
import axios from "axios";

export class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      email: "",
      fullname: "",
      firstSide: "",
      isLoading: false,
      isFailed: false,
      isnameValid: false,
      isEmailValid: false,
      usernameMessage: "",
      emailMessage: "",
      emailValid: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (prop, value) => {
    const seft = this;
    seft.setState({ [prop]: value });
  };

  handleOnBlur = async (prop, value) => {
    const seft = this;
    if (prop === "email" && value != "") {
      var em = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
      seft.setState({ emailValid: em });
      if (em != null) {
        await seft.callValidateApi(prop, value);
      } else {
        seft.setState({ isEmailValid: false });
      }
    }
    if (prop === "username" && value != "") {
      await seft.callValidateApi(prop, value);
    }
    if (prop == "email" && value === "") {
      seft.setState({ isEmailValid: false });
    }
    if (prop == "username" && value === "") {
      seft.setState({ isnameValid: false });
    }
    console.log(seft.state.isEmailValid, seft.state.isnameValid);
  };

  callValidateApi = (prop, value) => {
    const seft = this;
    axios
      .get("https://localhost:44322/api/WebOwner/check", {
        params: {
          [prop]: value
        }
      })
      .then(function(response) {
        console.log(response);
        let data = response.data;
        if (data.type === "ERROR") {
          if (prop === "username") {
            seft.state.usernameMessage = data.nameMessage;
            seft.setState({ isnameValid: false });
          }

          if (prop === "email") {
            seft.state.emailMessage = data.emailMessage;
            seft.setState({ isEmailValid: false });
          }
        } else {
          if (prop === "username") {
            seft.state.usernameMessage = "";
            seft.setState({ isnameValid: true });
          }

          if (prop === "email") {
            seft.state.emailMessage = "";
            seft.setState({ isEmailValid: true });
          }
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  async handleSubmit(event) {
    event.preventDefault();
    const self = this;
    if (
      self.state.isnameValid &&
      self.state.isEmailValid &&
      this.state.fullname !== "" &&
      this.state.password !== "" &&
      this.state.firstSide !== ""
    ) {
      await self.setState({ isLoading: true });
      await self.setState({ isFailed: false });
      this.callRegisterApi();
    } else {
      alert("can not register");
    }
  }

  callRegisterApi = () => {
    const seft = this;
    axios({
      method: "post",
      url: "https://localhost:44322/api/WebOwner",
      data: {
        Username: this.state.username,
        Email: this.state.email,
        FullName: this.state.fullname,
        Password: this.state.password,
        WebUrl: this.state.firstSide
      }
    })
      .then(function(response) {
        console.log(response);
        seft.setState({ isLoading: false });
        alert("Register success, please login to use!");
        seft.props.isRegistered();
      })
      .catch(function(error) {
        console.log(error);
        seft.setState({ isLoading: false });
        seft.setState({ isFailed: true });
      });
  };

  render() {
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Register</div>
        <div className="content">
          <form className="form" onSubmit={this.handleSubmit}>
            {this.state.isFailed && (
              <p style={{ color: "red" }}>Register failed.</p>
            )}
            <div className="form-group">
              <label htmlFor="username">
                {this.state.usernameMessage !== "" && (
                  <span style={{ color: "red" }}>
                    {this.state.usernameMessage}
                  </span>
                )}
                {this.state.usernameMessage === "" && "Username"}
              </label>
              <input
                onBlur={e => this.handleOnBlur(e.target.name, e.target.value)}
                type="text"
                name="username"
                placeholder="username"
                value={this.state.username}
                onChange={e => this.handleChange(e.target.name, e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">
                {this.state.emailMessage !== "" && (
                  <span style={{ color: "red" }}>
                    {this.state.emailMessage}
                  </span>
                )}
                {this.state.emailMessage === "" && "Email "}
                {this.state.emailValid === null && (
                  <span style={{ color: "red" }}>wrong format</span>
                )}
              </label>
              <input
                onBlur={e => this.handleOnBlur(e.target.name, e.target.value)}
                type="text"
                name="email"
                placeholder="email"
                value={this.state.email}
                onChange={e => this.handleChange(e.target.name, e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="text"
                name="password"
                placeholder="password"
                value={this.state.password}
                onChange={e => this.handleChange(e.target.name, e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="fullname">Full name</label>
              <input
                type="text"
                name="fullname"
                placeholder="Full name"
                value={this.state.fullname}
                onChange={e => this.handleChange(e.target.name, e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="firstSide">First Side</label>
              <input
                type="text"
                name="firstSide"
                placeholder="First side"
                value={this.state.firstSide}
                onChange={e => this.handleChange(e.target.name, e.target.value)}
              />
            </div>
            <div className="footer">
              <input type="submit" className="btn" value="Register" />
              {(!this.state.isEmailValid ||
                !this.state.isnameValid ||
                this.state.fullname === "" ||
                this.state.password === "" ||
                this.state.firstSide === "") && (
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/6/65/Crystal_button_cancel.svg"
                  alt="photo"
                  style={{ width: "20px", height: "20px", marginLeft: "10px" }}
                />
              )}
            </div>
          </form>
          {this.state.isLoading && <p>loading...</p>}
        </div>
      </div>
    );
  }
}
