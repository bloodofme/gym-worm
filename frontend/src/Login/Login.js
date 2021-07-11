import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Layout, Card} from 'antd';
import 'antd/dist/antd.css';
import './Login.css';
import history from './../history';
import AuthService from "../services/auth.service";

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

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [disabled, setDisabled] = useState(false);

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

        console.log(user);
        
        AuthService.login(user.email, user.password).then(
            () => {
                alert("Logging In");
                console.log(user.email + " has logged in");
                history.push("/Home");
                window.location.reload();
            },
            error => {
                alert("Unable to log in. Try Again");
                console.log("unable to login " + error);
                history.push("/");
                window.location.reload();
            }
        );
    }

    const onFinish = (values) => {
        console.log('Success:', values);
        setDisabled(false);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
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
            <Layout className="layout">
                <Header className="welcome">
                    <h1 className="textLogin" align="center">Welcome to GymWorm</h1>
                </Header>
                <Content style={{ background: "#ECEBED" }}>
                    <Row className="pos" type="flex" justify="vertical" align="center" verticalAlign="middle" >
                        <Card style={{padding: "50px"}}>
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
                                    <Input.Password type="text" onChange={onChangePassword} value={password} />
                                </Form.Item>
                                <Form.Item {...tailLayout}>
                                    <Button type="primary"
                                        htmlType="submit"
                                        disabled={disabled}
                                        onClick={() => {
                                            onSubmit()
                                        }}>
                                        Log in
                                    </Button>
                                </Form.Item>

                                <Form.Item {...tailLayout}>
                                    <Button type="primary" htmlType="submit" onClick={() => {
                                        history.push('/Signup')
                                        window.location.reload(false);
                                    }}>
                                        Sign Up
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Row>
                </Content>
            </Layout>
        </div>
    )
}

export default Login;