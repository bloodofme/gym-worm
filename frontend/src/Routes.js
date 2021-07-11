import React, { Component } from "react";
import { BrowserRouter, Switch, Redirect } from "react-router-dom";
import Route from "react-router-dom/Route";
//import "bootstrap/dist/css/bootstrap.min.css";

import AuthService from "./services/auth.service";

import Home from "./Home/Home";
import Bookings from "./Bookings/Bookings";
import Profile from "./Profile/Profile";
import history from "./history";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";
import MakeBookings from "./Bookings/MakeBookings"
import Notifications from "./Profile/Notif/Notif"
import Info from "./Profile/Information/Information"
import Information from "./Profile/Information/Information";
import Admin from "./Admin/Admin";

class Routes extends Component {
    render() {
        return (
            <BrowserRouter history={history}>
                <Switch>
                    <Route path="/" exact component={Login} />
                    <Route path="/Home" >
                        { AuthService.getCurrentUser() === null ? <Redirect to="/" /> : <Home /> }
                    </Route>
                    <Route path="/Bookings" >
                        { AuthService.getCurrentUser() === null ? <Redirect to="/" /> : <Bookings /> }
                    </Route>
                    <Route path="/Profile" >
                        { AuthService.getCurrentUser() === null ? <Redirect to="/" /> : <Profile /> }
                    </Route>
                    <Route path="/Notifications" >
                        { AuthService.getCurrentUser() === null ? <Redirect to="/" /> : <Notifications /> }
                    </Route>
                    <Route path="/Information" >
                        { AuthService.getCurrentUser() === null ? <Redirect to="/" /> : <Information /> }
                    </Route>
                    <Route path="/Admin" >
                        { AuthService.getCurrentUser() === null ? <Redirect to="/" /> : <Admin /> }
                    </Route>
                    <Route path="/Signup" component={Signup} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Routes;