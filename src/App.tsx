import React, { useCallback, useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Calendar, momentLocalizer, Views, DateLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import styled from "styled-components";
import initialEvents from "./components/resource/events";

const CalendarContainer = styled.div`
  height: 100vh;
  width: 100%;
`;

const BtnContainer = styled.div`
  margin: 10px;
`;

const BtnEvent = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  margin-bottom: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

const SearchInput = styled.input`
  margin: 10px;
  padding: 8px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

type CalendarEvent = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  isDraggable?: boolean;
};

const App: React.FC = () => {
  const adjEvents = useMemo(
    () =>
      initialEvents.map((event, index) => ({
        ...event,
        isDraggable: true, // Make all events draggable
        id: index, // Assign a unique ID to each event
      })),
    []
  );

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(adjEvents);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  // Fetch public holidays and add them to the calendar
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch('https://date.nager.at/api/v3/NextPublicHolidaysWorldwide');
        const data = await response.json();

        const holidayEvents = data.map((holiday: any) => ({
          id: holiday.date, // Use the holiday date as the unique ID
          title: holiday.name, // Event title as the holiday name
          start: new Date(holiday.date), // Start date of the holiday
          end: new Date(holiday.date), // End date of the holiday (same day for one-day holidays)
          allDay: true, // Public holidays are typically all-day events
          isDraggable: false, // Public holidays should not be draggable
        }));

        setCalendarEvents((prev) => [...prev, ...holidayEvents]);
      } catch (error) {
        console.error('Error fetching public holidays:', error);
      }
    };

    fetchHolidays();
  }, []); // Run once on component mount

  const moveEvent = useCallback(
    ({ event, start, end, isAllDay }: any) => {
      setCalendarEvents((prev) =>
        prev.map((ev) =>
          ev.id === event.id
            ? { ...ev, start, end, allDay: isAllDay || ev.allDay }
            : ev
        )
      );
    },
    []
  );

  const eventPropGetter = useCallback(
    (event: CalendarEvent) => ({
      ...(event.isDraggable
        ? { className: "isDraggable" }
        : { className: "nonDraggable" }),
    }),
    []
  );

  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      if (selectedEvent) {
        const title = window.prompt("Edit Event name", selectedEvent.title);
        if (title !== null) {
          setCalendarEvents((prev) =>
            prev.map((event) =>
              event.id === selectedEvent.id ? { ...event, title } : event
            )
          );
        }
        setSelectedEvent(null);
      } else {
        const title = window.prompt("New Event name");
        if (title) {
          const newEvent = {
            title,
            start,
            end,
            id: new Date().getTime(), // Unique ID based on timestamp
            isDraggable: true, // Make the new event draggable
          };
          setCalendarEvents((prev) => [...prev, newEvent]);
        }
      }
    },
    [selectedEvent, setCalendarEvents]
  );

  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      const action = window.prompt(
        `Selected event: ${event.title}\nOptions: (E)dit / (D)elete / (C)ancel`
      );
      if (action === "E" || action === "e") {
        const newTitle = window.prompt("Edit Event title", event.title);
        if (newTitle !== null) {
          setCalendarEvents((prev) =>
            prev.map((ev) =>
              ev.id === event.id ? { ...ev, title: newTitle } : ev
            )
          );
        }
      } else if (action === "D" || action === "d") {
        setCalendarEvents((prev) => prev.filter((ev) => ev.id !== event.id));
      }
    },
    [setCalendarEvents]
  );

  // Filter the events based on the search text
  const filteredEvents = calendarEvents.filter((event) =>
    event.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <CalendarContainer>
      <SearchInput
        type="text"
        placeholder="Search Events"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <DnDCalendar<CalendarEvent>
        localizer={localizer}
        defaultDate={new Date(2025, 0, 1)}
        defaultView={Views.MONTH}
        dragFromOutsideItem={null}
        draggableAccessor="isDraggable"
        eventPropGetter={eventPropGetter}
        events={filteredEvents} 
        onDropFromOutside={null}
        onDragOverFromOutside={null}
        onEventDrop={moveEvent}
        onEventResize={moveEvent}
        resizable
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
    </CalendarContainer>
  );
};

export default App;

App.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
};
