import React, { useRef, useEffect, useState } from 'react';
import { Input, Tooltip, Space, Button, Layout, DatePicker, TimePicker, Select, Card, Row } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import './Admin.css';
import Navbar from '../components/Navbar/Navbar';
import SlotService from "../services/slot.service";
import history from "../history";
import moment from 'moment';

/*
Admin page functions

1) changing auto slot settings

2) view upcoming slots (reuse code) -> select one slot / afew slots and then be able to change the capacity of the slots ~ in display bookings maybe we set it such that if capacity is high we can give it a color then when it gets lower to 0 if its possible to do a gradient to grey? 

3) apply demerit to users -> view bookings that have passed in the last 24hr maybe -> select a slot and see the list of users -> button to apply demerit (will need to work out an algo for this)

4) function to manually execute the auto slot creation one time (slotDate, startTime, ,endTime capacity)

5) list all customers

6) list all customers with the sms / notification as yes -> for contacting purposes.
*/ 

const { Header, Content } = Layout;
const { Option } = Select;

function PickerWithTypeView({ type, onChange }) {
    if (type === 'time') return <TimePicker onChange={onChange} />;
    if (type === 'date') return <DatePicker onChange={onChange} />;
    return <DatePicker picker={type} onChange={onChange} />;
}

function PickerWithTypeSlot({ type, onChange }) {
    if (type === 'time') return <TimePicker onChange={onChange} />;
    if (type === 'date') return <DatePicker onChange={onChange} />;
    return <DatePicker picker={type} onChange={onChange} />;
}

