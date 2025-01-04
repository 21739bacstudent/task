import React, { useState, useEffect } from "react";
import moment from "moment";
import styled from "styled-components";

const SidebarDiv = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: ${(props) => (props.show ? "0" : "-250px")};
  width: 250px;
  height: 100%;
  background-color: #f0f0f0;
  transition: left 0.3s ease;
  z-index: 1000;
`;

const SidebarContent = styled.div`
  height: 100%;
  padding: 20px;
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SidebarBody = styled.div`
  overflow-y: auto;
  height: calc(100% - 60px);
`;

const CloseBtn = styled.button`
  background-color: red;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  color: white;
  padding: 5px 10px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 90%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 15px;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;

  &:hover {
    background-color: #0056b3;
  }
`;

interface SidebarProps {
  show: boolean;
  onHide: () => void;
  onAddEvent: (event: CalendarEvent) => void;
  selectEvent: CalendarEvent | null;
}

const Sidebar: React.FC<SidebarProps> = ({ show, onHide, onAddEvent, selectEvent }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (selectEvent) {
      setTitle(selectEvent.title);
      setDate(moment(selectEvent.start).format("YYYY-MM-DD"));
      setStartTime(moment(selectEvent.start).format("HH:mm"));
      setEndTime(moment(selectEvent.end).format("HH:mm"));
    } else {
      setTitle("");
      setDate("");
      setStartTime("");
      setEndTime("");
    }
  }, [selectEvent]);

  const handleSubmit = () => {
    if (!title || !date || !startTime || !endTime) {
      alert("Please fill all fields");
      return;
    }

    const newEvent = {
      title,
      start: moment(date)
        .set({ hour: parseInt(startTime.split(":")[0]), minute: parseInt(startTime.split(":")[1]) })
        .toDate(),
      end: moment(date)
        .set({ hour: parseInt(endTime.split(":")[0]), minute: parseInt(endTime.split(":")[1]) })
        .toDate(),
    };

    console.log("Submitting Event: ", newEvent);
    onAddEvent(newEvent);
  };

  return (
    <SidebarDiv show={show}>
      <SidebarContent>
        <SidebarHeader>
          <h3>{selectEvent ? "Edit Event" : "Add Event"}</h3>
          <CloseBtn onClick={onHide}>Close</CloseBtn>
        </SidebarHeader>
        <SidebarBody>
          <Label>Title</Label>
          <Input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Label>Date</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Label>Start Time</Label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          <Label>End Time</Label>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />

          <SubmitButton onClick={handleSubmit}>{selectEvent ? "Update" : "Submit"}</SubmitButton>
        </SidebarBody>
      </SidebarContent>
    </SidebarDiv>
  );
};

export default Sidebar;
