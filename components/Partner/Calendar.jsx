import React, { useState } from "react";
import PropTypes from "prop-types";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { createGlobalStyle } from "styled-components";
import "react-day-picker/dist/style.css";

function Calendar() {
  const GlobalStyle = createGlobalStyle`
  .rdp-cell {
    min-width: 20px !important;
    min-height: 20px !important;
  }
  .rdp-button {
    border-radius: 100px !important;
    font-size: 0.8rem !important;
  }
  .rdp-months {
    width: 100% !important;
  }
  .rdp-day_range_middle {
    opacity: 0.5 !important;
  }
`;

  return (
    <>
      <GlobalStyle></GlobalStyle>

      <div className="hidden md:block">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          eventClassNames={
            "cursor-pointer !border-l-[6px] !border-t-[0px] !border-r-[0px] !border-b-[0px]"
          }
          editable={true}
          selectable={true}
          selectMirror={true}
          headerToolbar={{
            right: "prev,next",
          }}
        />
      </div>

      <div className="md:hidden">
        <FullCalendar
          plugins={[listPlugin, interactionPlugin, timeGridPlugin]}
          initialView="listWeek"
          eventClassNames={
            "cursor-pointer !border-l-[6px] !border-t-[0px] !border-r-[0px] !border-b-[0px]"
          }
          views={{
            listDay: { buttonText: "Day" },
            listWeek: { buttonText: "Week" },
            list: {
              listDayAltFormat: "dddd",
              duration: { days: 30 },
            },
          }}
          height="auto"
          editable={true}
          selectable={true}
          selectMirror={true}
          headerToolbar={{
            right: "prev,next",
          }}
        />
      </div>
    </>
  );
}

Calendar.propTypes = {};

export default Calendar;
