import { Menu } from 'antd';
import {  HomeOutlined, AppstoreOutlined, ProfileOutlined, LogoutOutlined, LoginOutlined, FormOutlined } from '@ant-design/icons';
import React, { useState, useRef, useEffect } from 'react';
import "./Navbar.css"
import history from "./../../history"
import AuthService from "../../services/auth.service";

const { SubMenu } = Menu;

function Navbar() {
    const [current, setCurrent] = useState('mail');
    const currentUser = AuthService.getCurrentUser();
    const isSignedIn = currentUser === null;
    const [accessStatus] = useState(sessionStorage.getItem('access'));

    return (
      <div>
      {
        isSignedIn ? (
            <div>
              <Menu className="navbarItems" selectedKeys={[current]} mode="horizontal" >
                <Menu.Item 
                    className="textNavbar"
                    key="login" 
                    icon={<LoginOutlined />} 
                    onClick={() => { 
                        history.push("/Login") 
                        window.location.reload(); 
                    }}
                >
                  Log In
                </Menu.Item>

                <Menu.Item 
                    className="textNavbar"
                    key="register" 
                    icon={<FormOutlined />} 
                    onClick={() => { 
                        history.push("/Signup") 
                        window.location.reload(); 
                    }}
                >
                  Sign Up
                </Menu.Item>
              </Menu>
            </div>
          ) : (
            <div>
              <Menu className="navbarItems" selectedKeys={[current]} mode="horizontal" >
              {
                  accessStatus !== 'Admin' &&     
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
                }       

                {        
                  accessStatus === 'Admin' ?     
                  <Menu.Item 
                    className="textNavbar"
                    key="admin" 
                    icon={<ProfileOutlined />} 
                    onClick={() => { 
                      history.push("/Admin") 
                      window.location.reload(); 
                  }}
                  >
                    Admin
                  </Menu.Item> :
                          
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
                }

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
                <Menu.Item 
                    className="textNavbarLogOut"
                    key="logout" 
                    icon={<LogoutOutlined />} 
                    onClick={() => { 
                        AuthService.logout();
                        history.push('/');
                        window.location.reload(false);
                    }}
                >
                  Log Out
                </Menu.Item>
              </Menu>
            </div>
          )
        }
    </div>
    );
}

export default Navbar;