"use client"
import Image from 'next/image';
import GoogleMapReact from 'google-map-react';
import { Urbanist } from 'next/font/google';
const urbanist = Urbanist({ subsets: ['latin'] })

import Select from 'react-select'

import Menu from '@mui/material/Menu';

//Date Range
import { DateRange } from 'react-date-range';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

//Swipable Carosel
import { useSwipeable } from 'react-swipeable';


//Icon
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import IosShareIcon from '@mui/icons-material/IosShare';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import WeekendIcon from '@mui/icons-material/Weekend';
import BoltIcon from '@mui/icons-material/Bolt';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import PaymentsIcon from '@mui/icons-material/Payments';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import CheckIcon from '@mui/icons-material/Check';
import PeopleIcon from '@mui/icons-material/People';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import HomeIcon from '@mui/icons-material/Home';

//Constants
import { AGES, GUESTS, ROOMMATES,  getAmenitiesIcon } from '@/constants/sharedUtils';
import DateSelectModal from '@/components/property/dateSelectModal';
import { useContext, useEffect, useState } from 'react';
import { useParams, useRouter, usePathname, useSearchParams } from 'next/navigation';
import { UserContext } from '@/UserContext';
import ImageGalleryModal from '@/components/property/imageGalleryModel';
import ContactUsModal from '@/components/contactUs/contactUsModal';
import LoadingDots from '@/components/loadingDots';
import SignUpModal from '@/components/signup/page';

function PropertyDetailsHeaderBar(){
    const router = useRouter()

    return (
        <div className="absolute top-0 w-full px-5 py-4 justify-between flex flex-row">
            <div className="relative flex rounded-full bg-white border border-gray-200 items-center justify-center w-9 h-9 shadow-md">
                <CloseIcon onClick={()=> router.back()} className='text-md text-gray-700 cursor-pointer'/>
            </div>
            <div className='space-x-4 flex flex-row'>
                <div className="flex rounded-full bg-white border border-gray-200 items-center justify-center w-9 h-9 shadow-md">
                    <IosShareIcon className='text-md text-gray-700'/>
                </div>
                <div className="flex rounded-full bg-white border border-gray-200 items-center justify-center w-9 h-9 shadow-md">
                    <FavoriteIcon className='text-md text-gray-700'/>
                </div>
            </div>
        </div>
    )
}

