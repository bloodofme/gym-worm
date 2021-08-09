import React, { Component } from 'react';
import { Row, Space, Switch, Col } from 'antd';
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
                    <Space direction="vertical" size={'large'} align='left'>
                        <Row align='middle'>
                            <Col span={18}>
                                <h1 className="textProfile">Email</h1>
                            </Col>
                            <Col span={6}>
                                <Switch
                                    style={{bottom: "4px"}}
                                    defaultChecked={currentUser.emailNotification}
                                    onChange={emailNotifChange}
                                />
                            </Col>
                        </Row>
                        
                        <Row align='middle'>
                            <Col span={18}>
                                <h1 className="textProfile">SMS</h1>
                            </Col>
                            <Col span={6}>
                                <Switch
                                    style={{bottom: "4px"}}
                                    defaultChecked={currentUser.contactNotification}
                                    onChange={smsNotifChange}
                                />
                            </Col>
                        </Row>

                        <Row align='middle'>
                            <Col span={18}>
                                <h1 className="textProfile">Telegram</h1>
                            </Col>
                            <Col span={6}>
                                <Switch
                                    style={{bottom: "4px"}}
                                    defaultChecked={currentUser.telegramNotification}
                                    onChange={telegramNotifChange}
                                />
                            </Col>
                        </Row>
                    </Space>
                </Row>
            </div>
        )
    }
}

export default Notif;