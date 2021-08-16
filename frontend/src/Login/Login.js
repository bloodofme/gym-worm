import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Layout, Card, Space, notification } from 'antd';
import 'antd/dist/antd.css';
import './Login.css';
import history from './../history';
import AuthService from "../services/auth.service";
import NavBar from "../components/Navbar/Navbar"

document.body.style = 'background: #74828F;';

const { Header } = Layout;

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

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [accessStatus] = useState(sessionStorage.getItem('access'));

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const onSubmit = (e) => {
        const user = {
            email: email,
            password: password,
        }

        console.log("Login request");
        AuthService.login(user.email, user.password).then(
            () => {
                notifOk("Login Successful.");
                console.log("Successfully Logged In");
                setTimeout(
                    () => {
                        accessStatus === 'Admin' ? history.push('/Admin') : history.push("/Home");
                        window.location.reload();
                    },
                    2 * 1000
                );
            },
            error => {
                if (error.response.data.message === "No user to check") {
                    notifWarning("No account with that email found. Please check your email and try again.");
                    console.log("Unable to login, no account found.");
                } else if (error.response.data.message === "Invalid Password!") {
                    notifWarning("Password is invalid. Please try again.")
                    console.log("Unable to login, password invalid.");
                } else {
                    notifWarning("Unable to login.");
                    console.log("Unable to login " + error.response.data.message);
                }
                setTimeout(
                    () => {
                        history.push("/");
                        window.location.reload();
                    },
                    3.5 * 1000
                );
            }
        );
    }

    const onFinish = (values) => {
        setDisabled(false);
    };

    const onFinishFailed = (errorInfo) => {
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
        if (email === '' || password === '') {
            setDisabled(true);
        } else {
            if (password.length < 6 || !checkEmail(email)) { // check if password or email not valid
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
                <h1 className="textLogin" >Login to GymWorm</h1>
            </Header>
            <Layout style={{ background: '#FFFFFF', padding: "0px" }}>
                <Card style={{ whiteSpace: 'pre-line' }}>
                    <Row className="pos" type="flex" justify="vertical" align="center" verticalAlign="middle" >
                        <Form
                            {...layout}
                            name="basic"
                            justify="center"
                            initialValues={{
                                remember: true,
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
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                    {
                                        min: 6,
                                        message: 'Your password should be more than 6 characters!'
                                    }
                                ]}
                                className="fieldSize"
                            >
                                <Row>
                                    <Input.Password type="text" onChange={onChangePassword} value={password} />
                                    <a href="/ForgotPassword">Forgot Password ?</a>
                                </Row>
                            </Form.Item>
                            <Form.Item {...tailLayout}>
                                <Space size='large'>
                                    <Button 
                                        type="primary"
                                        htmlType="submit"
                                        disabled={disabled}
                                        onClick={() => {
                                            onSubmit()
                                        }}
                                    >
                                        Log in
                                    </Button>

                                    <Button 
                                        type="primary"
                                        htmlType="submit"
                                        onClick={() => {
                                            history.push("/Signup")
                                            window.location.reload(); 
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Row>
                </Card>
            </Layout>
        </div>
    )
}

export default Login;