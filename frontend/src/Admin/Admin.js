import React, { useRef, useEffect, useState } from 'react';
import { Input, Tooltip, Space, Button, Layout, DatePicker, TimePicker, Select, Card, Row, Col, Checkbox, Menu, Dropdown } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import './Admin.css';
import Navbar from '../components/Navbar/Navbar';
import SlotService from "../services/slot.service";
import AuthService from "../services/auth.service";
import history from "../history";
import moment from 'moment';
import axios from "axios";
import { FormProvider } from 'antd/lib/form/context';

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
const API_URL = "http://localhost:5000/api/auth/"; // use for local testing
//const API_URL = "https://gym-worm.herokuapp.com/api/auth/"; // use when deploying to heroku

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
    const dateFormat = "YYYY-MM-DD";
    const timeFormat = "HH"

    const [typeView, setTypeView] = useState('time')

    //Update Auto Slots
    const [startTime, setStartTime] = useState(slotSettings.startTime);
    const [endTime, setEndTime] = useState(slotSettings.endTime);
    const [capacity, setCapacity] = useState(slotSettings.capacity);
    const [updatedAt, setUpdatedAt] = useState(slotSettings.updatedAt);

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

    //Update Existing Slots (E)
    const [capacityUpdateE, setCapacityUpdateE] = useState(slotSettings.capacity);
    const [slots, setSlots] = useState([])
    const arrSlots = [];
    var selectedSlots = []
    const dateUpdateE = useRef(moment().format(dateFormat).toString());

    const onChangeCapacityUpdateE = (e) => {
        setCapacityUpdateE(e.target.value);
    }

    function onChangeUpdateDateE(theDate, dateString) {
        dateUpdateE.current = JSON.parse(JSON.stringify(dateString));
        console.log("date is " + dateUpdateE.current.toString());

        const checkDate = {
            currentDate: dateUpdateE.current,
        }

        SlotService.fetchSlots(checkDate.currentDate).then(
            () => {
                console.log("Finding slots for " + dateUpdateE.current);
                setSlots(SlotService.getCurrentSlots(checkDate.currentDate));
            },
            error => {
                console.log("cant find slot for " + dateUpdateE.current + " " + error);
                alert("No slots that day");
                //window.location.reload(false);
            }
        );
    }

    const onUpdateExistingSlots = (e) => {
        selectedSlots.forEach(value => {
            const slotCreationSettings = {
                fullCapacity: capacityUpdateE === undefined ? value.capacity : capacityUpdateE
            }

            const vacancy = slotCreationSettings.fullCapacity - value.fullCapacity + value.capacity;

            SlotService.updateSlot(value._id, dateUpdateE.current, value.startTime,
                vacancy, slotCreationSettings.fullCapacity)
                .then(() => {
                    alert("Slot Settings have been updated");
                    console.log("Successfully Updated");
                    window.location.reload();
                },
                    err => {
                        alert("Unable to Update");
                        console.log("Unable to update " + err);
                        //window.location.reload();
            });
        })
    }

    console.log(dateUpdateE)

    function DisplayBookings(props) {
        const isChecked = useRef([false, props.slot.date.slice(0, 10), props.slot.startTime]);
        const onChange = (e) => {
            isChecked.current = [e.target.checked, props.slot.date.slice(0, 10), props.slot.startTime];
            console.log(isChecked);
            if (isChecked.current[0]) {
                selectedSlots.push(props.slot)
            } else {
                if (selectedSlots.length !== 0) {
                    selectedSlots = selectedSlots.filter(element => element !== props.slot)
                }
            }
            console.log(selectedSlots);
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

    //Create Slots
    const [capacityCreate, setCapacityCreate] = useState(slotSettings.capacity);
    const dateCreate = useRef(moment().format(dateFormat).toString());
    const timeCreate = useRef(parseInt(moment().format(timeFormat)));

    const onChangeCapacityCreate = (e) => {
        setCapacityCreate(e.target.value);
    }

    const onChangeDateCreate = (e) => {
        dateCreate.current = e.format(dateFormat).toString();
    }

    const onChangeTimeCreate = (e) => {
        timeCreate.current = parseInt(e.format(timeFormat).toString());
    }

    const onCreate = (e) => {
        SlotService.createSlot(dateCreate.current, timeCreate.current, capacityCreate)
            .then(() => {
                alert("Slot Settings have been created");
                console.log("Successfully Created");
                window.location.reload();
            },
                err => {
                    alert("Unable to Create");
                    console.log("Unable to create " + err);
                    //window.location.reload();
                });
    }

    //Apply Demerit Points (D)
    const [slotD, setSlotsD] = useState([])
    const arrSlotsD = [];
    var selectedUsersD = []
    const dateUpdateD = useRef(moment().format(dateFormat).toString());

    function onChangeUpdateDateD(theDate, dateString) {
        dateUpdateD.current = JSON.parse(JSON.stringify(dateString));
        console.log("date is " + dateUpdateD.current.toString());

        const checkDate = {
            currentDate: dateUpdateD.current,
        }

        SlotService.fetchSlots(checkDate.currentDate).then(
            () => {
                console.log("Finding slots for " + dateUpdateD.current);
                setSlotsD(SlotService.getCurrentSlots(checkDate.currentDate));
            },
            error => {
                console.log("cant find slot for " + dateUpdateD.current + " " + error);
                alert("No slots that day");
                //window.location.reload(false);
            }
        );
    }

    const onUpdateExistingSlotsD = (e) => {
        selectedUsersD.forEach(user => {
            AuthService.demeritUser(user._id)
                .then(() => {
                    alert("Demerit success");
                    console.log("Successfully Updated");
                    window.location.reload();
                },
                    err => {
                        alert("Unable to Update");
                        console.log("Unable to update " + err);
                        //window.location.reload();
            });
        })
    }

    function DisplayBookingsD(props) {
        const [users, setUsers] = useState([])
        const [visible, setVisible] = useState(false)
        const isChecked = useRef([false, users]);
        const userArr = [];
        var count = 0;

        const onChange = (e, username) => {
            console.log(e);
            isChecked.current = [e.target.checked, username];
            console.log(isChecked);
            if (isChecked.current[0]) {
                selectedUsersD.push(username);
            } else {
                if (selectedUsersD.length !== 0) {
                    var idx = selectedUsersD.findIndex(p => p._id === username._id);
                    console.log(idx)
                    idx !== -1 && selectedUsersD.splice(idx, 1);
                }
            }
            console.log(selectedUsersD);
        }

        const Time = (time) => { return time < 12 ? `${time}am` : time === 12 ? `${time}pm` : `${time - 12}pm` }

        useEffect(() => {
            const temp = []
            props.slot.userList.forEach(userID => {
                console.log("User ID is " + userID); // booking id
                (async () => {
                    const res = await axios.post(API_URL + 'listSlotCustomers', { userID : userID });
                    const customer = res.data.users;
                    temp.push(customer)
                    if (props.slot.userList.length === temp.length) {
                        setUsers(temp)
                    }
                })()
            })
        }, [])

        console.log(users)
        console.log(props.slot.userList)

        const userNames = (username, count) => {
            console.log(username);
            return (
                <Menu.Item key={`${count}`} >
                        <Checkbox onChange={(e) => onChange(e, username)} style={{marginRight: '8px'}}>
                            {`${username.firstName} ${username.lastName}`}
                        </Checkbox> 
                </Menu.Item>
            )
        }

        const handleMenuClick = e => {
            if (e.key === '3') {
                setVisible(false)
            }
          };
        
        const handleVisibleChange = flag => {
            setVisible(flag)
        };

        const userFrontend = (
            <Menu onClick={handleMenuClick}>
                {
                    users.filter(user => user !== null).forEach(user => {
                        userArr.push(userNames(user, count++))
                    })
                }
                { userArr.map(user => <div> {user} </div>) }
            </Menu>
        ); 
        
        return (
            <div>
                <Card className='bookingStyle'>
                    <Row gutter={3}>
                        <Col span={15} wrap="false">
                            <text className='text'>{`Date: ${props.slot.date.slice(0, 10)}`}</text>
                            <text className='text'>{` \n Time: ${Time(props.slot.startTime)}`}</text>
                            <Dropdown 
                                overlay={userFrontend} 
                                trigger={['click']}
                                onVisibleChange={handleVisibleChange}
                                visible={visible}
                            >
                                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                    {` \n Users`}
                                </a>
                            </Dropdown>
                        </Col>
                    </Row>
                </Card>

            </div>
        );
    }

    //Email Notifications (EN)
    const [usersEN, setUsersEN] = useState([])
    const arrUsersEN = [];

    useEffect(() => {
        (async () => {
            const res = await axios.get(API_URL + 'listEmailNotif', {})
            setUsersEN(res.data.mailingList)
        })()
    }, [])

    function DisplayBookingsEN(props) {
        return (
            <div>
                <Card className='customerNotifStyle'>
                    <Row gutter={3}>
                        <Col span={15} wrap="false">
                            <text className='text'>{`Name: ${props.user.firstName} ${props.user.lastName}`}</text>
                            <text className='text'>{` \n Email: ${props.user.email}`}</text>
                        </Col>
                    </Row>
                </Card>

            </div>
        );
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
                                <PickerWithTypeView type={typeView}/>
                            </Space>
                        </Space>
                    </Row>
                </Card>
                
                <Card style={{whiteSpace: 'pre-line'}}>
                    <Header alignItems="center" style={{ background:'#4C586F', padding: "30px", alignItems: 'center', display: "flex"}}>
                        <h1 style={{color:'#FFFFFF'}}>Auto Slot Creation Settings</h1>
                    </Header>
                    
                    <Row type="flex" justify="center" style={{ padding: 20 }}>
                        <Space direction="vertical" size={'large'} align='center'>
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
                        </Space>
                    </Row>
                </Card>

                <Card style={{whiteSpace: 'pre-line'}}>
                    <Header alignItems="center" style={{ background:'#4C586F', padding: "30px", alignItems: 'center', display: "flex"}}>
                        <h1 style={{color:'#FFFFFF'}}>Update Existing Slot Capacity</h1>
                    </Header>
                    <Row type="flex" justify="center" style={{ padding: 20 }}>
                        <Space direction="vertical" size={'large'} align='center'>
                            <PickerWithTypeSlot type={'Date'} onChange={onChangeUpdateDateE}/>

                            { slots.forEach(element => { arrSlots.push(<DisplayBookings slot={element} />) }) }
                            { arrSlots.map(element => <div> {element} </div>) }

                            <Input style={{ borderRadius: 35, width: "50vw" }}
                                placeholder={"Current Capacity: " + capacityUpdateE}
                                suffix={
                                    <Tooltip title="Capacity">
                                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                    </Tooltip>
                                }
                            />

                            <Input style={{ borderRadius: 35, width: "50vw" }}
                                placeholder={"Full Capcity"}
                                onChange={onChangeCapacityUpdateE}
                                suffix={
                                    <Tooltip title="full capacity">
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
                                    onUpdateExistingSlots();
                                }}
                            >
                                Confirm Changes
                            </Button>
                        </Space>
                    </Row>
                </Card>
                
                
                <Card style={{whiteSpace: 'pre-line'}}>
                    <Header alignItems="center" style={{ background:'#4C586F', padding: "30px", alignItems: 'center', display: "flex"}}>
                        <h1 style={{color:'#FFFFFF'}}>Create Slot</h1>
                    </Header>
                    <Row type="flex" justify="center" style={{ padding: 20 }}>
                        <Space direction="vertical" size={'large'} align='center'>
                            <PickerWithTypeSlot type={'Date'} onChange={onChangeDateCreate}/>
                            <PickerWithTypeSlot type={'time'} onChange={onChangeTimeCreate}/>
                            <Input style={{ borderRadius: 35, width: "50vw" }}
                                placeholder={"Input Capacity"}
                                onChange={onChangeCapacityCreate}
                                suffix={
                                    <Tooltip title="Capacity">
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
                                    onCreate();
                                    console.log(dateCreate)
                                    console.log(timeCreate)
                                    console.log(capacityCreate)
                                }}
                            >
                                Confirm
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
                            <PickerWithTypeSlot type={'Date'} onChange={onChangeUpdateDateD}/>

                            { slotD.filter(value => value.userList.length !== 0).forEach(
                                element => { arrSlotsD.push(<DisplayBookingsD slot={element} />) }) }
                            { arrSlotsD.map(element => <div> {element} </div>) }

                            <Button
                                className="bookingsButtons"
                                type="primary"
                                shape="round"
                                onClick={() => {
                                    onUpdateExistingSlotsD()
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

                            <Card style={{whiteSpace: 'pre-line'}}>
                                <Row type="flex" justify="center" style={{ padding: 20 }}>
                                    <Space direction="vertical" size={'large'} align='center'>
                                    <h1 style={{color:'black'}}>Email Notifications Turned On</h1>
                                    { usersEN.forEach(element => { arrUsersEN.push(<DisplayBookingsEN user={element} />) }) }
                                    { arrUsersEN.map(element => <div> {element} </div>) }
                                    </Space>
                                </Row>
                            </Card>

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