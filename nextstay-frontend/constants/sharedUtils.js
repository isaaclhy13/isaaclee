import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import WifiIcon from '@mui/icons-material/Wifi';
import BoltIcon from '@mui/icons-material/Bolt';
import WeekendIcon from '@mui/icons-material/Weekend';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DoorSlidingIcon from '@mui/icons-material/DoorSliding';
import ElevatorIcon from '@mui/icons-material/Elevator';
import PoolIcon from '@mui/icons-material/Pool';
import MicrowaveIcon from '@mui/icons-material/Microwave';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import CoffeeMakerIcon from '@mui/icons-material/CoffeeMaker';
import DeskIcon from '@mui/icons-material/Desk';
import MonitorIcon from '@mui/icons-material/Monitor';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ChairAltIcon from '@mui/icons-material/ChairAlt';
import ConnectedTvIcon from '@mui/icons-material/ConnectedTv';
import CountertopsIcon from '@mui/icons-material/Countertops';

export const PAIDAMENITIES = [
    // {name: "Furnished (Mattress)", icon: <WeekendIcon/>},
    {name: "Washer & Dryer (In-Unit)", icon: <LocalLaundryServiceIcon/>},
    {name: "Washer & Dryer (In-building)", icon: <LocalLaundryServiceIcon/>},
    {name: "Gym access", icon: <FitnessCenterIcon/>},
    {name: "AC Unit", icon: <AcUnitIcon/>},
    {name: "Desk", icon: <DeskIcon/>},
    {name: "Chair", icon: <ChairAltIcon/>},
    {name: "Computer Monitor", icon: <MonitorIcon/>},
    {name: "Doorman", icon: <DoorSlidingIcon/>},
    {name: "Elevator", icon: <ElevatorIcon/>},
    {name: "Mircrowave", icon: <MicrowaveIcon/>},
    {name: "Silverware", icon: <LocalDiningIcon/>},
    {name: "Pool", icon: <PoolIcon/>},
    {name: "Couch", icon: <WeekendIcon/>},
    {name: "Coffee Machine", icon: <CoffeeMakerIcon/>},
]

export const POSTINGAMENITIES = [
    // {name: "Furnished (Mattress)", icon: <WeekendIcon/>},
    {
        category: "Furnished",
        items: [
            {name: "Desk", icon: <DeskIcon/>},
            {name: "Chair", icon: <ChairAltIcon/>},
            {name: "Computer Monitor", icon: <MonitorIcon/>},
        ]
    },
    {
        category: "Kitchen",
        items: [
            {name: "Mircrowave", icon: <MicrowaveIcon/>},
            {name: "Silverware", icon: <LocalDiningIcon/>},
            {name: "Coffee Machine", icon: <CoffeeMakerIcon/>},
            {name: "Pots & Pans", icon: <LocalDiningIcon/>},
        ]
    },
    {
        category: "Living essentials",
        items: [
            {name: "AC Unit", icon: <AcUnitIcon/>},
            {name: "Washer & Dryer (In-Unit)", icon: <LocalLaundryServiceIcon/>},
            {name: "Couch", icon: <WeekendIcon/>},
            {name: "TV", icon: <ConnectedTvIcon/>}
        ]
    },
    {
        category: "Building/Shared amenities",
        items: [
            {name: "Doorman", icon: <DoorSlidingIcon/>},
            {name: "Elevator", icon: <ElevatorIcon/>},
            {name: "Pool", icon: <PoolIcon/>},
            {name: "Gym access", icon: <FitnessCenterIcon/>},
        ]
    }
]

export const TABS = [
    {name:"Discover", icon: <SearchIcon />}, 
    {name:"myStay", icon: <FavoriteIcon/> }, 
    {name:"Notification", icon: <NotificationsActiveIcon/> }, 
    {name:"Profile", icon: <AccountCircleIcon/> }
]

export const POPULARLOCATIONS = [
    {name:"Lower Manhattan"}, 
    {name:"Midtown"},
    {name:"Jersey City"},
]

//Usage details (Sammple data)
export const ROOMMATES = [
    {gender: "Female", age: 22, work: "Student"},
    {gender: "Male", age: 20, work: "Full-time professioanl"}
]

//Usage: /posting
export const OCCUPATIONOPTIONS = [
    { value: 'Student', label: 'Student' },
    { value: 'Full-time employee', label: 'Full-time employee' },
    { value: 'Part-time employee', label: 'Part-time employee' },
    { value: 'Unemployed', label: 'Unemployed' },
] 

//Usage: /posting
export const AGES = [
    { value: '18', label: '18' },
    { value: '19', label: '19' },
    { value: '20', label: '20' },
    { value: '21', label: '21' },
    { value: '22', label: '22' },
    { value: '23', label: '23' },
    { value: '24', label: '24' },
    { value: '25', label: '25' },
    { value: '26', label: '26' },
    { value: '27', label: '27' },
    { value: '28', label: '28' },
    { value: '29', label: '29' },
    { value: '30+', label: '30+' },
] 

export const BEDSIZES = ["Twin", "TwinXL", "Double", "Queen", "King"]


export const UTILITIES = [
    {name: "WiFi", icon: <WifiIcon/>},
    {name: "Electricity", icon: <BoltIcon/>},
]

export const MENUITEMS = [
    {name:"Sign up / Login"},
]