function Admin() {
    const [slotSettings, setSlotSettings] = useState("");
    const [startTime, setStartTime] = useState(slotSettings.startTime);
    const [endTime, setEndTime] = useState(slotSettings.endTime);
    const [capacity, setCapacity] = useState(slotSettings.capacity);
    const [updatedAt, setUpdatedAt] = useState(slotSettings.updatedAt);
    const [typeView, setTypeView] = useState('time')
    const [typeSlot, setTypeSlot] = useState('time')

    const dateFormat = "YYYY-MM-DD";
    const timeFormat = "HH"
    const date = useRef(moment().format(dateFormat).toString());
    const time = useRef(parseInt(moment().format(timeFormat)));

    const originalInfo = {
        startTime,
        endTime,
        capacity
    }

    useEffect(() => {
        async function getSettings() {
            let response = await SlotService.getSlotSettings();
            console.log("Slot Settings are currently : ");
            console.log(response);
            setSlotSettings(response);
            setStartTime(response.startTime);
            setEndTime(response.endTime);
            setCapacity(response.capacity);
            setUpdatedAt(new Date(response.updatedAt).toString());
            originalInfo.startTime = response.startTime;
            originalInfo.endTime = response.endTime;
            originalInfo.capacity = response.capacity;
            //console.log(originalInfo);
        } 
        getSettings()
    }, []);

    const onChangeStartTime = (e) => {
        setStartTime(e.target.value);
    }
    const onChangeEndTime = (e) => {
        setEndTime(e.target.value);
    }
    const onChangeCapacity = (e) => {
        setCapacity(e.target.value);
    }

    const getDateTimeView = (e) => {
        date.current = e.format(dateFormat).toString();
        time.current = parseInt(e.format(timeFormat).toString());
        console.log(date.current, time.current);
    }

    const getDateTimeSlot = (e) => {
        date.current = e.format(dateFormat).toString();
        time.current = parseInt(e.format(timeFormat).toString());
        console.log(date.current, time.current);
    }

    const onUpdate = (e) => {
        const slotCreationSettings = {
            startTime: startTime === undefined ? originalInfo.startTime : startTime,
            endTime: endTime === undefined ? originalInfo.endTime : endTime,
            capacity: capacity === undefined ? originalInfo.capacity : capacity
        }
        console.log("New Slot Settings will be : ");
        console.log(slotCreationSettings);

        SlotService.updateSlotSetting(slotCreationSettings.startTime,
            slotCreationSettings.endTime, slotCreationSettings.capacity)
            .then(() => {
                alert("Slot Settings have been updated");
                console.log("Successfully Updated");
                window.location.reload();
            },
                err => {
                    alert("Unable to Update");
                    console.log("Unable to update " + err);
                    window.location.reload();
                });
    }

    return (
        <div style={{ background: "74828F", alignItems: "center" }}>
            <Navbar />
            <Header className='theTitleAdmin' >
                <h1 className="textHome" >Admin</h1>
            </Header>
            <Layout style={{background:'#FFFFFF', padding: "0px"}}>

                <Card style={{whiteSpace: 'pre-line'}}>
                    <Header alignItems="center" style={{ background:'#4C586F', padding: "30px", alignItems: 'center', display: "flex"}}>
                        <h1 style={{color:'#FFFFFF'}}>View Slots</h1>
                    </Header>
                    <Row type="flex" justify="center" style={{ padding: 20 }}>
                        <Space direction="vertical" size={'large'} align='center'>
                            <Space>
                                <Select value={typeView} onChange={setTypeView}>
                                    <Option value="time">Time</Option>
                                    <Option value="date">Date</Option>
                                </Select>
                                <PickerWithTypeView type={typeView} onChange={getDateTimeView}/>
                            </Space>
                        </Space>
                    </Row>
                </Card>

                <Card style={{whiteSpace: 'pre-line'}}>
                    <Header alignItems="center" style={{ background:'#4C586F', padding: "30px", alignItems: 'center', display: "flex"}}>
                        <h1 style={{color:'#FFFFFF'}}>Slot Settings</h1>
                    </Header>
                    <Row type="flex" justify="center" style={{ padding: 20 }}>
                        <Space direction="vertical" size={'large'} align='center'>
                            <Space>
                                <Select value={typeSlot} onChange={setTypeSlot}>
                                    <Option value="time">Time</Option>
                                    <Option value="date">Date</Option>
                                </Select>
                                <PickerWithTypeSlot type={typeSlot} onChange={getDateTimeSlot}/>
                            </Space>
                            <Input style={{ borderRadius: 35, width: "50vw" }}
                                placeholder={startTime}
                                onChange={onChangeStartTime}
                                suffix={
                                    <Tooltip title="Start Time">
                                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                    </Tooltip>
                                }
                            />
                            <Input style={{ borderRadius: 35, width: "50vw" }}
                                placeholder={endTime}
                                onChange={onChangeEndTime}
                                suffix={
                                    <Tooltip title="End Time">
                                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                    </Tooltip>
                                }
                            />
                            <Input style={{ borderRadius: 35, width: "50vw" }}
                                placeholder={capacity}
                                onChange={onChangeCapacity}
                                suffix={
                                    <Tooltip title="Capacity">
                                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                    </Tooltip>
                                }
                            />
                            <Input style={{ borderRadius: 35, width: "50vw" }}
                                placeholder={updatedAt}
                                suffix={
                                    <Tooltip title="Last Updated At">
                                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                    </Tooltip>
                                }
                            />
                            <Button
                                className="bookingsButtons"
                                type="primary"
                                shape="round"
                                onClick={() => {
                                    console.log("button pressed");
                                    onUpdate();
                                }}
                            >
                                Confirm Changes
                            </Button>

                            <Button
                                className="bookingsButtons"
                                type="primary"
                                shape="round"
                                onClick={() => {
                                    history.push("/Profile");
                                    window.location.reload();
                                }}
                            >
                                Back
                            </Button>
                        </Space>
                    </Row>
                </Card>
                
                <Card style={{whiteSpace: 'pre-line'}}>
                    <Header alignItems="center" style={{ background:'#4C586F', padding: "30px", alignItems: 'center', display: "flex"}}>
                        <h1 style={{color:'#FFFFFF'}}>Credits</h1>
                    </Header>
                    
                    <Row type="flex" justify="center" style={{ padding: 20 }}>
                        <Space direction="vertical" size={'large'} align='center'>
                            <Button
                                className="bookingsButtons"
                                type="primary"
                                shape="round"
                                onClick={() => {
                                    
                                }}
                            >
                                Apply Demerit
                            </Button>
                        </Space>
                    </Row>
                </Card>

                <Card style={{whiteSpace: 'pre-line'}}>
                    <Header alignItems="center" style={{ background:'#4C586F', padding: "30px", alignItems: 'center', display: "flex"}}>
                        <h1 style={{color:'#FFFFFF'}}>Customers</h1>
                    </Header>
                    
                    <Row type="flex" justify="center" style={{ padding: 20 }}>
                        <Space direction="vertical" size={'large'} align='center'>
                            <h1 style={{color:'black'}}>Customers</h1>
                            <h1 style={{color:'black'}}>Notifications</h1>
                            <Button
                                className="bookingsButtons"
                                type="primary"
                                shape="round"
                                onClick={() => {
                                    
                                }}
                            >
                                Apply Demerit
                            </Button>
                        </Space>
                    </Row>
                </Card>


            </Layout>
        </div>
    )
}

export default Admin;