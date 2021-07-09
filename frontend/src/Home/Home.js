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

const { Header, Content } = Layout;
const API_URL = "https://gym-worm.herokuapp.com/api/slot/" || "http://localhost:5000/api/slot/";
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
        const temp = []
        currentUser.bookings.forEach(slot => {
            (async () => {
                const res = await axios.post(API_URL + 'retrieveSlot', { bookingID: slot });
                const posts = res.data.slot;
                temp.push([posts, slot])
                if (temp.length === currentUser.bookings.length) {
                    setSlots(temp)
                }
                console.log(temp)
            })()
        })

    }, [])

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
                            <p1 className='textCard'>{` \n Time: ${Time(props.slot.startTime)}`}</p1>
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
                <Header  className='theTitle' >
                    <h1 className="textHome">Welcome to Gym-worm, {currentUser.firstName + " " + currentUser.lastName} </h1>
                </Header>
                <Content style={{ background: "#74828F" }}>
                    <Layout className='layout'>
                        <Card style={{whiteSpace: 'pre-line'}}>
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