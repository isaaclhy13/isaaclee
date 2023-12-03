"use client"

import PropertyCard from "@/components/property/propertyCard";
import Filter from "@/components/search/filter";
import SearchDateSelectModal from "@/components/search/searchDateSelectModal";
import SearchLocationModal from "@/components/search/searchLocationModal";
import SearchModal from "@/components/search/searchModal";
import SortMenu from "@/components/search/sortMenu";
import { UserContext } from "@/UserContext";
import Menu from '@mui/material/Menu';
import { useRouter, usePathname } from "next/navigation";

//icon
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

//Date Range
import { DateRange } from 'react-date-range';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import { useContext, useEffect, useState } from "react";
import { LOGGEDINMENUITEMS, MENUITEMS } from "@/constants/sharedUtils";
import SignUpModal from "@/components/signup/page";

//Consts


export default function DiscoverPage(){
    const { user, setUser } = useContext(UserContext)
    const router = useRouter()
    const pathname = usePathname()
    
    //Search Modals
    const [searchModal, setSearchModal] = useState(false)
    const [searchLocationModal, setSearchLocationModal] = useState(false)
    const [dateSelectionModal, setDateSelectionModal] = useState(false)

    //Variables
    const [location, setLocation] = useState("")
    const [dateRange, setDateRange] = useState({startDate: null, endDate:  null, key:"selection"})
    const [sortBy, setSortBy] = useState(null)
    const [autocompleteItems, setAutocompleteItems] = useState([])
    const [sublet, setSublet] = useState([])

    //Sorting Modals, Location and date menu 
    const [anchorEl, setAnchorEl] = useState(null)
    const [anchorElLocationInput, setAnchorElLocationInput] = useState(null)
    const [anchorElDateInput, setAnchorElDateInput] = useState(null)
    const open = Boolean(anchorEl);
    const openLocationInputMenu = Boolean(anchorElLocationInput);
    const openDateInputMenu = Boolean(anchorElDateInput);

    //Profile (Login stuff)
    const [anchorElMenuInput, setAnchorElMenuInput] = useState(null)
    const openProfileMenu = Boolean(anchorElMenuInput);

    //Sign up or login model
    const [signUpLoginModel, setSignupLoginModel] = useState(false)

    //Profile pic on the nav bar 
    const [profilePic, setProfilePicture] = useState(null)

    //Load sublets
    const [loadingSublets, setLoadingSublets] = useState(true)

    useEffect(()=> {
        console.log("UseEffect at Discover")
        retrieveCurrentUserInfo()
        retrieveProperties()
    }, [])

    function retrieveCurrentUserInfo(){
        console.log("retrieving")
        let at = localStorage.getItem("at")
        let uid = localStorage.getItem("uid")       

        if(at != null && uid != null){
            console.log("RUNNING QUERY")
            fetch(`https://nextstay-09a1b7efd58f.herokuapp.com/user/${uid}`, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + at
            },
            })
            .then( async res => {
                if (res.status == 200){
                    const data = await res.json()
                    setProfilePicture(data.data.image.url)
                    setUser(data.data)
                }
            })
        }
        else {
            setUser(null)
        }
    }
    
    const handleSortMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    
    function handleSMSearchModalClick(){
        if(window.innerWidth < 768){
            setSearchModal(true)
        }
    }

    function handleLocationClick(event){
        if (window.innerWidth >= 768){
            setAnchorElLocationInput(event.currentTarget);
        }
    }

    function handleDateClick(event){
        if (window.innerWidth >= 768){
            setAnchorElDateInput(event.currentTarget);
        }
    }
    
    function handleLocationInputMenuClose(){
        setAutocompleteItems([])
        setAnchorElLocationInput(null)
    }

    function handleDateInputMenuClose(){
        setAnchorElDateInput(null)
    }

    async function fetchAutocompleteResults(locationInput){
      
        if(locationInput == ""){ return }

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        fetch(`http://localhost:3000/location/autocomplete/${locationInput}`, requestOptions)
        .then(async res => {
            if(res.status == 200){

                let data = await res.json()
                setAutocompleteItems(data.data)
            }
        })
        .catch(error => console.log('error', error));
    }

    function handleLocationAutocompleteClick(item){
        setLocation(item)
        setAutocompleteItems([])
        setAnchorElLocationInput(null)
    }

    function retrieveProperties(){
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        let locationParam = location == null || location == "" ? "" : location;
        let startDate = dateRange.startDate == null ? "" : new Date(dateRange.startDate).getTime()
        let endDate = dateRange.endDate == null ? "" : new Date(dateRange.endDate).getTime()

        let params = ""
        setLoadingSublets(true)
        fetch(`https://nextstay-09a1b7efd58f.herokuapp.com/sublet${params}`, requestOptions)
        .then(async res => {
            if(res.status == 200){
                let data = await res.json()
                setSublet(data.data)
                setTimeout(()=>{
                    setLoadingSublets(false)
                },1500)
            }
        })
        .catch(error => console.log('error', error));
    }

    function handleProfileClick(event){
      
        if (window.innerWidth >= 768){
            setAnchorElMenuInput(event.currentTarget);
        }
        
    }

    function handleProfileMenuClose(){
        setAnchorElMenuInput(null)
    }

    async function handleProfileItemClick(item){
        if(item == "Sign up / Login"){
            handleProfileMenuClose()
            setSignupLoginModel(true)
            return
        }
        else if(item == "Summer sublets"){
            router.replace("/profile/edit")
            return
        }
        else if(item == "My profile"){
            router.push("/profile/edit")
            return
        }
        else if(item == "Logout"){
            handleProfileMenuClose()
            localStorage.clear()
            setUser(null)
            router.refresh("/")
        }
        else if(item == "My sublet"){
            let res = await checkIfPostedSublet()
            if(!res){
                router.push("/profile/posting")
                return
            } else {
                router.push("profile/mySublet")
                return
            }           
        }
        else if(item == "My requests"){
            router.replace("/profile/myRequests")
            return
        }
        else if(item == "Saved"){
            router.push("/profile/saved")
        }
    }

    async function handleSubletMyPlaceClick(){
        let at = localStorage.getItem("at")
        if(at == null){
            setSignupLoginModel(true)
            return 
        }
        let res = await checkIfPostedSublet()
        if(!res){
            router.push("/profile/posting")
        } else {
            router.push("profile/mySublet")
        }
    }

    //Check if the user have posted a sublet
    async function checkIfPostedSublet(){
        let at = localStorage.getItem("at")
        console.log(at)
        let haveProp = false;
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `bearer ${at}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        let result = await fetch("https://nextstay-09a1b7efd58f.herokuapp.com/sublet/mysublet", requestOptions)
        .then( async res => {
            if(res.status == 200){
                let data = await res.json()
                return true
            } else {
                return false
            }
        })
        return result
    }

    function handleSignupLoginModelClose(){
        setSignupLoginModel(false)
    }

    function handleSearchSublets(){
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        fetch(`https://nextstay-09a1b7efd58f.herokuapp.com/sublet?bed=2`, requestOptions)
        .then(async res => {
            if(res.status == 200){
                let data = await res.json()
                setSublet(data.data)
                console.log(data)
            }
        })
        .catch(error => console.log('error', error));
    }
    
    

    return(
        <div className="flex flex-col">
            <div className="flex flex-col fixed pt-3 md:pt-0 pb-5 px-[5%] md:px-[2.5%] w-full bg-white z-50 top-0 shadow-md">
                
                {/* Header  */}
                <div className="flex flex-row justify-between items-center relative w-full md:justify-between md:space-x-2 md:h-[12vh]">

                    {/* Left logo image (Only availble for web) */}
                    <div className="w-1/3 hidden md:block">
                        <img src={"logo.png"} className="h-8"/>
                    </div>

                    {/* Search bar */}
                    {/* <div className="w-full md:w-1/3 justify-between flex flex-row items-center md:justify-center space-x-2">
                        
                        <div onClick={()=> handleSMSearchModalClick()} className="relative w-10/12 px-4 rounded-full py-2 md:py-0 bg-white shadow-lg border border-gray-200 flex flex-row items-center md:w-10/12 md:justify-between md:px-2">
                            
                            <div className='text-gray-800 md:hidden'>
                                <SearchIcon className="text-2xl"/>
                            </div>

                            <div className='flex flex-col md:flex-row w-full'>
                                <div onClick={(e)=>handleLocationClick(e)} className=" md:flex md:flex-1 md:justify-center md:items-center md:border-r md:border-gray-200 cursor-pointer md:py-3.5">
                                    <p className='font-semibold text-gray-800 text-sm truncate '>{location == "" ? "Search location" : location.main_text}</p>
                                </div>
                                <Menu
                                disableScrollLock
                                anchorEl={anchorElLocationInput}
                                open={openLocationInputMenu}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                                onClose={() => handleLocationInputMenuClose()}
                                PaperProps={{
                                    style: {
                                      marginTop: '2%',
                                      width: '30%',
                                      borderRadius: 15
                                    }
                                }}
                                MenuListProps={{
                                style: {
                                    padding: 0,
                                },
                                }}
                                >
                                    <div className="w-full min-h-[60vh]">
                                        <input onChange={(val)=> fetchAutocompleteResults(val.target.value)} className="w-full py-5 outline-none px-3 border-b border-gray-200 font-medium" placeholder="Search location" />
                                        <div>
                                            {
                                                autocompleteItems.map((item, index) => {
                                                    return (
                                                        <div key={"locationAutocompletesDiscover" + index} onClick={() => handleLocationAutocompleteClick(item)} className="w-full py-4 border-b border-gray-200 px-3 flex flex-row items-center space-x-2 cursor-pointer">
                                                            <LocationOnIcon className="text-black"/>
                                                            <div className="flex flex-col">
                                                                <p className="font-medium">{item.main_text}</p>
                                                                <p className="text-sm text-gray-600">{item.secondary_text}</p>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                                    
                                            }

                                        </div>
                                    </div>
                                </Menu>

                                <div onClick={(e)=> handleDateClick(e)} className=" md:flex md:flex-1 md:justify-center md:items-center cursor-pointer md:py-3.5">
                                {dateRange.startDate == null || dateRange.endDate == null ?
                                    <p className='text-slate-600 text-sm md:font-semibold md:text-gray-800 line-clamp-1 truncate '>Add dates</p>
                                    :
                                    <p className='text-slate-600 text-sm md:font-semibold md:text-gray-800'>{new Date(dateRange.startDate).toLocaleDateString('en-us',{month:'short', day:'numeric'})} - {new Date(dateRange.endDate).toLocaleDateString('en-us',{month:'short', day:'numeric'})}</p>
                                }
                                </div>
                                <Menu
                                disableScrollLock
                                anchorEl={anchorElDateInput}
                                open={openDateInputMenu}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                                onClose={() => handleDateInputMenuClose()}
                                PaperProps={{
                                    style: {
                                      marginTop: '2%',
                                      width: '25%',
                                      borderRadius: 15
                                    }
                                }}
                                MenuListProps={{
                                style: {
                                    padding: 0,
                                },
                                }}
                                >
                                    <div className="w-full">
                                        <div className="w-full py-5 outline-none px-3 border-b border-gray-200 font-medium">
                                            <p>Search dates</p>
                                        </div>
                                        <div className="w-full justify-center items-center flex">
                                            <DateRange
                                                minDate={new Date()}
                                                rangeColors={['#000000']}
                                                ranges={[dateRange]}
                                                calendarFocus="backwards"
                                                onChange={(e)=> 
                                                    setDateRange({
                                                        startDate: e.selection.startDate,
                                                        endDate: e.selection.endDate,
                                                        key: e.selection.key
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className='px-5 py-4 justify-between items-center flex flex-row border-t border-gray-200'>
                                            <div className='flx flex-col'>
                                                <p className='font-semibold'>Selected</p>
                                                <p className='text-gray-500 text-sm'>{dateRange.startDate == null ? "Start" : new Date(dateRange.startDate).toLocaleDateString('en-us',{month:'short', day:'numeric'})} - {dateRange.endDate == null ? "End" : new Date(dateRange.endDate).toLocaleDateString('en-us',{month:'short', day:'numeric'})}</p>
                                            </div>
                                            <div className='flex flex-col'>
                                                <div onClick={()=> handleDateInputMenuClose()} className='py-2 px-4 rounded-md bg-black w-min'>
                                                    <p className='font-sm text-white truncate cursor-pointer'>Done</p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </Menu>
                            </div>

                            <div onClick={()=> handleSearchSublets()}  className="hidden md:flex rounded-full bg-[#2390FF] items-center justify-center w-9 h-8 cursor-pointer">
                                <SearchIcon className='text-md text-white'/>
                            </div>
                        </div>
                        <Filter/>
                    </div> */}
                    
                    {/* Profile and Menu (Only available for web) */}
                    <div className="hidden md:flex md:w-1/3 justify-end flex-row">
                        {user == null ?
                            <div className="space-x-6 flex flex-row items-center justify-between">
                                <p onClick={()=> handleSubletMyPlaceClick()} className="text-slate-700 cursor-pointer text-sm font-medium">Sublet your place</p>
                                <div onClick={(e)=> handleProfileClick(e)} className="flex flex-row space-x-2 items-center justify-between rounded-full border border-slate-400 px-2 py-1 cursor-pointer">
                                    <MenuIcon className="text-md text-slate-700" />
                                    <AccountCircleIcon className="text-3.5xl text-slate-800"/>
                                </div>
                            </div>
                            :
                            <div className="space-x-6 flex flex-row items-center justify-between">
                                <p onClick={()=> handleSubletMyPlaceClick()} className="text-slate-700 cursor-pointer text-sm font-medium">Sublet your place</p>
                                <div onClick={(e)=> handleProfileClick(e)} className="flex flex-row space-x-2 items-center justify-between rounded-full border border-slate-400 px-2 py-1 cursor-pointer">
                                    <MenuIcon className="text-md text-slate-700" />
                                    <img src={user.image.url} alt="user img" className="w-9 h-9 rounded-full object-cover border border-gray-200"/>
                                </div>
                            </div>
                        }
                        <Menu
                        disableScrollLock
                        anchorEl={anchorElMenuInput}
                        open={openProfileMenu}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        onClose={() => handleProfileMenuClose()}
                        PaperProps={{
                            style: {
                                marginTop: '1%',
                                borderRadius: 10
                            }
                        }}
                        MenuListProps={{
                        style: {
                            padding: 0,
                        },
                        }}
                        >   {user == null ?
                            <div>
                                {MENUITEMS.map((item)=> {
                                    return(
                                    <div key={"menuItems" + item.name} onClick={()=>handleProfileItemClick(item.name)} className="bg-white hover:bg-gray-200 w-60 py-4 flex justify-start items-center px-5 border-b border-gray-200 cursor-pointer">
                                        <p className="text-slate-600 text-sm">{item.name}</p>
                                    </div>
                                    )
                                })}
                            </div>
                            :
                            <div>
                                {LOGGEDINMENUITEMS.map((item)=> {
                                    return(
                                    <div key={"loggedinmenuItems" + item.name} onClick={()=>handleProfileItemClick(item.name)} className="bg-white hover:bg-gray-200 w-60 py-4 flex justify-start items-center px-5 border-b border-gray-200 cursor-pointer">
                                        <p className="text-slate-600 text-sm">{item.name}</p>
                                    </div>
                                    )
                                })}
                            </div>
                            }
                        </Menu>
                    </div>
                    
                </div>
            
                <div className="flex flex-row justify-between items-center mt-4">
                    <p className="text-lg font-semibold text-gray-700 md:font-medium">Find my sublet</p>
                    {/* <div onClick={(e)=> handleSortMenuClick(e)} className="flex flex-row items-center">
                        <p className="text-sm text-gray-800">Sort by<span className="font-medium">{sortBy == null ? "" : `: ${sortBy}`}</span></p>
                        <div className="text-gray-600">
                            <KeyboardArrowDownIcon/>
                        </div>
                    </div> */}
                </div>   
            </div>

            <div className="pt-5 mt-32 md:mt-40 px-[5%] md:px-[2.5%] pb-24 grid grid-cols-1 md:grid-cols-4 gap-y-10 w-full md:gap-x-4 md:gap-y-8">
                {
                    sublet.map((item, index) => {
                        return (
                            <PropertyCard key={"propertyCard" + index} details={item} loading={loadingSublets}/>
                        )
                    })
                }
            </div>  
           
            <SearchModal location={location} setLocation={setLocation} active={searchModal} closeModal={()=>setSearchModal(false)} openSearchLocationModal={()=> setSearchLocationModal(true)} 
            dateRange={dateRange} setDateRange={setDateRange} dateSelectionModal={dateSelectionModal} openDateSelectionModal={()=> setDateSelectionModal(true)} closeDateSelectionModal={()=>setDateSelectionModal(false)}/>
            <SearchLocationModal location={location} setLocation={setLocation} active={searchLocationModal} closeModal={()=>setSearchLocationModal(false)}/>
            <SearchDateSelectModal dateRange={dateRange} setDateRange={setDateRange} dateSelectionModal={dateSelectionModal} closeDateSelectionModal={()=>setDateSelectionModal(false)}/>
            <SortMenu open={open} anchorEl={anchorEl} handleClose={handleClose} setSortBy={setSortBy}/>
            <SignUpModal signupLoginModel={signUpLoginModel} handleClose={handleSignupLoginModelClose}/>
        </div>
    )
}