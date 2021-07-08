import React, { useRef } from 'react';
import { Input, Tooltip, Space, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import './Admin.css';
import moment from 'moment';
import Navbar from '../components/Navbar/Navbar';
import AuthService from "../services/auth.service";
import history from "../history";

function Admin() {
    const currentUser = AuthService.getCurrentUser()
    const API_URL = "https://gym-worm.herokuapp.com/api/slot/" || "http://localhost:5000/api/slot/";

    const dateFormat = "YYYY-MM-DD";
    const date = useRef(moment().format(dateFormat).toString());
    const today = moment();
    const todayDate = JSON.stringify(new Date()).substring(1, 11);

    return (
        <div style={{ background: "74828F", alignItems: "center" }}>
            <Navbar/>
            <Space
                style={{ background: "74828F", alignItems: "center" }}
                direction="vertical"
                size={'large'}
                align='center'
            >
                <Input style={{ borderRadius: 35, width: "50vw" }}
                    placeholder="Start Time "
                    suffix={
                        <Tooltip title="Start Time">
                            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                        </Tooltip>
                    }
                />
                <Input style={{ borderRadius: 35, width: "50vw" }}
                    placeholder="End Time"
                    suffix={
                        <Tooltip title="End Time">
                            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                        </Tooltip>
                    }
                />
                <Input style={{ borderRadius: 35, width: "50vw" }}
                    placeholder="Capacity"
                    suffix={
                        <Tooltip title="Capacity">
                            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                        </Tooltip>
                    }
                />
                <Input style={{ borderRadius: 35, width: "50vw" }}
                    placeholder="Last Updated At"
                    suffix={
                        <Tooltip title="Last Updated At">
                            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                        </Tooltip>
                    }
                />
                <Button
                    className="bookingsButtons"
                    type="primary"
                    shape="round"
                    onClick={() => {
                        AuthService.updateCurrentUser(currentUser.email, currentUser.password);
                        window.location.reload(); 
                    }}
                >
                    Confirm
                </Button>
            </Space>
        </div>
    )
}

export default Admin;