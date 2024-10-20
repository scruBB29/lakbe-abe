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
import axios from "axios";

// Header Content
function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [openDialog, setOpenDialog] = useState();

  // FUNCTION FOR LOGIN HANDLE
  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

  useEffect(() => {
    console.log(user);
  }, []);

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?acess_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "Application/json",
          },
        }
      )
      .then((resp) => {
        console.log(resp);
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialog(false);
        window.location.reload();
      });
  };

  return (
    <div className="p-2 shadow-sm flex justify-between items-center px-5 ">
      <a href="/">
        <img src="/LakbeAbe.svg" className="cursor-pointer" />
      </a>
      {/* <Button><img src='/LakbeAbe.svg'/></Button> */}
      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <a href="/Hotelbooking">
              <button         style={{
          backgroundColor: '#FFEE8C',
          color: '#000000',
          border: '2px solid #FFEE8C', 
          borderRadius: '25px', 
          padding: '10px 20px',
          cursor: 'pointer',
          fontSize: '16px',
          transition: 'background-color 0.3s, color 0.3s', 
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#F4c430'; 
          e.target.style.color = 'black';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#FFEE8C'; 
        }}>
                Book Hotel
              </button>
            </a>
            <a href="/my-trips">
              <Button style={{
          backgroundColor: '#FFEE8C', 
          color: '#000000', 
          border: '2px solid #FFEE8C', 
          borderRadius: '25px', 
          padding: '10px 20px',
          cursor: 'pointer',
          fontSize: '16px',
          transition: 'background-color 0.3s, color 0.3s', 
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#F4c430'; 
          e.target.style.color = 'black'; 
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#FFEE8C'; 
        }}>
                My Trips
              </Button>
            </a>
            <Popover>
              <PopoverTrigger className="bg-transparent rounded-full h-[35px] w-[35px] px-0 py-0 outline-none :focus:outline-none">
                <img
                  src={user?.picture}
                  className="h-35px] w-[35px] rounded-full"
                />
              </PopoverTrigger>
              <PopoverContent>
                <h2
                  className="cursor-pointer"
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    window.location.href = "/";
                  }}
                >
                  Logout
                </h2>
              </PopoverContent>
            </Popover>
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
        <Dialog open={openDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogDescription>
                <div className="flex items-center">
                  <img src="/LakbeAbe Logos.svg" className="h-14 ml-5" />
                </div>
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
      </div>
    </div>
  );
}

export default Header;
