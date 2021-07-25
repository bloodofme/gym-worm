import React, { useEffect, useState, useRef } from 'react';
import { Layout, Row, Col, Space, Card, Breadcrumb } from 'antd';
import 'antd/dist/antd.css';
import './Home.css';
import Navbar from '../components/Navbar/Navbar';
import Credits from './Credits/Credits';
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import history from "../history";
import axios from "axios";
import moment from 'moment';

const { Header, Content } = Layout;

const deployTo = "heroku" // change between "local" or "heroku"

if (deployTo === "heroku") { // for heroku
    const API_URL = "https://gym-worm.herokuapp.com/api/slot/"; // use when deploying to heroku
} else {
    const API_URL = "http://localhost:5000/api/slot/"; // use for local testing
}

document.body.style = 'background: #74828F;';

function Home() {
    const arrSlots = [];
    const [slots, setSlots] = useState([])

    const currentUser = AuthService.getCurrentUser()

    if (currentUser) {
        AuthService.updateCurrentUser(currentUser.email, currentUser.password);
        UserService.getAdminBoard();
    }

    /*useEffect(() => {
        if (AuthService.getCurrentUser() === null) {
            history.push("/");
            window.location.reload(false);
        }
    }, [])*/

    useEffect(() => {
        const temp = [];
        let counter = 0;

        currentUser.bookings.forEach(booking => {
            //console.log("Booking ID is " + slot); // booking id
            (async () => {
                const res = await axios.post(API_URL + 'retrieveSlot', { bookingID: booking });

                const posts = res.data.slot;
                let date = new Date();
                let today = new Date(date);
                if (deployTo === "heroku") { // for heroku
                    if (date.getHours() >= 16) {
                        today.setHours(24, 0, 0, 0);
                    } else {
                        today.setHours(0, 0, 0, 0);
                    }
                } else {
                    today.setHours(8, 0, 0, 0); // for local
                }

                //today.setHours(8, 0, 0, 0); // for local
                //today.setHours(0, 0, 0, 0); // for heroku
                counter++;

                if (new Date(res.data.slot.date).getTime() >= today.getTime()) {
                    temp.push([posts, booking]);
                }

                if (counter === currentUser.bookings.length) {
                    //console.log(temp);
                    temp.sort(function (a, b) {
                        return a[0].date - b[0].date || a[0].startTime - b[0].startTime;
                    });
                    setSlots(temp);
                }
            })()
        });
    }, [])

    //do not remove this!!!
    console.log(slots);

    function DisplayBookings(props) {
        const isChecked = useRef([false, props.slot.date.slice(0, 10), props.slot.startTime]);

        const onChange = (e) => {
            isChecked.current = [e.target.checked, props.slot.date.slice(0, 10), props.slot.startTime];
            console.log(isChecked);
            if (isChecked.current[0]) {
                arrSlots.push(props.slot)
            } else {
                if (arrSlots.length !== 0) {
                    arrSlots = arrSlots.filter(element => element !== props.slot)
                }
            }
            console.log(arrSlots)
        }

        const Time = (time) => {
            return time <= 12 ? `${time}am` : `${time - 12}pm`
        }

        return (
            <div>
                <Card className='card'>
                    <Row gutter={10}>
                        <Col wrap="false">
                            <p1 className='textCard'>{`Date: ${props.slot.date.slice(0, 10)}`}</p1>
                            <p1 className='textCard'>{`\n Time: ${Time(props.slot.startTime)}`}</p1>
                        </Col>
                    </Row>
                </Card>

            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <Layout>
                <Header className='theTitle' >
                    <h1 className="textHome">Welcome to Gym-Worm, {currentUser.firstName + " " + currentUser.lastName} </h1>
                </Header>
                <Content style={{ background: "#74828F" }}>
                    <Layout className='layout'>
                        <Card style={{ whiteSpace: 'pre-line' }}>
                            <Row align='center'>
                                <Space direction="vertical" size={10} align='center'>
                                    <p1 className="textTitle">Bookings</p1>
                                    <Breadcrumb id="slots" >
                                        <Space
                                            style={{ background: "74828F", alignItems: "center" }}
                                            direction="vertical" size={'small'}
                                            align='center'
                                        >
                                            {slots.length === 0 ? null : slots.forEach(element => arrSlots.push(<DisplayBookings slot={element[0]} />))}
                                            {slots.length === 0 ? <p1 className='textSubTitle'> No Bookings </p1> : arrSlots.map(elements => <div> {elements} </div>)}
                                        </Space>
                                    </Breadcrumb>
                                </Space>
                            </Row>
                        </Card>
                        <Card>
                            <Row align='center'>
                                <Space style={{ background: "74828F", alignItems: "center" }}
                                    direction="vertical" size={'small'}
                                    align='center'>
                                    <p1 className="textTitle">Credits</p1>
                                    <Credits></Credits>
                                </Space>
                            </Row>
                        </Card>
                    </Layout>
                </Content>
            </Layout>
        </div>
    )
}

export default Home;