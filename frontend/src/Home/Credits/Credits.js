import React, { Component } from 'react';
import { Card } from 'antd';
import { SmileOutlined, FrownOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import './Credits.css';
import AuthService from "../../services/auth.service";

class Credits extends Component {
    state = { 
        perfect: true,
        currentUser: AuthService.getCurrentUser()
    } 

    handleClick = () => {
        this.setState({ perfect: !this.state.clicked })
    }

    render() {
        const { currentUser } = this.state;

        return(
            <div>
                 <Card className='creditsStyle'>
                    <p className='amountCredits'>{currentUser.creditScore}%</p>
                    <p className='penaltiesText'>
                        { currentUser.creditScore < 75 ? (currentUser.creditScore < 65 ? 'You have a 2 week Booking Ban active from ' + new Date(currentUser.banStartDate).toString().substring(0, 16) : 'You have a 1 week Booking Ban active from ' + new Date(currentUser.banStartDate).toString().substring(0, 16)) : "No Penalties Issued" }
                    </p>
                    <p className='penaltiesText'>
                        { currentUser.creditScore < 75 ? <FrownOutlined className="faceIcon"/> : <SmileOutlined className="faceIcon"/> }
                    </p>
                </Card>
            </div>
        )
    }
}

export default Credits;