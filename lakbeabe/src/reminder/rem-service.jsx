const OnGenerateTrip = async () => {
    // Ensure the user is logged in
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true); // Open login dialog if not logged in
      return;
    }
  
    // Validate required form fields
    if (!formData.location || !formData.noOfDays || !formData.budget || !formData.traveler) {
      toast("Please fill all the required details.");
      return;
    }
  
    setLoading(true); // Show loading indicator
  
    // If the reminder checkbox is selected, create a Google Calendar event
    if (formData.reminder) {
      const startDate = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)
      const userToken = JSON.parse(localStorage.getItem("user")).access_token;
  
      try {
        await addGoogleCalendarEvent(userToken, startDate, formData.noOfDays);
      } catch (error) {
        console.error("Failed to add reminder to Google Calendar:", error);
      }
    }
  
    setLoading(false);
    toast.success("Trip created successfully!");
  };

//OnGenerateTrip Function