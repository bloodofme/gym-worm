import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import { Button, Space, Row, DatePicker, Breadcrumb, Col, Card, Checkbox } from 'antd';
import 'antd/dist/antd.css';
import './Bookings.css'
import moment from 'moment';
import history from './../history';
import { Input, Tooltip } from 'antd';
import { InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import SlotService from "../services/slot.service";
import AuthService from "../services/auth.service";
import axios from "axios";

function MakeBookings() {
    //history.push('/MakeBookings');

    const currentUser = AuthService.getCurrentUser();
    
    const API_URL = "http://localhost:5000/api/slot/"; // use for local testing
    //const API_URL = "https://gym-worm.herokuapp.com/api/slot/"; // use when deploying to heroku

    const dateFormat = "YYYY-MM-DD";
    const date = useRef(moment().format(dateFormat).toString());
    const today = moment();
    const todayDate = JSON.stringify(new Date()).substring(1, 11);

    const [slotsAvail, setSlotAvail] = useState(false)
    const [container, setContainer] = useState(null);
    const [userSlots, setUserSlots] = useState([]);
    const arrSlots = []
    var bookedSlots = []
    const [slots, setSlots] = useState([])

    if (getLength() === 0) {
        SlotService.fetchSlots(todayDate).then(
            () => {
                console.log("finding slots for " + todayDate);
                setSlots(SlotService.getCurrentSlots(todayDate));
                getLength() === 0 ? setSlotAvail(false) : setSlotAvail(true)

            },
            error => {
                console.log("cant find slot " + todayDate + " " + error);
                alert("No slots that day");
                setSlotAvail(false)
            }
        );
    }

    useEffect(() => {
        const temp = []
        currentUser.bookings.forEach(slot => {
            (async () => {
                //console.log("Booking ID is " + slot); // booking id
                const res = await axios.post(API_URL + 'retrieveSlot', { bookingID: slot });
                if (new Date(res.data.slot.date) >= new Date().setHours(-8, 0, 0, 0)) {
                    const posts = res.data.slot;
                    temp.push([posts, slot])
                    setSlots(temp)
                }
            })()
        })

    }, [])

    //console.log(userSlots);

    function onChangeDate(theDate, dateString) {
        date.current = JSON.parse(JSON.stringify(dateString));
        console.log("date is " + date.current.toString());

        const checkDate = {
            currentDate: date.current,
        }

        console.log("date is " + checkDate);
        console.log("slots are " + slots);

        SlotService.fetchSlots(checkDate.currentDate).then(
            () => {
                console.log("finding slots for " + date.current);
                setSlots(SlotService.getCurrentSlots(checkDate.currentDate).filter(s => {
                    var test = true;
                    userSlots.forEach(us => {
                        if (s._id === us._id) {
                            test = false
                        }
                    })
                    return test;
                }));
                console.log(slots)
                getLength() === 0 ? setSlotAvail(false) : setSlotAvail(true)
            },
            error => {
                console.log("cant find slot for " + date.current + " " + error);
                alert("No slots that day");
                setSlotAvail(false)
            }
        );
    }

    function getLength() {      // these are for testing, can remove later
        if (slots.length !== 0) {
            return slots.length;
        }
        return 0;
    }

    function bookingsLen() {
        return bookedSlots.length > 2 ? true : false;
    }

    function DisplayBookings(props) {
        const isChecked = useRef([false, props.slot.date.slice(0, 10), props.slot.startTime]);
        const onChange = (e) => {
            isChecked.current = [e.target.checked, props.slot.date.slice(0, 10), props.slot.startTime];
            console.log(isChecked);
            if (isChecked.current[0]) {
                bookedSlots.push(props.slot)
            } else {
                if (bookedSlots.length !== 0) {
                    bookedSlots = bookedSlots.filter(element => element !== props.slot)
                }
            }
            console.log(bookedSlots)
        }

        const Time = (time) => {
            return time < 12 ? `${time}am` : time === 12 ? `${time}pm` : `${time - 12}pm`
        }

        return (
            <div>
                <Card className='bookingStyle'>
                    <Row gutter={3}>
                        <Col span={15} wrap="false">
                            <text className='text'>{`Date: ${props.slot.date.slice(0, 10)}`}</text>
                            <text className='text'>{` \n Time: ${Time(props.slot.startTime)}`}</text>
                            <text className='text'>{` \n Vacancy: ${props.slot.capacity}`}</text>
                        </Col>
                        <Col span={5}>
                            <Checkbox className="ant-checkbox" onChange={onChange} />
                        </Col>
                    </Row>
                </Card>

            </div>
        );
    }



    return (
        <div style={{ background: "74828F", alignItems: "center" }}>
            <Row justify="center" direction="vertical">
                <Space
                    style={{ background: "74828F", alignItems: "center" }}
                    direction="vertical"
                    size={'large'}
                    align='center'
                >
                    <text className="booking">Make Bookings</text>
                    {                        
                        slotsAvail ? slots.forEach(element => {arrSlots.push(<DisplayBookings slot={element}/>)}) : <Row/> 
                    }
                    <Space >
                        <DatePicker
                            defaultValue={today}
                            onChange={onChangeDate}
                        />
                    </Space>
                    <Breadcrumb target={() => container}>
                        <Space
                            style={{ background: "74828F", alignItems: "center" }}
                            direction="vertical"
                            size={'small'}
                            align='center'
                        >
                            {arrSlots.map(element => <div> {element} </div>)}
                        </Space>
                    </Breadcrumb>
                    <Button
                        className="bookingsButtons"
                        type="primary"
                        shape="round"
                        disabled={bookingsLen()}
                        onClick={() => {
                            bookedSlots.forEach(elements => {
                                SlotService.bookSlot(elements._id, currentUser.id, currentUser.email).then(() => {
                                    SlotService.recordBooking(elements._id, currentUser.id)
                                });
                                console.log("Booking Successful, See you there!");
                                console.log(elements);
                                console.log(elements.date.substring(0, 10));
                                SlotService.clearCurrentSlots(elements.date.substring(0, 10));
                            });
                            alert("Booking successful");
                            //AuthService.updateCurrentUser(currentUser.email, currentUser.password);
                            window.location.reload();

                        }}
                    >
                        Confirm Booking
                    </Button>
                    <Button
                        className="bookingsButtons"
                        type="primary"
                        shape="round"
                        disabled={bookingsLen()}
                        onClick={() => {
                            history.push("/Bookings")
                            //AuthService.updateCurrentUser(currentUser.email, currentUser.password);
                            window.location.reload();
                        }}
                    >
                        Back
                    </Button>
                </Space>
            </Row>
        </div>
    )
}

export default MakeBookings;