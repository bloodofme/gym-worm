import React, { useState } from 'react';
import { Breadcrumb, Space, Row, Card, Col, Checkbox } from 'antd';


function DisplayBookings(props) {
    //const len = props.slots.length;
    //var count = 0;
    //const arr = [];

    const [container, setContainer] = useState(null);
    const [isChecked, setChecked] = useState(false);
    
    const onChange = (e) => {
        setChecked(e.target.checked);
    }

    const Time = (time) => {
        return time <= 12 ? `${time}am` : `${time - 12}pm`
    }

    const BookingsCard = (slots) => {
        console.log(slots.date.slice(0,10));
        function onChange(e) {
            console.log(`checked = ${e.target.checked}`);
        }
    
        return(
            <div>
                
                    <Card className='bookingStyle'>
                        <Row gutter={10}>
                        <Col span={15} style={{ padding: '8px 0' }} wrap="false">
                            <p className='text'>{`Date: ${slots.date.slice(0,10)} Time: ${Time(slots.startTime)} Capacity: ${slots.capacity}`}</p>
                        </Col>
                        <Col span={5}>
                            <Checkbox className="ant-checkbox" onChange={onChange}/>
                        </Col>
                        </Row>
                    </Card>
                
            </div>
        );
    }

    /*
    for(var i = 0; i < len; i += 1) {
        arr[i] = BookingsCard(props.slots[i])
    }
    */

    return(
        <div>
            <Card className='bookingStyle'>
                <Row gutter={10}>
                <Col span={15} style={{ padding: '8px 0' }} wrap="false">
                    <p className='text'>{`Date: ${props.slots.date.slice(0,10)} Time: ${Time(props.slots.startTime)} Capacity: ${props.slots.capacity}`}</p>
                </Col>
                <Col span={5}>
                    <Checkbox className="ant-checkbox" onChange={onChange}/>
                </Col>
                </Row>
            </Card>
                
        </div>
    );
}

export default DisplayBookings;