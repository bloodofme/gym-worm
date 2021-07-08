import React, { Component } from 'react';
import { Layout, Card } from 'antd';
import 'antd/dist/antd.css';
import Information from "./Information/Information";
import Notif from "./Notif/Notif";
import Navbar from '../components/Navbar/Navbar';
import history from "../history";
import AuthService from "../services/auth.service";

document.body.style.backgroundColor = '#4c586f';

const { Header, Content } = Layout;

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: AuthService.getCurrentUser(),
            clicked: true
        };
    }

    //state = { clicked: true }

    handleClick = (theState) => {
        this.setState({ clicked: theState })
    }

    render() {
        const { currentUser } = this.state;
        if (!currentUser) {
            history.push('/');
            //window.location.reload();
        }

        return (
            <div style={{background:'#EBECED'}}>
                <Navbar/>
                <Layout style={{background:'#FFFFFF', padding: "0px"}}>
                <Header  className='settingsTitle' >
                    <h1 className="textHome">Settings</h1>
                </Header>
                <Content style={{ background: "#74828F" }}>
                    <Layout className='layout'>
                        <Card style={{whiteSpace: 'pre-line'}}>
                            <Header alignItems="center" style={{ background:'#4C586F', padding: "30px", alignItems: 'center', display: "flex"}}>
                                <h1 style={{color:'#FFFFFF'}}>Profile</h1>
                            </Header>
                            <Information/>
                        </Card>
                        <Card style={{whiteSpace: 'pre-line'}}>
                            <Header alignItems="center" style={{background:'#4C586F', padding: "30px", alignItems: 'center', display: "flex"}}>
                                <h1 style={{color:'#FFFFFF'}}>Notifications</h1>
                            </Header>
                            <Notif/>
                        </Card>
                    </Layout>
                </Content> 
                </Layout>
            </div>
        );
    }
}

export default Profile;