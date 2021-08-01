import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Layout, Card, Space, notification } from 'antd';
import 'antd/dist/antd.css';
import './Signup.css';
import history from './../history';
import AuthService from "../services/auth.service";
import NavBar from "../components/Navbar/Navbar"

document.body.style.backgroundColor = '#ebeced';

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

function Signup() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [telegramHandle, setTelegramHandle] = useState('');
    const [disabled, setDisabled] = useState(false);

    const onChangeFirstName = (e) => {
        setFirstName(e.target.value);
    }

    const onChangeLastName = (e) => {
        setLastName(e.target.value);
    }
    
    const  onChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const onChangeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    }
    
    const onChangeContactNo = (e) => {
        setContactNo(e.target.value);
    }

    const onChangeTelegramHandle = (e) => {
        setTelegramHandle(e.target.value);
    }

    const onSubmit = (e) =>  {
        const user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: confirmPassword,
            contactNo: contactNo,
            telegramHandle: telegramHandle.charAt(0) === '@' ? telegramHandle.slice(1) : telegramHandle,
            roles: ["user"]
        }

        //console.log(user);

        AuthService.register(user.firstName, user.lastName, user.email, user.password, user.contactNo, user.telegramHandle).then(
            () => {
                notifOk("Registration Successful");
                console.log(user.email + " has registered");
                setTimeout(
                    () => {
                        history.push("/");
                        window.location.reload();
                    },
                    2 * 1000
                );
            },
            error => {
                if (error.response.data.message === "Failed! Email is already in use!") {
                    notifWarning("Email Address is already in use. Please try again with a new email.");
                    console.log("Unable to Signup, email is already in use.");
                } else {
                    notifWarning("Unable to signup.");
                    console.log("Unable to signup " + error.response.data.message);
                }
                setTimeout(
                    () => {
                        history.push("/signup");
                        window.location.reload();
                    },
                    3.5 * 1000
                );
            }
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

    useEffect(() => {
        if (firstName === ''  || lastName === '' || email === '' || password === '' || contactNo === '') {
            setDisabled(true);
        } else {
            if (password.length < 6 || confirmPassword !== password || contactNo.length !== 8 || !(contactNo.charAt(0) === '8' || contactNo.charAt(0) === '9')) {
                setDisabled(true);
            } else {
                setDisabled(false);
            }
        }
    });
    
    return (
        <div>
            <NavBar/>
            <Header className='theTitleLogin' >
                <h1 className="textLogin" >Register for GymWorm</h1>
            </Header>
        
            <Row className="pos" justify="vertical" align="center" verticalAlign="middle" >
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
                                message: 'Please input your Email!',
                            },
                            {
                                type: "email",
                                message: "The input is not valid E-mail!"
                            }
                        ]}
                        className="fieldSize"
                    >
                        <Input type="text" onChange={onChangeEmail} value={email}/>
                    </Form.Item>

                    <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your First Name!',
                            },
                        ]}
                        className="fieldSize"
                    >
                        <Input type="text" onChange={onChangeFirstName} value={firstName}/>
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your First Name!',
                            },
                        ]}
                        className="fieldSize"
                    >
                        <Input type="text" onChange={onChangeLastName} value={lastName}/>
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        min={6}
                        max={20}
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
                        <Input.Password type="text" onChange={onChangePassword} value={password}/>
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirmpassword"
                        min={6}
                        max={20}
                        rules={[
                            {
                                required: true,
                                minLength: 6,
                                message: 'Please confirm your password!',
                            },
                            {
                                min: 6,
                                message: 'Your password should be more than 6 characters!'
                            },
                        ]}
                        className="fieldSize"
                    >
                        <Input.Password onChange={onChangeConfirmPassword} value={confirmPassword}/>
                    </Form.Item>

                    <Form.Item
                        label="Contact Number"
                        name="contactNo"
                        min={8}
                        max={8}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your contact number!',
                            },
                            {
                                min: 8,
                                max: 8,
                                message: 'Your number should be 8 digits!'
                            },
                        ]}
                        className="fieldSize"
                    >
                        <Input type="text" onChange={onChangeContactNo} value={contactNo}/>
                    </Form.Item>

                    <Form.Item
                        label="Telegram Handle"
                        name="telegramHandle"
                        rules={[
                            {
                                required: false,
                            },
                        ]}
                        className="fieldSize"
                    >
                        <Input type="text" onChange={onChangeTelegramHandle} value={telegramHandle}/>
                    </Form.Item>

                    <Form.Item {...tailLayout} align="center">
                        <Button type="primary" 
                                htmlType="submit" 
                                disabled={ disabled }
                                onClick={() => { 
                                    onSubmit()
                                    //history.push('/Home')
                                    //window.location.reload(false);
                                    }
                                }
                        >
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </Row>
        </div>
    )
}

export default Signup;