export const LOGGEDINMENUITEMS = [
    {name: "Summer sublets"},
    {name: "My profile"},
    {name: "My sublet"},
    {name: "Saved"},
    {name: "My requests"},
    {name: "Logout"}
]

export const GENDERS = [
    {value:"Male", label: "Male"},
    {value:"Female", label: "Female"},
    {value:"Others", label:"Others"}
]

export const DAYS = [
    {value:"1", label: "1"},
    {value:"2", label: "2"},
    {value:"3", label: "3"},
    {value:"4", label: "4"},
    {value:"5", label: "5"},
    {value:"6", label: "6"},
    {value:"7", label: "7"},
    {value:"8", label: "8"},
    {value:"9", label: "9"},
    {value:"11", label: "11"},
    {value:"12", label: "12"},
    {value:"13", label: "13"},
    {value:"14", label: "14"},
    {value:"15", label: "15"},
    {value:"16", label: "16"},
    {value:"17", label: "17"},
    {value:"18", label: "18"},
    {value:"19", label: "19"},
    {value:"20", label: "20"},
    {value:"21", label: "21"},
    {value:"22", label: "22"},
    {value:"23", label: "23"},
    {value:"24", label: "24"},
    {value:"25", label: "25"},
    {value:"26", label: "26"},
    {value:"27", label: "27"},
    {value:"28", label: "28"},
    {value:"29", label: "29"},
    {value:"29", label: "29"},
    {value:"30", label: "30"},
    {value:"31", label: "31"},
]

export const MONTHS = [
    {value:"1", label: "January"},
    {value:"2", label: "Febuary"},
    {value:"3", label: "March"},
    {value:"4", label: "April"},
    {value:"5", label: "May"},
    {value:"6", label: "June"},
    {value:"7", label: "July"},
    {value:"8", label: "August"},
    {value:"9", label: "September"},
    {value:"10", label: "October"},
    {value:"12", label: "November"},
    {value:"12", label: "December"},
]

export const YEARS = [
    {value:"1990", label: "1990"},
    {value:"1991", label: "1991"},
    {value:"1992", label: "1992"},
    {value:"1993", label: "1993"},
    {value:"1994", label: "1994"},
    {value:"1995", label: "1995"},
    {value:"1996", label: "1996"},
    {value:"1997", label: "1997"},
    {value:"1998", label: "1998"},
    {value:"1999", label: "1999"},
    {value:"2000", label: "2000"},
    {value:"2001", label: "2001"},
    {value:"2002", label: "2002"},
    {value:"2003", label: "2003"},
    {value:"2004", label: "2004"},
    {value:"2005", label: "2005"},
    {value:"2006", label: "2006"},
    {value:"2007", label: "2007"},
]

export const GUESTS = [
    {value: "1", label: "1 guest"},
    {value: "2", label: "2 guests"},
    {value: "3", label: "3 guests"},
    {value: "4", label: "4 guests"},
    {value: "5", label: "5 guests"},
]
// export const PAIDAMENITIES = [
//     {name: "Furnished (Mattress)", icon: <WeekendIcon/>},
//     {name: "Washer & Dryer (In-Unit)", icon: <LocalLaundryServiceIcon/>},
//     {name: "Washer & Dryer (In-building)", icon: <LocalLaundryServiceIcon/>},
//     {name: "Gym access", icon: <FitnessCenterIcon/>},
//     {name: "AC Unit", icon: <AcUnitIcon/>},
//     {name: "Desk", icon: <DeskIcon/>},
//     {name: "Chair", icon: <ChairAltIcon/>},
//     {name: "Computer Monitor", icon: <MonitorIcon/>},
//     {name: "Doorman", icon: <DoorSlidingIcon/>},
//     {name: "Elevator", icon: <ElevatorIcon/>},
//     {name: "Mircrowave", icon: <MicrowaveIcon/>},
//     {name: "Silverware", icon: <LocalDiningIcon/>},
//     {name: "Pool", icon: <PoolIcon/>},
//     {name: "Couch", icon: <WeekendIcon/>},
//     {name: "Coffee Machine", icon: <CoffeeMakerIcon/>},
// ]

export const getAmenitiesIcon = (name) => {
    if(name == "Furnished (Mattress)"){
        return <WeekendIcon/>
    } else if (name == "Washer & Dryer (In-Unit)"){
        return <LocalLaundryServiceIcon/>
    } else if (name == "Washer & Dryer (In-building)"){
        return <LocalLaundryServiceIcon/>
    } else if (name == "Gym access"){
        return <FitnessCenterIcon/> 
    } else if (name == "AC Unit"){
        return <AcUnitIcon/>
    } else if (name == "Desk"){
        return <DeskIcon/>
    } else if (name == "Chair"){
        return <ChairAltIcon/>
    } else if (name == "Computer Monitor"){
        return  <MonitorIcon/>
    } else if (name == "Doorman"){
        return  <DoorSlidingIcon/>
    } else if (name == "Elevator"){
        return  <ElevatorIcon/>
    } else if (name == "Mircrowave"){
        return  <MicrowaveIcon/>
    } else if (name == "Silverware"){
        return  <LocalDiningIcon/>
    } else if (name == "Pool"){
        return  <PoolIcon/>
    } else if (name == "Couch"){
        return  <WeekendIcon/>
    } else if (name == "Coffee Machine"){
        return  <CoffeeMakerIcon/>
    } else if (name == "Pots & Pans"){
        return <CountertopsIcon/>
    } else if (name == "TV"){
        return <ConnectedTvIcon/>
    }
}

