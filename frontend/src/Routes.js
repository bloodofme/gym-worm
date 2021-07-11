import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
//import "bootstrap/dist/css/bootstrap.min.css";

import AuthService from "./services/auth.service";

import Home from "./Home/Home";
import Bookings from "./Bookings/Bookings";
import Profile from "./Profile/Profile";
import history from "./history";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";
import Admin from "./Admin/Admin";

class Routes extends Component {
    render() {
        return (
            <BrowserRouter history={history}>
                <Switch>
                <Route exact path="/" >
                        {AuthService.getCurrentUser() !== null ? <Redirect to="/Home" /> : <Login />}
                    </Route>
                    <Route path="/Home" >
                        {AuthService.getCurrentUser() === null ? <Redirect to="/" /> : <Home />}
                    </Route>
                    <Route path="/Bookings" >
                        {AuthService.getCurrentUser() === null ? <Redirect to="/" /> : <Bookings />}
                    </Route>
                    <Route path="/Profile" >
                        {AuthService.getCurrentUser() === null ? <Redirect to="/" /> : <Profile />}
                    </Route>
                    <Route path="/Admin" >
                        {AuthService.getCurrentUser() === null ? <Redirect to="/" /> : localStorage.getItem('access') !== "Admin" ? <Redirect to="/Home" /> : <Admin />}
                    </Route>
                    <Route path="/Signup" >
                        {AuthService.getCurrentUser() !== null ? <Redirect to="/Home" /> : <Signup />}
                    </Route>
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Routes;