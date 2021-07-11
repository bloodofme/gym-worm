import React, { useRef, useEffect, useState } from 'react';
import { Input, Tooltip, Space, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import './Admin.css';
import Navbar from '../components/Navbar/Navbar';
import SlotService from "../services/slot.service";
import history from "../history";

function Admin() {
    const [slotSettings, setSlotSettings] = useState("");
    const [startTime, setStartTime] = useState(slotSettings.startTime);
    const [endTime, setEndTime] = useState(slotSettings.endTime);
    const [capacity, setCapacity] = useState(slotSettings.capacity);
    const [updatedAt, setUpdatedAt] = useState(slotSettings.updatedAt);

    const originalInfo = {
        startTime,
        endTime,
        capacity
    }

    useEffect(() => {
        async function getSettings() {
            let response = await SlotService.getSlotSettings();
            console.log("Slot Settings are currently : ");
            console.log(response);
            setSlotSettings(response);
            setStartTime(response.startTime);
            setEndTime(response.endTime);
            setCapacity(response.capacity);
            setUpdatedAt(new Date(response.updatedAt).toString());
            originalInfo.startTime = response.startTime;
            originalInfo.endTime = response.endTime;
            originalInfo.capacity = response.capacity;
            //console.log(originalInfo);
        }
        getSettings()
    }, []);

    const onChangeStartTime = (e) => {
        setStartTime(e.target.value);
    }
    const onChangeEndTime = (e) => {
        setEndTime(e.target.value);
    }
    const onChangeCapacity = (e) => {
        setCapacity(e.target.value);
    }

    const onUpdate = (e) => {
        const slotCreationSettings = {
            startTime: startTime === undefined ? originalInfo.startTime : startTime,
            endTime: endTime === undefined ? originalInfo.endTime : endTime,
            capacity: capacity === undefined ? originalInfo.capacity : capacity
        }
        console.log("New Slot Settings will be : ");
        console.log(slotCreationSettings);

        SlotService.updateSlotSetting(slotCreationSettings.startTime,
            slotCreationSettings.endTime, slotCreationSettings.capacity)
            .then(() => {
                alert("Slot Settings have been updated");
                console.log("Successfully Updated");
                window.location.reload();
            },
                err => {
                    alert("Unable to Update");
                    console.log("Unable to update " + err);
                    window.location.reload();
                });
    }

    return (
        <div style={{ background: "74828F", alignItems: "center" }}>
            <Navbar />
            <Space
                style={{ background: "74828F", alignItems: "center" }}
                direction="vertical"
                size={'large'}
                align='center'
            >
                <Input style={{ borderRadius: 35, width: "50vw" }}
                    placeholder={startTime}
                    onChange={onChangeStartTime}
                    suffix={
                        <Tooltip title="Start Time">
                            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                        </Tooltip>
                    }
                />
                <Input style={{ borderRadius: 35, width: "50vw" }}
                    placeholder={endTime}
                    onChange={onChangeEndTime}
                    suffix={
                        <Tooltip title="End Time">
                            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                        </Tooltip>
                    }
                />
                <Input style={{ borderRadius: 35, width: "50vw" }}
                    placeholder={capacity}
                    onChange={onChangeCapacity}
                    suffix={
                        <Tooltip title="Capacity">
                            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                        </Tooltip>
                    }
                />
                <Input style={{ borderRadius: 35, width: "50vw" }}
                    placeholder={updatedAt}
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
                        console.log("button pressed");
                        onUpdate();
                    }}
                >
                    Confirm Changes
                </Button>

                <Button
                    className="bookingsButtons"
                    type="primary"
                    shape="round"
                    onClick={() => {
                        history.push("/Profile");
                        window.location.reload();
                    }}
                >
                    Back
                </Button>
            </Space>
        </div>
    )
}

export default Admin;