import React, { Component } from 'react';
import { Row, Space, Switch } from 'antd';
import 'antd/dist/antd.css';
import AuthService from "../../services/auth.service";
import './../Profile.css'

class Notif extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: AuthService.getCurrentUser()
        };
    }

    render() {
        const { currentUser } = this.state;

        function emailNotifChange(checked) {
            AuthService.updateEmailNotifications(currentUser.email, checked)
                .then(
                    (newUser) => {
                        AuthService.updateCurrentUser(newUser.email, currentUser.password);
                        console.log("Successfully Updated");
                    },
                    error => {
                        alert("Unable to Update");
                        console.log("Unable to update " + error);
                        window.location.reload();
                    }
                );
        }

        function smsNotifChange(checked) {
            AuthService.updateSMSNotifications(currentUser.email, checked)
                .then(
                    (newUser) => {
                        AuthService.updateCurrentUser(newUser.email, currentUser.password);
                        console.log("Successfully Updated");
                    },
                    error => {
                        alert("Unable to Update");
                        console.log("Unable to update " + error);
                        window.location.reload();
                    }
                );
        }

        function telegramNotifChange(checked) {
            AuthService.updateTelegramNotifications(currentUser.email, checked)
                .then(
                    (newUser) => {
                        AuthService.updateCurrentUser(newUser.email, currentUser.password);
                        console.log("Successfully Updated");
                    },
                    error => {
                        alert("Unable to Update");
                        console.log("Unable to update " + error);
                        window.location.reload();
                    }
                );
        }

        return (
            <div style={{ alignItems: "center" }}>
                <Row justify="center" style={{ padding: 10 }}>
                    <Space direction="vertical" size={'large'} align='center'>
                        <Space size={'large'} align='center'>
                        <h1 className="textProfile">Toggle Email Notifications</h1>
                        <Switch
                            style={{bottom: "4px"}}
                            defaultChecked={currentUser.emailNotification}
                            onChange={emailNotifChange}
                        />
                        </Space>

                        <Space size={'large'} align='center'>
                        <h1 className="textProfile">Toggle SMS Notifications</h1>
                        <Switch
                            style={{bottom: "4px"}}
                            defaultChecked={currentUser.contactNotification}
                            onChange={smsNotifChange}
                        />
                        </Space>

                        <Space size={'large'} align='center'>
                        <h1 className="textProfile">Toggle Telegram Notifications</h1>
                        <Switch
                            style={{bottom: "4px"}}
                            defaultChecked={currentUser.telegramNotification}
                            onChange={telegramNotifChange}
                        />
                        </Space>
                    </Space>
                </Row>
            </div>
        )
    }
}

export default Notif;