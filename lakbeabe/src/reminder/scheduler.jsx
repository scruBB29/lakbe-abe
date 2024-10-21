import axios from "axios";

export const addGoogleCalendarEvent = async (accessToken, travelDate, duration) => {
  const event = {
    summary: "Travel Plan Reminder",
    description: "Don't forget your travel plans!",
    start: { date: travelDate, timeZone: "Asia/Manila" },
    end: { date: travelDate, timeZone: "Asia/Manila" },
    recurrence: [`RRULE:FREQ=DAILY;COUNT=${duration}`], // Daily reminder for trip duration
  };

  try {
    const response = await axios.post(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      event,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Event created:", response.data);
    toast.success("Reminder added to Google Calendar!");
  } catch (error) {
    console.error("Error adding event:", error);
    toast.error("Failed to create calendar event.");
  }
};

//Google Calendar Event Logic