import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Layout, Card, notification } from 'antd';
import 'antd/dist/antd.css';
import './Login.css';
import AuthService from "../services/auth.service";
import NavBar from "../components/Navbar/Navbar";
import history from './../history';


document.body.style.backgroundColor = '#ebeced';

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
        duration: 3.5,
    });
};

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [disabled, setDisabled] = useState(true);

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    }
    
    const onSubmit = (e) => {
        console.log("Resetting Password for " + email);
        AuthService.resetPasswordReq(email).then(
            (res) => {
                if (res.message === "No account with that email found") {
                    notifWarning("No account with that email found. Please check your email and try again.");
                    console.log("Unable to reset password, no account found.");
                    setTimeout(
                        () => {
                            history.push("/ForgotPassword");
                            window.location.reload();
                        },
                        3.5 * 1000
                    );
                } else {
                    notifOk("Password has been reset. Please refer to your email on how to set your new password.");
                    console.log("Successfully Reset");
                    setTimeout(
                        () => {
                            history.push("/");
                            window.location.reload();
                        },
                        3.5 * 1000
                    );
                }
            },
            error => {
                notifWarning("Unable to Reset Password");
                console.log("Unable to Reset Password");
                console.log(error);
                setTimeout(
                    () => {
                        history.push("/ForgotPassword");
                        window.location.reload();
                    },
                    3.5 * 1000
                );
            }
        )
        console.log("Reset Password Request Done");
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
        if (email) {
            if (checkEmail(email)) {
                setDisabled(false);
            } else {
                setDisabled(true);
            }
        } else {
            setDisabled(true);
        }
    });

    return (
        <div>
            <NavBar />
            <Header className='theTitleLogin' >
                <h1 className="textLogin" >Forgot Password</h1>
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

                            <Form.Item {...tailLayout}>
                                <Button type="primary"
                                    htmlType="submit"
                                    disabled={disabled}
                                    onClick={() => {
                                        onSubmit()
                                    }}>
                                    Verify Email
                                </Button>
                            </Form.Item>
                        </Form>
                    </Row>
                </Card>
            </Layout>
        </div>
    )
}

export default ForgotPassword;