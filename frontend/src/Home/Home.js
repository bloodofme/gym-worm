import React, { useEffect, useState, useRef } from 'react';
import { Layout, Row, Col, Space, Card, Breadcrumb } from 'antd';
import 'antd/dist/antd.css';
import './Home.css';
import Navbar from '../components/Navbar/Navbar';
import Credits from './Credits/Credits';
import AuthService from "../services/auth.service";
import axios from "axios";
import Deployment from "../DeploymentMethod";

const { Header, Content } = Layout;

const deployTo = Deployment() // change between "local" or "heroku"
const API_URL = (deployTo === "heroku") ? "https://gym-worm.herokuapp.com/api/slot/" : "http://localhost:5000/api/slot/";

document.body.style = 'background: #74828F;';

function Home() {
    const arrSlots = [];
    const [slots, setSlots] = useState([])
    const currentUser = AuthService.getCurrentUser()

    if (currentUser) {
        AuthService.updateCurrentUser(currentUser.email, currentUser.password);
    }

    useEffect(() => {
        const temp = [];
        let counter = 0;

        let date = new Date();
        let today = new Date(date);
        today.setHours(8, 0, 0, 0);

        currentUser.bookings.forEach(booking => {
            (async () => {
                const res = await axios.post(API_URL + 'retrieveSlot', { bookingID: booking });
                const posts = res.data.slot;

                counter++;

                if (new Date(res.data.slot.date).getTime() > today.getTime()) {
                    temp.push([posts, booking]);
                } else if (new Date(res.data.slot.date).getTime() === today.getTime()) {
                    if (res.data.slot.startTime >= date.getHours()) {
                        temp.push([posts, booking]);
                    }
                }

                if (counter === currentUser.bookings.length) {
                    temp.sort(function (a, b) {
                        if (a[0].date === b[0].date) {
                            return a[0].startTime - b[0].startTime;
                        } else {
                            return a[0].date - b[0].date;
                        }
                    });
                    setSlots(temp);
                }
            })()
        });
    }, [])

    function DisplayBookings(props) {
        const Time = (time) => {
            return time < 12 ? `${time}am` : time === 12 ? `${time}pm` : `${time - 12}pm`
        }

        return (
            <div>
                <Card className='card'>
                    <Row gutter={10}>
                        <Col wrap="false">
                            <p1 className='textCard'>{`Date: ${props.slot.date.slice(0, 10)}`}</p1><br />
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
                    <h1 className="textHome">Welcome to GymWorm, {currentUser.firstName + " " + currentUser.lastName} </h1>
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