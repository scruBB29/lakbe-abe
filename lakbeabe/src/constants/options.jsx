// Option selections for the travel plan
export const SelectTravelList=[
    {
        id:1,
        title:'Solo',
        desc:'Me, myself, and I',
        icon:'✈️',
        people:'1',
    },
    {
        id:2,
        title:'Duo',
        desc:'It takes two',
        icon:'🥂',
        people:'2 People',
    },
    {
        id:3,
        title:'Trio',
        desc:'Two plus one equals 3',
        icon:'👨🏻‍👩🏻‍👦🏻',
        people:'3 People',
    },
    {
        id:4,
        title:'Group Travel',
        desc:'Bringing the whole group together',
        icon:'👨🏻‍👩🏻‍👧🏻‍👦🏻',
        people:'4+ people',
    }
]

export const SelectBudgetOption=[
    {
        id:1,
        title:'Cheap',
        desc:'Okane ga nai',
        icon:'💵',
    },
    {
        id:2,
        title:'Average',
        desc:'Salary Budget',
        icon:'💰',
    },
    {
        id:3,
        title:'Rich',
        desc:'No Limits',
        icon:'💸',
    }
]

export const AI_PROMPT='Generate Travel Plan for Location : {location}, for {totalDays} Days for {traveler} with a {budget} budget, give me Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and  suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates,Place address, ticket Pricing, Time travel each of the location for {totalDays} days with each day plan with best time to visit in JSON format.'