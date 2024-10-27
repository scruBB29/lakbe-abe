import React, { useEffect, useState } from "react";
import { Button } from "../button";
import { Link, useNavigation } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout } from "@react-oauth/google";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/service/firebaseConfig";
import { toast } from "sonner";

function Header() {
  const [user, setUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false); // Track dialog visibility
  const [isAgreed, setIsAgreed] = useState(false); // Track checkbox state

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/calendar"); // Add this line
    provider.addScope("profile"); // Add the profile scope
    provider.addScope("email"); // Add the email scope
    try {
      console.log("Attempting to sign in with Google...");
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User signed in:", user);

      // Get the credential from the result
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken; // Access token for Google API

      // Ensure accessToken is not undefined
      if (!accessToken) {
        throw new Error("Access token is undefined. Please try again.");
      }

      // Store the access token in local storage
      localStorage.setItem("googleAccessToken", accessToken);

      await handleUserProfile(user, accessToken);
      setOpenDialog(false);
      window.location.reload();
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast("Google Sign-In failed. Please try again.");
    }
  };

  const handleUserProfile = async (user, accessToken) => {
    const userDocRef = doc(db, "users", user.email);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.log("Creating new user document for:", user.uid);
      const userData = {
        profile: {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          userId: user.uid, // Ensure userId is included
          isAdmin: false,
          isRegular: true,
          isHotel: false,
        },
        accessToken: {
          googleAccessToken: accessToken,
        },
      };
      await setDoc(userDocRef, userData);
      console.log("New user document created:", {
        email: user.email,
        displayName: user.displayName,
      });
    } else {
      console.log("User document already exists for:", user.uid);
      const userData = {
        profile: {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          userId: user.uid, // Ensure userId is included
        },
        accessToken: {
          googleAccessToken: accessToken,
        },
      };
      await setDoc(userDocRef, userData, { merge: true });
    }

    // Include userId in the user object before storing it in local storage
    const userWithAdmin = {
      ...user,
      userId: userDoc.exists() ? userDoc.data().profile.userId : user.uid, // Ensure userId is included
      isAdmin: userDoc.exists() ? userDoc.data().profile.isAdmin : false,
      isHotel: userDoc.exists() ? userDoc.data().profile.isHotel : false,
      isRegular: userDoc.exists() ? userDoc.data().profile.isRegular : true,
    };

    localStorage.setItem("user", JSON.stringify(userWithAdmin));
    console.log(
      "User data stored in localStorage:",
      JSON.stringify(userWithAdmin)
    );
  };

  const handleGoogleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="p-2 shadow-sm flex justify-between items-center px-5 ">
      <a href="/">
        <img
          src="/LakbeAbe.svg"
          className="cursor-pointer"
          alt="LakbeAbe Logo"
        />
      </a>

      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <a href="/my-bookings">
              <button
                style={{
                  backgroundColor: "#FFEE8C",
                  color: "#000000",
                  border: "2px solid #FFEE8C",
                  borderRadius: "25px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontSize: "16px",
                  transition: "background-color 0.3s, color 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#F4c430";
                  e.target.style.color = "black";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#FFEE8C";
                }}
              >
                My Bookings
              </button>
            </a>
            <a href="/my-trips">
              <Button
                style={{
                  backgroundColor: "#FFEE8C",
                  color: "#000000",
                  border: "2px solid #FFEE8C",
                  borderRadius: "25px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontSize: "16px",
                  transition: "background-color 0.3s, color 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#F4c430";
                  e.target.style.color = "black";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#FFEE8C";
                }}
              >
                My Trips
              </Button>
            </a>
            <Popover>
              <PopoverTrigger className="bg-transparent rounded-full h-[35px] w-[35px] px-0 py-0 outline-none">
                <img
                  src={user?.photoURL}
                  className="h-[35px] w-[35px] rounded-full"
                  alt="User Avatar"
                />
              </PopoverTrigger>
              <PopoverContent>
                <h2 className="cursor-pointer" onClick={handleGoogleLogout}>
                  Logout
                </h2>
              </PopoverContent>
            </Popover>
            <h2>{user?.displayName}</h2>
          </div>
        ) : (
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => setOpenDialog(true)}
          >
            Sign In
          </Button>
        )}

        {/* Sign In Dialog */}
        <Dialog open={openDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogDescription>
                <div className="flex items-center">
                  <img
                    src="/LakbeAbe Logos.svg"
                    className="h-14 ml-5"
                    alt="LakbeAbe Logo"
                  />
                </div>
                <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
                <p>Sign in to the App with Google authentication securely</p>

                {/* Optional Agreement Checkbox */}
                <div className="mt-4 flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="agreement"
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="mt-1"
                  />
                  <label htmlFor="agreement" className="text-sm">
                  Agreeing to Google access with security.
                  </label>
                  <a href="/signinpolicy">
          <span className="info-icon" title="Checking this box will allow us to access your Google Calendar to add the booking event.">
            &#9432;
          </span>
          </a>
                </div>

                {/* Sign In Button (Always Enabled) */}
                <Button
                  onClick={() => {
                    if (!isAgreed) {
                      setOpenDialog(false); // Close the dialog if checkbox is not checked
                    } else {
                      handleGoogleSignIn(); // Proceed with Google Sign-In
                    }
                  }}
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
      </div>
    </div>
  );
}

export default Header;