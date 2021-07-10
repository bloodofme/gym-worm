import React, { useState, useEffect } from 'react';
import { Avatar, Image, Input, Tooltip, Row, Space, Button } from 'antd';
import { InfoCircleOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import './Information.css';
import history from "../../history";
import AuthService from "../../services/auth.service";

function Information() {
    const [currentUser, setCurrentUser] = useState("");
    const [firstName, setFirstName] = useState(currentUser.firstName);
    const [lastName, setLastName] = useState(currentUser.lastName);
    const [email, setEmail] = useState(currentUser.email);
    const [contactNo, setContactNo] = useState(currentUser.contactNo);
    const [accessStatus] = useState(localStorage.getItem('access'));

    const originalInfo = {
        firstName,
        lastName,
        email,
        contactNo
    }

    useEffect(() => {
        async function getUser() {
            let response = await AuthService.getCurrentUser();
            //console.log("User is : ");
            //console.log(response);

            setCurrentUser(response);
            setFirstName(response.firstName);
            setLastName(response.lastName);
            setEmail(response.email);
            setContactNo(response.contactNo);
            originalInfo.firstName = response.firstName;
            originalInfo.lastName = response.lastName;
            originalInfo.email = response.email;
            originalInfo.contactNo = response.contactNo;
        }
        getUser()
    }, []);

    const onChangeFirstName = (e) => {
        setFirstName(e.target.value);
    }

    const onChangeLastName = (e) => {
        setLastName(e.target.value);
    }

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const onChangeContactNo = (e) => {
        setContactNo(e.target.value);
    }

    const onUpdate = (e) => {
        const user = {
            firstName: firstName === undefined ? originalInfo.firstName : firstName,
            lastName: lastName === undefined ? originalInfo.lastName : lastName,
            email: email === undefined ? originalInfo.email : email,
            contactNo: contactNo === undefined ? originalInfo.contactNo : contactNo
        }

        console.log("New User details are : ");
        console.log(user);

        AuthService.updateInfo(user.firstName, user.lastName, user.email, user.contactNo)
            .then(
                (newUser) => {
                    //alert("Updated");
                    console.log(newUser);
                    AuthService.updateCurrentUser(newUser.email, currentUser.password);
                    console.log("Successfully Updated");
                    window.location.reload();
                },
                error => {
                    alert("Unable to Update");
                    console.log("Unable to update " + error);
                    window.location.reload();
                }
            );
    }

    return (
        <div style={{ background: "74828F", alignItems: "center" }}>
            <Row type="flex" justify="center" style={{ padding: 20 }}>
                <Space direction="vertical" size={'large'} align='center'>
                    <Avatar style={{ alignItems: 'center' }}
                        src={<Image src="https://i.chzbgr.com/full/9355435008/h67614A96/dish" />}
                        size={150}
                    />

                    <Input style={{ display: "flex", borderRadius: 35, width: "50vw" }}
                        placeholder={currentUser.firstName}
                        onChange={onChangeFirstName}
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        suffix={
                            <Tooltip title="First Name">
                                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                        }
                    />

                    <Input style={{ borderRadius: 35, width: "50vw" }}
                        placeholder={currentUser.lastName}
                        onChange={onChangeLastName}
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        suffix={
                            <Tooltip title="Last Name">
                                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                        }
                    />

                    <Input style={{ borderRadius: 35, width: "50vw" }}
                        placeholder={currentUser.email}
                        value={currentUser.email}
                        onChange={onChangeEmail}
                        prefix={<MailOutlined className="site-form-item-icon" />}
                        suffix={
                            <Tooltip title="Email">
                                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                        }
                    />

                    <Input style={{ borderRadius: 35, width: "50vw" }}
                        placeholder={currentUser.contactNo}//{currentUser.contactNo.substring(0,4) + " " + currentUser.contactNo.substring(4,8)}
                        onChange={onChangeContactNo}
                        prefix={<PhoneOutlined className="site-form-item-icon" />}
                        suffix={
                            <Tooltip title="Contact Number">
                                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                        }
                    />

                    <Button
                        type="primary"
                        shape="round"
                        style={{ background: "#4C586F", width: "calc(100px + 1.5vw", border: "none" }}
                        onClick={() => {
                            onUpdate();
                        }}
                    >
                        Update
                    </Button>

                    <Button
                        type="primary"
                        shape="round"
                        style={{ background: "#4C586F", width: "calc(100px + 1.5vw", border: "none", color: "white" }}
                        onClick={() => {
                            AuthService.logout();
                            history.push('/');
                            window.location.reload(false);
                        }}
                    >
                        Log Out
                    </Button>

                    {accessStatus === "Admin" &&
                        <Button
                            type="primary"
                            shape="round"
                            style={{ background: "#4C586F", width: "calc(100px + 1.5vw", border: "none", color: "white" }}
                            onClick={() => {
                                history.push('/Admin');
                                window.location.reload();
                            }}
                        >
                            Admin Page
                        </Button>
                    }

                </Space>
            </Row>
        </div>
    )
}

export default Information;