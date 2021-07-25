import React, { useState, useRef, useEffect } from 'react';
import { Button, Space, Row, DatePicker, Breadcrumb, Col, Card, Checkbox, Tabs } from 'antd';
import 'antd/dist/antd.css';
import './Bookings.css'
import moment from 'moment';
import history from './../history';
import SlotService from "../services/slot.service";
import AuthService from "../services/auth.service";
import axios from "axios";

const { TabPane } = Tabs;

const deployTo = "heroku" // change between "local" or "heroku"
const API_URL = (deployTo === "heroku") ? "https://gym-worm.herokuapp.com/api/slot/" : "http://localhost:5000/api/slot/";

function MakeBookings() {
    //history.push('/MakeBookings');

    const currentUser = AuthService.getCurrentUser();

    const dateFormat = "YYYY-MM-DD";
    const date = useRef(moment().format(dateFormat).toString());
    const today = moment();
    const tdy = moment().format(dateFormat)
    const tmr = moment().add(1, 'days').format(dateFormat)
    const dayAfter = moment().add(2, 'days').format(dateFormat)

    let aDate = new Date();
    let aToday = new Date(aDate);
    if (deployTo === "heroku") { // for heroku
        if (aDate.getHours() >= 16) {
            aToday.setHours(24, 0, 0, 0);
        } else {
            aToday.setHours(0, 0, 0, 0);
        }
    } else {
        aToday.setHours(8, 0, 0, 0); // for local
    }

    const todayDate = JSON.stringify(new Date(aToday)).substring(1, 11);
    //console.log(todayDate);

    const [slotsAvail, setSlotAvail] = useState(false)
    const [container, setContainer] = useState(null);
    const [userSlots, setUserSlots] = useState([]);
    const arrSlots = []
    var bookedSlots = []
    const [slots, setSlots] = useState([])

    if (getLength() === 0) { // This is today's available slots
        //console.log(todayDate);
        SlotService.fetchSlots(todayDate).then(
            () => {
                console.log("Finding slots for " + todayDate);
                //setSlots(SlotService.getCurrentSlots(todayDate));
                //slots.push(SlotService.getCurrentSlots(todayDate));
                let tempSlots = SlotService.getCurrentSlots(todayDate);
                tempSlots.sort((first, second) => first.startTime - second.startTime);

                let time = new Date(Date.now()/* + 8 * (60 * 60 * 1000)*/);
                console.log(tempSlots);
                let validSlots = [];

                tempSlots.forEach(s => {
                    //console.log(new Date(s.date).getDate());
                    //console.log(time.getDate());
                    //console.log(s.startTime);
                    //console.log(time.getHours());
                    if (new Date(s.date).getDate() === time.getDate()) {
                        if (s.startTime < time.getHours()) {
                            console.log(s);
                            console.log("should not show");
                        } else {
                            validSlots.push(s);
                        }
                    } else {
                        validSlots.push(s);
                    }
                })

                if (validSlots.length === 0) {
                    console.log("Can't find slots for " + todayDate + " " + error);
                    alert("No slots that day");
                    setSlotAvail(false);
                } else {
                    console.log(validSlots);
                    setSlots(validSlots);
                    getLength() === 0 ? setSlotAvail(false) : setSlotAvail(true);
                }
                //slots.push(validSlots);
            },
            error => {
                console.log("Can't find slots for " + todayDate + " " + error);
                alert("No slots that day");
                setSlotAvail(false)
            }
        );
    }

    useEffect(() => {
        const temp = []
        currentUser.bookings.forEach(slot => {
            //console.log("Booking ID is " + slot); // booking id
            (async () => {
                const res = await axios.post(API_URL + 'retrieveSlot', { bookingID: slot });

                const posts = res.data.slot;
                temp.push(posts);
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

                if (new Date(res.data.slot.date) >= today.getTime()) {
                    if (currentUser.bookings.length === temp.length) {
                        temp.sort((first, second) => first.startTime - second.startTime);
                        setUserSlots(temp);
                    }
                }
            })()
        });
    }, [])

    //console.log(userSlots);

    function onChangeDate(dateString) { // This is other day's available slots
        date.current = JSON.parse(JSON.stringify(dateString));
        console.log("date is " + date.current.toString());

        const checkDate = {
            currentDate: date.current,
        }

        SlotService.fetchSlots(checkDate.currentDate).then(
            () => {
                console.log("Finding slots for " + date.current);
                //setSlots(SlotService.getCurrentSlots(checkDate.currentDate));
                let tempSlots = SlotService.getCurrentSlots(checkDate.currentDate);
                tempSlots.sort((first, second) => first.startTime - second.startTime);

                let time = new Date(Date.now()/* + 8 * (60 * 60 * 1000)*/);
                console.log(tempSlots);
                let validSlots = [];

                tempSlots.forEach(s => {
                    //console.log(new Date(s.date).getDate());
                    //console.log(time.getDate());
                    //console.log(s.startTime);
                    //console.log(time.getHours());
                    if (new Date(s.date).getDate() === time.getDate()) {
                        if (s.startTime < time.getHours()) {
                            console.log(s);
                            console.log("should not show");
                        } else {
                            validSlots.push(s);
                        }
                    } else {
                        validSlots.push(s);
                    }
                })

                if (validSlots.length === 0) {
                    console.log("Can't find slots for " + date.current + " " + error);
                    alert("No slots that day");
                    setSlotAvail(false);
                } else {
                    console.log(validSlots);
                    setSlots(validSlots);
                    getLength() === 0 ? setSlotAvail(false) : setSlotAvail(true)
                }
            },
            error => {
                console.log("Can't find slots for " + date.current + " " + error);
                alert("No slots that day");
                setSlotAvail(false);
                window.location.reload(false);
                //onChangeDate(null, todayDate);
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
            console.log(bookedSlots);
        }

        const Time = (time) => {
            return time < 12 ? `${time}am` : time === 12 ? `${time}pm` : `${time - 12}pm`
        }

        return (
            <div>
                <Card className='bookingStyle'>
                    <Row>
                        <Col wrap="true">
                            <text className='text'>{`Date: ${props.slot.date.slice(0, 10)}`}</text><br />
                            <text className='text'>{`Time: ${Time(props.slot.startTime)}`}</text>
                            <Checkbox className="ant-checkbox" onChange={onChange} /><br />
                            <text className='text'>{`Vacancy: ${props.slot.capacity}`}</text><br />
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
                    {
                        currentUser.banstatus ? <Row /> : slotsAvail ? slots
                            .filter(s => {
                                var test = true;
                                userSlots.forEach(us => {
                                    if (s._id === us._id) {
                                        test = false
                                    }
                                })
                                return test;
                            })
                            .forEach(element => { arrSlots.push(<DisplayBookings slot={element} />) }) : <Row />
                    }

                    <text className="booking">Make Bookings</text>

                    <Tabs defaultActiveKey="1" centered onChange={onChangeDate}>
                        <TabPane tab={`${tdy}`} key={`${tdy}`} centered>
                            <Row justify="center" direction="vertical">
                                <Space
                                    style={{ background: "74828F", alignItems: "center" }}
                                    direction="vertical"
                                    size={'small'}
                                    align='center'
                                >
                                    {arrSlots.map(element => <div> {element} </div>)}
                                </Space>
                            </Row>
                        </TabPane>

                        <TabPane tab={`${tmr}`} key={`${tmr}`}>
                            <Row justify="center" direction="vertical">
                                <Space
                                    style={{ background: "74828F", alignItems: "center" }}
                                    direction="vertical"
                                    size={'small'}
                                    align='center'
                                >
                                    {arrSlots.map(element => <div> {element} </div>)}
                                </Space>
                            </Row>
                        </TabPane>

                        <TabPane tab={`${dayAfter}`} key={`${dayAfter}`}>
                            <Row justify="center" direction="vertical">
                                <Space
                                    style={{ background: "74828F", alignItems: "center" }}
                                    direction="vertical"
                                    size={'small'}
                                    align='center'
                                >
                                    {arrSlots.map(element => <div> {element} </div>)}
                                </Space>
                            </Row>
                        </TabPane>
                    </Tabs>

                    <Button
                        className="bookingsButtons"
                        type="primary"
                        shape="round"
                        disabled={bookingsLen()}
                        onClick={() => {
                            bookedSlots.forEach(elements => {
                                SlotService.bookSlot(elements._id, currentUser.id, currentUser.email).then(() => {
                                    SlotService.recordBooking(elements._id, currentUser.id).then(() => {
                                        console.log("Booking Successful, See you there!");
                                        SlotService.clearCurrentSlots(elements.date.substring(0, 10));
                                        window.location.reload();
                                    })
                                })
                            });
                        }}
                    >
                        Confirm Booking
                    </Button>
                </Space>
            </Row>
        </div>
    )
}

export default MakeBookings;
