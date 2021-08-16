import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import AuthService from "./services/auth.service";

import Home from "./Home/Home";
import Bookings from "./Bookings/Bookings";
import Profile from "./Profile/Profile";
import history from "./history";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";
import Admin from "./Admin/Admin";
import ForgotPass from "./Login/ForgotPassword"
import ChangePass from "./Login/ChangePassword"

class Routes extends Component {
    render() {
        return (
            <BrowserRouter history={history}>
                <Switch>
                <Route exact path="/" >
                        {AuthService.getCurrentUser() !== null ? <Redirect to="/Home" /> : <Login />}
                    </Route>
                    <Route path="/Home" >
                        {AuthService.getCurrentUser() === null ? <Redirect to="/" /> : sessionStorage.getItem('access') === "Admin" ? <Redirect to="/Admin" /> : <Home />}
                    </Route>
                    <Route path="/Bookings" >
                        {AuthService.getCurrentUser() === null ? <Redirect to="/" /> : sessionStorage.getItem('access') === "Admin" ? <Redirect to="/Admin" /> : <Bookings />}
                    </Route>
                    <Route path="/Profile" >
                        {AuthService.getCurrentUser() === null ? <Redirect to="/" /> : <Profile />}
                    </Route>
                    <Route path="/Admin" >
                        {AuthService.getCurrentUser() === null ? <Redirect to="/" /> : sessionStorage.getItem('access') !== "Admin" ? <Redirect to="/Home" /> : <Admin />}
                    </Route>
                    <Route path="/Signup" >
                        {AuthService.getCurrentUser() !== null ? <Redirect to="/Home" /> : <Signup />}
                    </Route>
                    <Route path="/Login" >
                        {AuthService.getCurrentUser() !== null ? <Redirect to="/Home" /> : <Login />}
                    </Route>
                    <Route path="/ForgotPassword" >
                        {AuthService.getCurrentUser() !== null ? <Redirect to="/Home" /> : <ForgotPass />}
                    </Route>
                    <Route path="/ChangePassword" >
                        {AuthService.getCurrentUser() !== null ? <Redirect to="/Home" /> : <ChangePass />}
                    </Route>
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Routes;