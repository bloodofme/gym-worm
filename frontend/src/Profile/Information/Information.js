import React, { useState, useEffect } from 'react';
import { Avatar, Image, Input, Tooltip, Row, Space, Button, notification } from 'antd';
import { InfoCircleOutlined, UserOutlined, MailOutlined, PhoneOutlined, MessageOutlined } from '@ant-design/icons';
import './Information.css';
import history from "../../history";
import AuthService from "../../services/auth.service";

const notifWarning = (message) => {
    notification["warning"]({
        message: 'GymWorm',
        description: message,
        duration: 2.5,
    });
};

const notifOk = (message) => {
    notification["success"]({
        message: 'GymWorm',
        description: message,
        duration: 2.5,
    });
};

function Information() {
    const [currentUser, setCurrentUser] = useState("");
    const [firstName, setFirstName] = useState(currentUser.firstName);
    const [lastName, setLastName] = useState(currentUser.lastName);
    const [email, setEmail] = useState(currentUser.email);
    const [contactNo, setContactNo] = useState(currentUser.contactNo);
    const [telegramHandle, setTelegramHandle] = useState(currentUser.telegramHandle);
    const [accessStatus] = useState(sessionStorage.getItem('access'));

    useEffect(() => {
        async function getUser() {
            let response = await AuthService.getCurrentUser();

            setCurrentUser(response);
            setFirstName(response.firstName);
            setLastName(response.lastName);
            setEmail(response.email);
            setContactNo(response.contactNo);
            setTelegramHandle(response.telegramHandle)
        }
        getUser()
    }, []);

    const onChangeFirstName = (e) => {
        setFirstName(e.target.value);
    }

    const onChangeLastName = (e) => {
        setLastName(e.target.value);
    }

    const onChangeContactNo = (e) => {
        setContactNo(e.target.value);
    }
    const onChangeTelegramHandle = (e) => {
        setTelegramHandle(e.target.value);
    }

    const onUpdate = (e) => {
        const user = {
            firstName: firstName === undefined ? currentUser.firstName : firstName,
            lastName: lastName === undefined ? currentUser.lastName : lastName,
            email: email === undefined ? currentUser.email : email,
            contactNo: contactNo === undefined ? currentUser.contactNo : contactNo,
            telegramHandle: telegramHandle === undefined ? currentUser.telegramHandle : (telegramHandle.charAt(0) === '@' ? telegramHandle.slice(1) : telegramHandle)
        }

        /*console.log("Current User details are : ");
        console.log(currentUser.contactNo);

        console.log("New User details are : ");
        console.log(user);
        console.log(user.contactNo);*/

        AuthService.updateInfo(user.firstName, user.lastName, user.email, user.contactNo, currentUser.roles, user.telegramHandle)
            .then(
                (res) => {
                    if (res.message === "New Contact Number is Invalid! Should be 8 digits.") {
                        notifWarning("New Contact Number is Invalid! Should be 8 digits.");
                        console.log("Unable to Update, contact number is not 8 digits");
                    } else if (res.message === "New Contact Number is Invalid! Should start with 8 or 9.") {
                        notifWarning("New Contact Number is Invalid! Should start with 8 or 9.");
                        console.log("Unable to Update");
                    } else {
                        notifOk("Updated");
                        console.log("Successfully Updated");
                    }
                },
                error => {
                    notifWarning("Unable to Update");
                    console.log(error);
                }
            )
            .then(() => {
                setTimeout(
                    () => {
                        window.location.reload();
                    },
                    2.5 * 1000
                );
            })
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
                        prefix={<MailOutlined className="site-form-item-icon" />}
                        suffix={
                            <Tooltip title="Email">
                                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                        }
                    />

                    <Input style={{ borderRadius: 35, width: "50vw" }}
                        placeholder={currentUser.contactNo}
                        onChange={onChangeContactNo}
                        prefix={<PhoneOutlined className="site-form-item-icon" />}
                        suffix={
                            <Tooltip title="Contact Number">
                                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                            </Tooltip>
                        }
                    />

                    <Input style={{ borderRadius: 35, width: "50vw" }}
                        placeholder={currentUser.telegramHandle}
                        onChange={onChangeTelegramHandle}
                        prefix={<MessageOutlined className="site-form-item-icon" />}
                        suffix={
                            <Tooltip title="Telegram Handle">
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

                    {
                        accessStatus === "Admin" &&
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