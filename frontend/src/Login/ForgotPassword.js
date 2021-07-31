import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Layout, Card } from 'antd';
import 'antd/dist/antd.css';
import './Login.css';
import AuthService from "../services/auth.service";
import NavBar from "../components/Navbar/Navbar"

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
  
function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [disabled, setDisabled] = useState(false);
    
    const  onChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const onSubmit = (e) =>  {
        /*
        AuthService.register(user.firstName, user.lastName, user.email, user.password, user.contactNo, user.telegramHandle).then(
            () => {
                alert("Registration Successful");
                console.log(user.email + " has registered");
                history.push("/");
                window.location.reload();
            },
            error => {
                alert("Unable to register. Try Again");
                console.log("Unable to register " + error);
                history.push("/signup");
                window.location.reload();
            }
        );
        */
       console.log(email)
    }

    const onFinish = (values) => {
        console.log('Success:', values);
        setDisabled(false);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        setDisabled(true);
    };

    useEffect(() => {
    });
    
    return (
        <div>
            <NavBar/>
            <Header className='theTitleLogin' >
                <h1 className="textLogin" >Forgot PassWord</h1>
            </Header>
        
            <Layout style={{background:'#FFFFFF', padding: "0px"}}>
                <Card style={{whiteSpace: 'pre-line'}}>
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