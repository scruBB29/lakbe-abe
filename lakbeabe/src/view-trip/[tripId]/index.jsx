import { React, useState, useEffect} from 'react'
import InfoSection from '../components/InfoSection'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import Hotels from '../components/Hotels';

function Viewtrip() {

    const {tripId}=useParams();
    const [trip,setTrip]=useState([])

useEffect(()=>{
    tripId&&GetTripData();
}, [tripId])

// Used to get Trip Information from Firebase

const GetTripData=async()=>{
    const docRef=doc(db,'AITrips',tripId);
    const docSnap=await getDoc(docRef);

    if(docSnap.exists()){
        console.log("Document:",docSnap.data());
        setTrip(docSnap.data());
    }
    else{
        console.log("No Such Document");
        toast('No trip Found!')
    }
}

    return (
        <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
            {/* information Section */}
                <InfoSection trip={trip}/>
            {/* Recommended Hotels */}
                <Hotels trip={trip} />
            {/* Daily plan Section */}

            {/* Footer */}


        </div>

    )
}


export default Viewtrip
