import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import { Button, Space, Col, Row, Card, Checkbox, Layout } from 'antd';
import history from "../history";
import 'antd/dist/antd.css';
import './Bookings.css'
import AuthService from "../services/auth.service";
import SlotService from "../services/slot.service";
import axios from "axios";
import Makebookings from "./MakeBookings"
import Deployment from "../DeploymentMethod"

const { Header, Content } = Layout;

const deployTo = Deployment() // change between "local" or "heroku"
const API_URL = (deployTo === "heroku") ? "https://gym-worm.herokuapp.com/api/slot/" : "http://localhost:5000/api/slot/";

function Bookings() {
    //history.push('/Bookings');

    console.log(deployTo)

    const [slots, setSlots] = useState([])
    const currentUser = AuthService.getCurrentUser()

    const arrSlots = []
    var cancelSlots = []

    if (currentUser) {
        AuthService.updateCurrentUser(currentUser.email, currentUser.password);
    }

    if (!window.location.hash.includes("#reloaded")) {
        window.location.href += "#reloaded";
        window.location.reload()
    }

    function DisplayBookings(props) {
        const isChecked = useRef([false, props.slot.date.slice(0, 10), props.slot.startTime]);

        const onChange = (e) => {
            console.log("Selected slot is " + props.slot._id);
            isChecked.current = [e.target.checked, props.slot.date.slice(0, 10), props.slot.startTime];
            console.log(isChecked);
            if (isChecked.current[0]) {
                cancelSlots.push(props.slot);

            } else {
                if (cancelSlots.length !== 0) {
                    cancelSlots = cancelSlots.filter(element => element !== props.slot)
                }
            }
            console.log(cancelSlots);
        }

        const Time = (time) => {
            return time < 12 ? `${time}am` : time === 12 ? `${time}pm` : `${time - 12}pm`
        }

        return (
            <div>
                <Card className='bookingStyle'>
                    <Row>
                        <Col wrap="true">
                            <text className='text'>{`Date: ${props.slot.date.slice(0, 10)}`}</text><br/>
                            <text className='text'>{`Time: ${Time(props.slot.startTime)}`}</text>
                            <Checkbox className="ant-checkbox" onChange={onChange} /><br/>
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }


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
                //today.setHours(0,0,0,0); // for heroku
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

    //console.log(currentUser.bookings)

    return (
        <div style={{ background: "#ebeced", alignItems: "center" }}>
            <Navbar />
            <Header className='bookingsHeader' >
                <h1 className="textHome" >Bookings</h1>
            </Header>
            <Content>
                <Layout className="layout">
                    <Card style={{ padding: "50px" }}>
                        <Row justify="center" direction="vertical">
                            <Space
                                style={{ background: "74828F", alignItems: "center" }}
                                direction="vertical"
                                size={'large'}
                                align='center'
                            >
                                <text className="booking">Current Bookings</text>
                                <Space
                                    style={{ background: "74828F", alignItems: "center", padding: "30px" }}
                                    direction="vertical" size={'small'}
                                    align='center'
                                >
                                    {
                                        slots.forEach(element => 
                                            {
                                                arrSlots.push(<DisplayBookings slot={element[0]} />)
                                                console.log(element)
                                            })
                                    }
                                    {
                                        arrSlots.map(elements => <div> {elements} </div>)
                                    }

                                </Space>
                                <Button
                                    className="bookingsButtons"
                                    type="primary"
                                    shape="round"
                                    onClick={() => {
                                        let x = 0;
                                        cancelSlots.forEach(slot => {
                                            x++;
                                            console.log(slot._id);
                                            console.log(currentUser.bookings);

                                            AuthService.cancelBooking(currentUser.email, slot._id).then(() => {
                                                SlotService.cancelledBooking(slot._id, currentUser.id).then(() => {
                                                    console.log(slot._id);
                                                    if (x === cancelSlots.length) {
                                                        AuthService.updateCurrentUser(currentUser.email, currentUser.password);
                                                        window.location.reload();
                                                    }
                                                })
                                            })

                                        });
                                    }}
                                >
                                    Cancel Bookings
                                </Button>
                            </Space>
                        </Row>
                    </Card>
                    <Card style={{ padding: "50px" }}>
                        <Makebookings />
                    </Card>
                </Layout>
            </Content>
        </div >
    )
}

export default Bookings;