import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Layout, Card, Space, notification } from 'antd';
import 'antd/dist/antd.css';
import './Login.css';
import history from '../history';
import AuthService from "../services/auth.service";
import NavBar from "../components/Navbar/Navbar"

document.body.style = 'background: #74828F;';

const { Header, Content } = Layout;

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

const notifWarning = (message) => {
    notification["warning"]({
        message: 'GymWorm',
        description: message,
        duration: 3.5,
    });
};

const notifOk = (message) => {
    notification["success"]({
        message: 'GymWorm',
        description: message,
        duration: 2,
    });
};

function ChangePassword() {
    const [email, setEmail] = useState('');
    const [tempPassword, setTempPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [disabled, setDisabled] = useState(false);

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const onChangeTempPassword = (e) => {
        setTempPassword(e.target.value);
    }

    const onChangeNewPassword = (e) => {
        setNewPassword(e.target.value);
    }

    const onSubmit = (e) => {
        console.log("Changing Password for " + email);
        AuthService.changePasswordSet(email, tempPassword, newPassword).then(
            (res) => {
                let checker = false;
                if (res.message === "No account with that email found") {
                    notifWarning("No account with that email found. Please check your email and try again.");
                    console.log("Unable to change password, no account found.");
                } else if (res.message === "Reset code is invalid") {
                    notifWarning("Reset code given is invalid. Please check and try again.")
                    console.log("Unable to reset password, reset code invalid.");
                } else if (res.message === "New Password needs to be at least 6 characters!") {
                    notifWarning("New Password needs to be longer than 6 characters. Please try again.")
                    console.log("Unable to change password, new password too short.");
                } else {
                    notifOk("Password has been changed successfully.");
                    console.log("Password Successfully Changed");
                    checker = true;
                }
                setTimeout(
                    () => {
                        if (checker) {
                            history.push("/");
                        } else {
                            history.push("/ChangePassword");
                        }
                        //window.location.reload();
                    },
                    3.5 * 1000
                );
            },
            error => {
                alert("Unable to Change Password");
                console.log("Unable to Change Password");
                console.log(error);
                setTimeout(
                    () => {
                        history.push("/ChangePassword");
                        window.location.reload();
                    },
                    3.5 * 1000
                );
            }
        )
        console.log("Change Password Request Done");
        setTimeout(
            () => {
                history.push("/ChangePassword");
                window.location.reload();
            },
            2 * 1000
        );
    }

    const onFinish = (values) => {
        //console.log('Success:', values);
        setDisabled(false);
    };

    const onFinishFailed = (errorInfo) => {
        //console.log('Failed:', errorInfo);
        setDisabled(true);
    };

    function checkEmail(e) {
        if (typeof e !== 'undefined') {
            let lastAtPos = e.lastIndexOf('@');
            let lastDotPos = e.lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && e.indexOf('@@') === -1 && lastDotPos > 2 && (e.length - lastDotPos) > 2)) {
                return false; // invalid email
            } else {
                return true; // valid email
            }
        } else {
            return false; // invalid email
        }
    }

    useEffect(() => {
        if (email === '' || tempPassword === '' || newPassword === '') {
            setDisabled(true);
        } else {
            if (newPassword.length < 6 || !checkEmail(email)) { // check if password or email not valid
                setDisabled(true);
            } else {
                setDisabled(false);
            }
        }
    });

    return (
        <div>
            <NavBar />
            <Header className='theTitleLogin' >
                <h1 className="textLogin" >Change Password</h1>
            </Header>
            <Layout style={{ background: '#FFFFFF', padding: "0px" }}>
                <Card style={{ whiteSpace: 'pre-line' }}>
                    <Row className="pos" type="flex" justify="vertical" align="center" verticalAlign="middle" >
                        <Form
                            {...layout}
                            name="basic"
                            justify="center"
                            initialValues={{
                                remember: false,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                        >

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your email!',
                                    },
                                    {
                                        type: "email",
                                        message: "The input is not valid E-mail!"
                                    }
                                ]}
                                className="fieldSize"
                            >
                                <Input type="text" onChange={onChangeEmail} value={email} />
                            </Form.Item>

                            <Form.Item
                                label="Reset Code"
                                name="resetCode"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your reset code provided!',
                                    },
                                ]}
                                className="fieldSize"
                            >
                                <Input.Password type="text" onChange={onChangeTempPassword} value={tempPassword} />
                            </Form.Item>

                            <Form.Item
                                label="New Password"
                                name="newPassword"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your new password!',
                                    },
                                    {
                                        min: 6,
                                        message: 'Your password should be more than 6 characters!'
                                    }
                                ]}
                                className="fieldSize"
                            >
                                <Input.Password type="text" onChange={onChangeNewPassword} value={newPassword} />
                            </Form.Item>

                            <Form.Item {...tailLayout}>
                                <Button type="primary"
                                    htmlType="submit"
                                    disabled={disabled}
                                    onClick={() => {
                                        onSubmit()
                                    }}>
                                    Change Password
                                </Button>
                            </Form.Item>
                            <Form.Item {...tailLayout}>
                                <a href="/">Back to Login</a>
                            </Form.Item>
                        </Form>
                    </Row>
                </Card>
            </Layout>
        </div>
    )
}

export default ChangePassword;