export default function PropertyDetails({ params }) {
    const searchParams = useSearchParams()
    const {user, setUser} = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const [dateSelectionModal, setDateSelectionModal] = useState(false)
    const [dateRange, setDateRange] = useState({startDate: new Date(), endDate:  new Date(new Date().setDate(new Date().getDate() + 30)) , key:"selection"})
    const urlParams = useParams()
    const router = useRouter()
    const pathname = usePathname()
    const urlParts= pathname.split("/")
    const subletID = urlParts[urlParts.length-1]
    const [propDetails, setPropDetails] = useState(null)
    const [tenantDetails, setTeanantDetails] = useState(null)
    const [coordinates, setCoordinates] = useState({center: null, zoom: 16})
    const [guests, setGuests] = useState(1)
    const [liked, setLiked] = useState(false)
    const [webLoginModal, setWebLoginModal] = useState(false)
    const [mySublet, setMySublet] = useState(false)

    //Date select
    const [anchorElDateInput, setAnchorElDateInput] = useState(null)
    const openDateInputMenu = Boolean(anchorElDateInput);

    //Image Gallery Modal 
    const [imageGalleryModal, setImageGalleryModal] = useState(false)

    //Contact Us Modal
    const [contactUsModal, setContactUsModal] = useState(false)


    useEffect(() => {
        getSubletDetails()
        getMyLikes()
    }, [])

    function openImageGalleryModal(){
        setImageGalleryModal(true)
    }

    function closeImageGalleryModal(){
        setImageGalleryModal(false)
    }

    function handleContactUsModalClose(){
        setContactUsModal(false)
    }

    function likeSublet(){
        let at = localStorage.getItem("at")

        if(at == null){
            setWebLoginModal(true)
            return
        }
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `bearer ${at}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "subletID": propDetails._id
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("https://nextstay-09a1b7efd58f.herokuapp.com/sublet/like", requestOptions)
        .then( async res => {
            if(res.status == 200){
                const data = await res.json()
                console.log(data)
                
                setLiked(true)
                    
            
            }
        })
    }

    //Determine if this property is liked by me
    function getMyLikes(){
        let at = localStorage.getItem("at")
        console.log("ATTT", at)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `bearer ${at}`);

        var raw = "";

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch("https://nextstay-09a1b7efd58f.herokuapp.com/user/mylikes", requestOptions)
        .then( async res => {
            if(res.status == 200){
                const data = await res.json()
                console.log("HAPPY", data)
                data.data.map((sublet) => {
                    if(sublet._id == subletID){
                        setLiked(true)
                    }
                })
            }
        
        })
    }
    
    function getSubletDetails(){
        let uid = localStorage.getItem("uid")
     
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        fetch(`https://nextstay-09a1b7efd58f.herokuapp.com/sublet/${urlParams.propID}`, requestOptions)
        .then(async res => {
            if(res.status == 200){
                let data = await res.json()
                setDateRange({startDate: new Date(data.data.from), endDate: new Date(data.data.to), key: 'selection'})

                setPropDetails(data.data)
                setTeanantDetails(data.data.tenantInfo)
                if(data.data.tenantInfo._id == uid){
                    setMySublet(true)
                }                
                setCoordinates({center:data.data.location.coords, zoom:16})

            }
        })
        .catch(error => console.log('ERROR in fetching sublet details'));
    }

    function handleSubletMyPlaceClick(){
        router.replace("/profile/posting")
    }

    function handleDateClick(event){
        setAnchorElDateInput(event.currentTarget);
    }

    function handleDateInputMenuClose(){
        setAnchorElDateInput(null)
    }

    function handleWebRequestToBook(){
        if(loading){
            return
        }
        setLoading(true)
        let at = localStorage.getItem('at')

        if(at == null){
            setLoading(false)
            setWebLoginModal(true)
            return
        }

        let requestStart = new Date(dateRange.startDate).getTime()
        let requestEnd = new Date(dateRange.endDate).getTime()

        let days = (requestEnd - requestStart) / (1000*60*60*24)

        if(days < 30){
            setLoading(false)
            alert("You must book at least 30 days to proceed.")
            return
        }

        router.push(pathname + `/start=${new Date(dateRange.startDate).getTime()}&end=${new Date(dateRange.endDate).getTime()}`, { scroll: true })
    }

    function handleMobileRequestToBook(){
        let at = localStorage.getItem("at")
        if(at == null){
            alert("Please log in first.")
            router.replace("/profile")
        } else{
            setDateSelectionModal(true)
        }
    }

    return (
        <div className='pt-3'>
        {propDetails != null &&
            <div className="w-full h-full flex flex-col md:px-[10%]">
                <div className="hidden md:flex flex-row justify-between items-center relative w-full md:justify-between md:space-x-2 h-[10vh]">
                    <div className="flex flex-row justify-between items-center relative w-full md:justify-between md:space-x-2 md:h-[12vh] ">
                        <div className="w-1/3 hidden md:block">
                           
                            <img onClick={()=>router.replace('/')}  src={"/logo.png"} className="h-8 flex cursor-pointer"/>
                            
                        </div>
                    </div>
                </div>

                {/* Header location share and like button */}
                <div className="hidden md:flex flex-row justify-between items-center relative w-full md:justify-between md:space-x-2 h-[10vh] justify-between">
                    <p className='text-2xl'>{propDetails.type} at {propDetails.location.secondary_text}</p>
                    <div>
                        <div className="relative flex rounded-full bg-white items-center justify-center flex-row space-x-5">
                            <div className='flex flex-row space-x-2 items-center'>
                                <IosShareIcon onClick={()=> router.back()} className='text-md text-gray-700 cursor-pointer'/>
                                <p>Share</p>
                            </div>
                            {!mySublet &&
                            <div onClick={()=> likeSublet()} className='flex flex-row space-x-2 items-center cursor-pointer'>
                                {liked ?
                                <FavoriteIcon className='text-md text-gray-700'/>
                                :
                                <FavoriteBorderIcon className='text-md text-gray-700'/>
                                }
                                <p>Save</p>
                            </div>
                            }
                        </div>
                    </div>
                </div>

                {/* Image gallery */}
                <div className='hidden w-full h-64 md:h-[50vh] relative rounded-lg overflow-hidden md:flex flex-row border border-gray-100'>
                    <img onClick={()=>setImageGalleryModal(true)} src={propDetails.images[0].url} alt="Sublet image" className='w-1/2 h-full object-cover cursor-pointer'/>
                    <div className='flex-wrap flex-row flex'>
                        <img onClick={()=>setImageGalleryModal(true)} src={propDetails.images[1].url} alt="Sublet image" className='w-1/2 h-1/2 object-cover cursor-pointer'/>
                        <img onClick={()=>setImageGalleryModal(true)} src={propDetails.images[2].url} alt="Sublet image" className='w-1/2 h-1/2 object-cover cursor-pointer'/>
                        <img onClick={()=>setImageGalleryModal(true)} src={propDetails.images[3].url} alt="Sublet image" className='w-1/2 h-1/2 object-cover cursor-pointer'/>
                        <img onClick={()=>setImageGalleryModal(true)} src={propDetails.images[3].url} alt="Sublet image" className='w-1/2 h-1/2 object-cover cursor-pointer'/>
                    </div>
                    <div onClick={()=>setImageGalleryModal(true)} className='absolute bottom-4 right-4 rounded-md bg-white px-5 py-2 border border-black cursor-pointer'>
                        <p className='font-medium'>See all {propDetails.images.length} images</p>
                    </div>
                </div>

                {/* Hidden for desktop / laptop */}
                <div className='w-full h-70 relative md:hidden'>
                    <div className='w-full h-72 flex flex-row overflow-scroll snap-x snap-mandatory'>
                        {propDetails.images.map((item, index)=> {
                            return(
                                <div key={"mobileImages" + index} className='min-w-full h-72 snap-start'>
                                    <img src={item.url} key={"mobileImage" + item.url} alt="Sublet image" className='h-full min-w-full'/>
                                    <div className='absolute bottom-4 right-4 rounded-md bg-white px-3 py-2 border border-black cursor-pointer'>
                                        <p className='font-medium text-xs'> See all {propDetails.images.length} images</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    

                    <div className='md:hidden'>
                        <div className="absolute top-0 w-full px-5 py-4 justify-between flex flex-row">
                            <div className="relative flex rounded-full bg-white border border-gray-200 items-center justify-center w-9 h-9 shadow-md">
                                <CloseIcon onClick={()=> router.back()} className='text-md text-gray-700 cursor-pointer'/>
                            </div>
                            <div className='space-x-4 flex flex-row'>
                                <div className="flex rounded-full bg-white border border-gray-200 items-center justify-center w-9 h-9 shadow-md">
                                    <IosShareIcon className='text-md text-gray-700'/>
                                </div>
                                <div className="flex rounded-full bg-white border border-gray-200 items-center justify-center w-9 h-9 shadow-md">
                                    {liked ?
                                    <FavoriteIcon className='text-md text-gray-700'/>
                                    :
                                    <FavoriteBorderIcon className='text-md text-gray-700'/>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-row'>
                    <div className='px-5 md:px-0 w-full md:w-7/12'>

                        {/* Views, likes and type configuration */}
                        <div className='py-6 w-full border-b border-grey-200 md:flex-row-reverse md:flex md:justify-between'>
                            <div className='flex flex-row space-x-2'>
                                <div className='bg-black rounded-md px-2 py-1 flex flex-row space-x-2 items-center h-fit'>
                                    <RemoveRedEyeIcon className='text-md text-white'/>
                                    <p className='text-white text-sm'>{propDetails.viewCount} Views</p>
                                </div>
                                <div className='bg-black rounded-md px-2 py-1 flex flex-row space-x-2 items-center h-fit '>
                                    <FavoriteIcon className='text-md text-white'/>
                                    <p className='text-white text-sm'>{propDetails.likes} Saved</p>
                                </div>
                            </div>
                            <div className="text-gray-700 mt-4 md:mt-0">
                                <div className='flex flex-row items-center space-x-1'>
                                    <p className="text-xl font-semibold">Chelsea, Manhattan</p>
                                </div>
                                <p className="md:text-regular text-slate-500">{propDetails.type} in a 3 bed 2 bath</p>
                                <div className='mt-6 flex flex-row space-x-3 items-center'>
                                    <div className='w-[10vh] h-[10vh] rounded-full border-2 border-blue-400'>
                                        <img src={tenantDetails.image.url} alt="Sublet image" className="w-full h-full rounded-full object-cover"/>
                                    </div>
                                    <div className='flex flex-col space-y-1'>
                                        <p className="font-medium text-black">Place by {tenantDetails.firstName}</p>
                                        <p className="text-sm text-slate-500">Verified student at {tenantDetails.uni_name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Availability */}
                        <div className='py-6  w-full flex flex-col space-y-4 border-b border-grey-200 md:space-y-6'>
                            <p className="text-xl font-semibold md:font-medium">Availability</p>
                            <div className='flex flex-row space-x-2 items-center space-x-4 md:space-x-8'>
                                <CalendarMonthIcon className='text-2xl'/>
                                <div className='flex flex-col space-y-1'>
                                    <p className='font-medium'>Available From</p>
                                    <p className='text-slate-500'>{new Date(propDetails.from).toLocaleDateString('en-us',{month:'short', day:'numeric', year:'numeric'})}</p>
                                </div>
                                <div className='flex flex-col space-y-1'>
                                    <p className='font-medium'>Available To</p>
                                    <p className='text-slate-500'>{new Date(propDetails.to).toLocaleDateString('en-us',{month:'short', day:'numeric', year:'numeric'})}</p>
                                </div>
                            </div>
                        </div>

                        {/* Overview */}
                        <div className='py-6 w-full flex flex-col space-y-4 border-b border-grey-200'>  
                            <p className="text-xl font-semibold md:font-medium">Overview</p>
                            <div className='space-y-8'>
                                <div className='flex flex-row space-x-4 items-center md:space-x-8'>
                                    <WeekendIcon className='text-2xl'/>
                                    <div className='flex flex-col space-y-1'>
                                        <p className='font-medium md:font-normal'>{propDetails.overview.furnished.included ? "Fully Furnished" : "Not furnished"}</p>
                                    </div>
                                </div>
                                <div className='flex flex-row space-x-4 items-center md:space-x-8'>
                                    <BoltIcon className='text-2xl'/>
                                    <div className='flex flex-col space-y-1'>
                                        <p className='font-medium md:font-normal'>{propDetails.overview.electricity.included ? "Electricity included" : "Electricity not included"}</p>
                                        {!propDetails.overview.electricity.included &&
                                            <p className='text-slate-500 text-sm'>Average ${propDetails.overview.electricity.cost} monthly</p>
                                        }
                                    </div>
                                </div>
                                <div className='flex flex-row space-x-4 items-center md:space-x-8'>
                                    <WifiIcon className='text-2x'/>
                                    <div className='flex flex-col space-y-1'>
                                        <p className='font-medium md:font-normal'>{propDetails.overview.wifi.included ? "Electricity included" : "Electricity not included"}</p>
                                        {!propDetails.overview.wifi.included &&
                                            <p className='text-sm text-slate-500'>Fixed ${propDetails.overview.wifi.cost} monthly</p>
                                        }
                                    </div>
                                </div>
                                <div className='flex flex-row space-x-4 items-center md:space-x-8'>
                                    <LocalLaundryServiceIcon className='md:text-2xl text-2xl'/>
                                    <div className='flex flex-col space-y-1'>
                                        <p className='font-medium md:font-normal'>{propDetails.overview.washer_dryer.included ? "In-unit Washer & Dryer" : "In building Washer & Dryer"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rent */}
                        <div className='py-6 w-full flex flex-col space-y-4 border-b border-grey-200'>  
                            <p className="text-2xl font-semibold md:font-medium">Rent</p>
                            <div className='space-y-8'>
                                <div className='flex flex-row space-x-4 items-center md:space-x-8'>
                                    <PaymentsIcon className='text-2xl'/>
                                    <div className='flex flex-col space-y-1'>
                                        <p className='font-medium'>${propDetails.rent} monthly</p>
                                        <p className='text-slate-500 text-sm md:text-base'>Rent is pro-rated for the your stay</p>
                                    </div>
                                </div>
                                <div className='flex flex-row space-x-4 items-center md:space-x-8'>
                                    <AddModeratorIcon className='text-2xl'/>
                                    <div className='flex flex-col space-y-1'>
                                        <p className='font-medium'>${propDetails.security_deposit} security deposit</p>
                                        <p className='text-slate-500 text-sm md:text-base'>Security deposit will be held by nextStay until the end of the sublease assuming no damage</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Roommate situation */}
                        <div className='py-6 w-full flex flex-col space-y-4 border-b border-grey-200'>  
                            <p className="text-2xl font-semibold md:font-medium">Your roommates ({propDetails.roommates.length} roommates)</p>
                        
                            <div className='space-y-6'>
                                {propDetails.roommates.map((item, index) => {
                                    return (
                                        <div key={"roommate" + index} className='flex flex-row space-x-4 items-center'>
                                            <PeopleIcon className='md:text-3xl text-2xl'/>
                                            <div className='flex flex-col space-y-1'>
                                                <p className='font-medium '>Roommate {item.roomate_id}</p>
                                                <p className='text-slate-500 text-sm md:text-base'>{item.gender} • {item.age} years old • {item.type}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            {/* <div className='space-y-2'>
                                <p className='font-semibold text-md'>About them </p>
                                <p className='text-sm md:text-base'>A two bedroom apartment in bedstuy, lots of natural light and beautifully decorated. I would be living in the other room and we would share living room, kitchen and bathroom.</p>
                            </div> */}
                        </div>
                        
                        {/* Sublet location */}
                        <div className='py-6 md:py-10 w-full flex flex-col space-y-4 border-b border-grey-200'>  
                            <p className="text-2xl font-semibold md:font-medium">Sublet location</p>
                            <div className='w-full h-64 bg-gray-100 rounded-md overflow-hidden'>
                            <GoogleMapReact
                            
                            center={coordinates.center == null ? {lat: 64.3456, lng: -21.4531} : {lat: coordinates.center[1], lng:coordinates.center[0]}}
                            bootstrapURLKeys={{ key: "AIzaSyCc2MvH4ce_RCKNcM5Z6TDPNFXD_lq75ok" }}
                            // defaultCenter={coordinates.center == null ? {lat: 64.3456, lng: -21.4531} : {lat: coordinates.center[1], lng:coordinates.center[0]}}
                            defaultZoom={coordinates.zoom}
                            yesIWantToUseGoogleMapApiInternals
                            >
                                <div lat={coordinates.center[1]} lng={coordinates.center[0]} className='flex justify-center items-center h-[5vh] w-[5vh] rounded-full bg-gradient-to-r from-[#2390FF] to-[#174AFE] border border-gray-200'>
                                    <HomeIcon className='text-white'/>
                                </div>
                            </GoogleMapReact>
                            </div>
                        </div>

                        {/* Your host */}
                        <div className='py-6 md:py-10 w-full flex flex-col space-y-4 border-b border-grey-200'>  
                            <p className="text-2xl font-semibold md:font-medium">Your host</p>
                            <div className="flex flex-row items-center">
                                <img src={tenantDetails.image.url} alt="Sublet image" className="w-20 h-20 rounded-full object-cover"/>
                                <div className="flex flex-col align-left ml-4 w-full ">
                                    <p className="font-semibold text-md text-gray-700 p-y-0">{tenantDetails.firstName}'s place</p>
                                    <p className="text-sm text-slate-500">{tenantDetails.uni_name}</p>
                                    <div className="flex items-center w-full overflow-auto flex-wrap truncate mt-2 gap-1.5">
                                        <div className='bg-black rounded-md px-2 py-1 flex flex-row space-x-2 items-center '>
                                            <CheckIcon className='text-xs text-white'/>
                                            <p className='text-white text-xs'>Email verified</p>
                                        </div>
                                        <div className='bg-black rounded-md px-2 py-1 flex flex-row space-x-2 items-center'>
                                            <CheckIcon className='text-xs text-white'/>
                                            <p className='text-white text-xs'>Phone number verified</p>
                                        </div>
                                        <div className='bg-black rounded-md px-2 py-1 flex flex-row space-x-2 items-center'>
                                            <CheckIcon className='text-xs text-white'/>
                                            <p className='text-white text-xs'>Lease verified</p>
                                        </div>
                                        {/* <div className='bg-black rounded-md px-2 py-1 flex flex-row space-x-2 items-center'>
                                            <CheckIcon className='text-xs text-white'/>
                                            <p className='text-white text-xs'>ID verified</p>
                                        </div> */}
                                    </div>
                                </div>                
                            </div>
                            <div className='space-y-2'>
                                <p className='font-medium text-md'>Message from {tenantDetails.firstName}</p>
                                <p className='text-sm md:text-base text-slate-500'>A two bedroom apartment in bedstuy, lots of natural light and beautifully decorated. I would be living in the other room and we would share living room, kitchen and bathroom.</p>
                            </div>
                            {!mySublet &&
                            <div className='flex flex-col space-y-3 pt-6'>
                                <div onClick={()=> setContactUsModal(true)} className='py-3 px-3 rounded-md border-black border-2 w-fit cursor-pointer'>
                                    <p className='text-black text-sm font-medium'>Ask {tenantDetails.firstName} a question</p>
                                </div>
                                <p className='text-slate-500 text-xs w-4/6'>To protect your payment, never transfer money or communicate outside of the Nextstay website or app.</p>
                            </div>
                            }
                        </div>

                        {/* Amenities */}
                        <div className='py-6 md:py-10 w-full flex flex-col space-y-4 border-b border-grey-200'>  
                            <p className="text-2xl font-semibold md:font-medium">Amenities</p>
                            <div className='gap-6 grid grid-cols md:grid-cols-2'>
                                {propDetails.amenities.map((item)=>{
                                    return (
                                        <div key={"amenitiesDiv" + item} className='flex flex-row items-center space-x-3 '>
                                            {getAmenitiesIcon(item)}
                                            <p>{item}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* nextStay Security */}
                        <div className='py-6 md:py-10 w-full flex flex-col space-y-4 border-b border-grey-200'>  
                            <p className={`${urbanist.className} text-2xl font-semibold`}>nextstay <span className='text-[#2390FF]'>Secure</span></p>
                            <p className='text-sm md:text-base text-slate-500'>You’re covered. Every booking includes protection for you security deposit and any possible damages to the apartment. Your security deposit will be safeguarded by nextStay until move-out.  <span className='font-semibold text-[#2390FF]'>Learn More</span></p>
                        </div>

                        {/* Common Q&A */}
                        {/* <div className='py-6 md:py-10 w-full flex flex-col space-y-4 border-b border-grey-200'>  
                            <p className="text-2xl font-semibold md:font-medium">Common Q&A</p>
                            <div className='space-y-6'>
                                
                            </div>
                        </div> */}

                        {/* Mobile request to book */}
                        <div className='py-4 md:hidden px-5 bg-white w-full justify-between flex flex-row border-t border-gray-200 items-center opacity-0'>
                            <p className='font-semibold'>${propDetails.rent} per month</p>
                            <div className='py-3 px-3 rounded-md bg-gradient-to-r from-[#2390FF] to-[#174AFE]'>
                                <p className='font-sm text-white truncate'>Request to books</p>
                            </div>
                        </div>
                    </div>

                    {/* This is the booking div for web users */}
                    <div className='hidden md:flex w-5/12 flex-col flex items-end py-6'>
                        {!mySublet &&
                        <div className='w-4/5 rounded-lg border border-gray-200 shadow-lg flex flex-col block flex p-6 space-y-6'>
                            <p className='text-xl font-medium'>${propDetails.rent} <span className='font-normal'>monthly</span></p>
                            
                            <div className='flex flex-col items-center  border border-gray-400  rounded-md'>
                                <div onClick={(e)=>handleDateClick(e)} className='flex flex-row w-full cursor-pointer'>
                                    <div className='flex flex-col space-y-1 flex-1 border-r border-gray-400 p-2'>
                                        <p className='font-medium'>From</p>
                                        <p className='text-sm text-slate-500'>{new Date(dateRange.startDate).toLocaleDateString('en-us',{month:'short', day:'numeric', year:'numeric'})}</p>
                                    </div>
                                    <div className='flex flex-col space-y-1 flex-1 p-2'>
                                        <p className='font-medium'>To</p>
                                        <p className='text-sm text-slate-500'>{new Date(dateRange.endDate).toLocaleDateString('en-us',{month:'short', day:'numeric', year:'numeric'})}</p>
                                    </div>
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
                                                minDate={new Date(propDetails?.from)}
                                                maxDate={new Date(propDetails?.to)}
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
                                <div className='flex-row w-full border-t border-gray-400'>
                                    <Select value={{value: `${guests} guest` , label: `${guests} guest`}} onChange={(val) => setGuests(val.value)} inputProps={{readOnly:true}} isSearchable={ false }  placeholder="guests" styles={{control: base => ({ ...base, cursor:'pointer', border:'none', outline:'none', boxShadow: 'none', height:60, flex: 1})}} options={GUESTS}/>                      
                                </div>
                            </div>
                            {/* Web reqesut to book */}
                            <div className='space-y-3'>
                                <div onClick={()=> handleWebRequestToBook()} className={`py-3 px-3 rounded-md ${loading ? "bg-gray-400" : "bg-gradient-to-r from-[#2390FF] to-[#174AFE]"} flex justify-center items-center cursor-pointer h-[7vh]`}>
                                    {loading ?
                                    <LoadingDots/>
                                    :
                                    <p className='font-sm text-white truncate'>Request to book</p>
                                    }
                                </div>
                                <p className="font-normal text-sm w-full text-center text-slate-500">You won’t be charged yet</p>
                            </div>
                        </div>
                        }
                    </div>

                </div>
                {/* Mobile request to book */}
                <div className='fixed bottom-0 py-4 px-5 bg-white w-full justify-between flex flex-row border-t border-gray-200 items-center md:hidden'>
                    <p className='font-semibold'>${propDetails.rent} per month</p>
                    <div onClick={()=> handleMobileRequestToBook()} className='py-3 px-3 rounded-md bg-gradient-to-r from-[#2390FF] to-[#174AFE]'>
                        <p className='font-sm text-white truncate'>Request to book</p>
                    </div>
                </div>
                
                <DateSelectModal edit={false} dateRange={dateRange} setDateRange={setDateRange} dateSelectionModal={dateSelectionModal} closeDateSelectionModal={()=>setDateSelectionModal(false)}/>
                <ImageGalleryModal imageGalleryModal={imageGalleryModal} handleClose={()=>closeImageGalleryModal()} images={propDetails.images} />
                <ContactUsModal propDetails={propDetails} tenantDetails={tenantDetails} contactUsModal={contactUsModal} handleClose={()=> handleContactUsModalClose()}/>
                <SignUpModal signupLoginModel={webLoginModal} handleClose={()=>setWebLoginModal(false)}/>
            </div>
        }
        </div>
    )
}