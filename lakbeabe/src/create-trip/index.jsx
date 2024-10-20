import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import axios from "axios";
import {
  AI_PROMPT,
  SelectBudgetOption,
  SelectTravelList,
} from "@/constants/options";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { chatSession } from "@/service/AIModal";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";

// Create Trip Page
function CreateTrip() {
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notFoundMessage, setNotFoundMessage] = useState("");
  const navigate = useNavigate();

  // Predefined locations in Pampanga
  const predefinedLocations = [
    { label: "Angeles City", value: "Angeles City" },
    { label: "San Fernando", value: "San Fernando" },
    { label: "Mabalacat", value: "Mabalacat" },
    { label: "Bacolor", value: "Bacolor" },
    { label: "Guagua", value: "Guagua" },
    { label: "Sasmuan", value: "Sasmuan" },
    { label: "Porac", value: "Porac" },
  ];

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setNotFoundMessage(""); // Reset not found message when input changes
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  // FUNCTION FOR LOGIN HANDLE
  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");

    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (
      (formData.noOfDays > 5 && !formData.location) ||
      !formData.budget ||
      !formData.traveler
    ) {
      toast("Please fill all details");
      return;
    }
    
    setLoading(true);
    
    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      formData.location?.label || ""
    )
      .replace("{totalDays}", formData.noOfDays)
      .replace("{traveler}", formData.traveler || "")
      .replace("{budget}", formData.budget || "");

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      
      console.log("--", result?.response?.text());
      
      await SaveAiTrip(result?.response?.text());
    } catch (error) {
      console.error("Error generating trip:", error);
      toast("Failed to generate trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();

    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userEmail: user?.email,
      id: docId,
    });
    
    navigate("/view-trip/" + docId);
    setLoading(false);
  };

  const GetUserProfile = async (tokenInfo) => {
    try {
      const resp = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo.access_token}`,
            Accept: "Application/json",
          },
        }
      );
      
      console.log(resp);
      localStorage.setItem("user", JSON.stringify(resp.data));
      setOpenDialog(false);
      OnGenerateTrip();
      
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast("Failed to fetch user profile.");
    }
  };

  const handlePlaceSelect = (value) => {
    if (value && value.label) {
      if (!value.label.toLowerCase().includes("pampanga")) {
        setNotFoundMessage("Not found");
        setPlace(null); 
        handleInputChange("location", null); 
      } else {
        setPlace(value);
        handleInputChange("location", value);
        setNotFoundMessage(""); // Reset message when a valid location is selected
      }
    }
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
      <h2 className="font-bold text-3xl">
        Tell us your travel preferences 🌴🏕️
      </h2>

      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.
      </p>

      <div className="mt-20 flex flex-col gap-1">
        <h2 className="text-xl my-3 font-medium">Where is your destination?</h2>
        

       
        
        {/* Predefined Locations Dropdown */}
        <select
  onChange={(e) => {
    const selectedLocation = predefinedLocations[e.target.selectedIndex - 1]; // Adjust index for selected options
    handleInputChange("location", selectedLocation);
    setPlace(selectedLocation); // Set place to the selected location
  }}
   className="grid grid-cols-3 gap-5 mt-1 p-4 rounded-md bg-transparent border-2"
>
  <option disabled selected>Select a location...</option> {/* Make this option disabled */}
  {predefinedLocations.map((location, index) => (
    <option key={index} value={location.value}>
      {location.label}
    </option>
  ))}
</select>

        <div>
          <h2 className="text-xl my-3 font-medium">How many days are you planning your trip?</h2>
          <Input
            placeholder={"Range of 1 to 5 only."}
            type="number"
            onInput={(e) => {
              if (e.target.value < 1 || e.target.value > 5) e.target.value = ""; 
            }}
            onChange={(e) => handleInputChange("noOfDays", e.target.value)}
            min="1"
            max="5"
          />
        </div>
        
        <div>
          <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectBudgetOption.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange("budget", item.title)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                  formData.budget === item.title ? "shadow-lg border-black" : ""
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            Who do you plan on traveling with?
          </h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectTravelList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInputChange("traveler", item.people)}
                className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                  formData.traveler === item.people ? "shadow-lg border-black" : ""
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div className="my-10 justify-end flex">
          <Button disabled={loading} onClick={OnGenerateTrip}>
            {loading ? (
              <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
            ) : (
              "Generate Trip"
            )}
          </Button>
        </div>

        {/* Google Sign-In Dialog */}
        <Dialog open={openDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogDescription>
                <img src="/LakbeAbe Logos.svg" alt="Logo" className="w-5 h-5"/>
                <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
                <p>Sign in to the App with Google authentication securely</p>

                <Button
                  onClick={login}
                  className="w-full mt-5 flex gap-4 items-center"
                >
                  <FcGoogle className="h-7 w-7" />
                  Sign In With Google
                </Button>
              </DialogDescription>
            </DialogHeader>
            <button
              onClick={() => setOpenDialog(false)}
              className="absolute top-5 right-5 bg-transparent p-2 w-10 rounded-full"
            >
              X
            </button>
          </DialogContent>
        </Dialog>

        {/* Display Not Found Message */}
        {notFoundMessage && (
          <p className="text-red-500">{notFoundMessage}</p>
        )}
        
      </div>
      
    </div>
  );
}

export default CreateTrip;
