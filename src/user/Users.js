import React, { Component } from "react";
import { list } from "./apiUser";
import DefaultProfile from "../images/avatar.jpg";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import axios from "axios";

class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    list().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data });
      }
    });
  }

  api = () => {
    list().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data });
      }
    });
  };

  renderUsers = (users) => (
    <div className="row">
      {users.map((user, i) => (
        <div className="card col-md-4" key={i}>
          <img
            style={{ height: "200px", width: "auto" }}
            className="img-thumbnail"
            src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
            onError={(i) => (i.target.src = `${DefaultProfile}`)}
            alt={user.name}
          />
          <div className="card-body">
            <h5 className="card-title">{user.name}</h5>
            <p className="card-text">{user.email}</p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Link
                to={`/user/${user._id}`}
                className="btn btn-raised btn-primary btn-sm"
              >
                View Profile
              </Link>
              {(() => {
                const loggedInUser = JSON.parse(localStorage.getItem("jwt"));
                if (
                  loggedInUser &&
                  loggedInUser.user &&
                  loggedInUser.user.role === "admin"
                ) {
                  return (
                    <p
                      onClick={async () => {
                        if (
                          window.confirm(
                            "Are you sure you want to delte this user"
                          )
                        ) {
                          const token = isAuthenticated().token;
                          if (token) {
                            await axios
                              .delete(
                                `${process.env.REACT_APP_API_URL}/delete/${user._id}`,
                                {
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                }
                              )
                              .then(() => {
                                this.api();
                              });
                          }
                        }
                      }}
                      className="btn btn-raised btn-primary btn-sm"
                    >
                      Delete user
                    </p>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  render() {
    const { users } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Users</h2>

        {this.renderUsers(users)}
      </div>
    );
  }
}

export default Users;
