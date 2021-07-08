import { Menu } from 'antd';
import {  HomeOutlined, AppstoreOutlined, ProfileOutlined } from '@ant-design/icons';
import React, { useState, useRef, useEffect } from 'react';
import "./Navbar.css"
import history from "./../../history"

const { SubMenu } = Menu;

function Navbar() {
    const [current, setCurrent] = useState('mail');

    const handleClick = e => {
        setCurrent({ current: e.key });
    }; 

    return (
      <Menu className="navbarItems" selectedKeys={[current]} mode="horizontal" >
        <Menu.Item 
            className="textNavbar"
            key="home" 
            icon={<HomeOutlined />} 
            onClick={() => { 
                history.push("/Home") 
                window.location.reload(); 
            }}
        >
          Home
        </Menu.Item>
        <Menu.Item 
            className="textNavbar"
            key="bookings" 
            icon={<AppstoreOutlined />} 
            onClick={() => { 
                history.push("/Bookings") 
                window.location.reload(); 
            }}
        >
          Bookings
        </Menu.Item>
        <Menu.Item 
            className="textNavbar"
            key="profile" 
            icon={<ProfileOutlined />} 
            onClick={() => { 
                history.push("/Profile") 
                window.location.reload(); 
            }}
        >
          Profile
        </Menu.Item>
      </Menu>
    );
}

export default Navbar;