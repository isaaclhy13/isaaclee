"use client"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import Select from 'react-select'

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';

//Lottie
import Lottie from "lottie-react";
import groovyWalkAnimation from '../../../public/groovyWalk.json'


//Icons
import WeekendIcon from '@mui/icons-material/Weekend';
import BedIcon from '@mui/icons-material/Bed';
import ApartmentIcon from '@mui/icons-material/Apartment';

import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';

import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

import LocationOnIcon from '@mui/icons-material/LocationOn';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import BoltIcon from '@mui/icons-material/Bolt';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';


//Const 
import { getAmenitiesIcon, OCCUPATIONOPTIONS, PAIDAMENITIES, POSTINGAMENITIES, ROOMMATES, UTILITIES } from "@/constants/sharedUtils";
import { AGES } from "@/constants/sharedUtils";
import { BEDSIZES } from "@/constants/sharedUtils";
import ListingImageOptions from "@/components/property/listingImageOptions";
import LoadingDots from "@/components/loadingDots";
import PostingSuccessfullModal from "@/components/notification/postingSuccessModal";


const NEXTSTAYERS = [1,1,1,1,1]
export default function PostingPage(){
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [pageIndex, setPageIndex] = useState(0)
    const [autocompleteItems, setAutocompleteItems] = useState([])
    const [listingLocationItem, setListingLocationItem] = useState()
    const [listingLocation, setListingLocation] = useState("")
    const [listingFullLocation, setListingFullLocation] = useState(null)
    const [listingType, setListingType] = useState(null)
    const [listingNumberOfBedrooms, setListingNumberOfBedrooms] = useState(1)
    const [listingNumberOfBeds, setListingNumberOfBeds] = useState(1)
    const [listingNumberOfBathrooms, setListingNumberOfBathrooms] = useState(1)
    const [listingNumberofLivingrooms, setListingNumberOfLivingrooms] = useState(0)

    const [listingSomeoneElseLiving, setListingSomeoneElseLiving] = useState(null)

    const [listingNumberOfRoommates, setListingNumberOfRoommates] = useState(1)

    const [listingRoommateDetails, setListingRoommateDetails] = useState([{gender: null, age: null, occupation: null}])

    const [listingBedSizes, setListingBedSizes] = useState([null])

    const [listingDateRange, setListingDateRange] = useState({startDate: null, endDate:  null , key:"selection"})

    const [listinInquireGender, setListingInquireGender] = useState([])

    const [listingPaidAmenities, setListingPaidAmenities] = useState([])
    const [listingPaidUtilities, setListingPaidUtilities] = useState([])

    const [listingWifi, setListingWifi] = useState({available: null, price: null})

    const [listingElectricity, setListingElectricity] = useState("")

    const [listingRent, setListingRent] = useState("")

    const [listingRentShowMore, setListingRentShowMore] = useState(false)

    const [listingImages, setListingImages] = useState([])
    const filesInput = useRef(null)
    const filesInputEdit = useRef(null)
    const [listinImageReaplceIndex, setListingImageReplaceIndex] = useState(null)

    const [listingFloorplan, setListingFloorplan] = useState(null)
    const floorplanInput = useRef(null)

    const [listingDescription, setListingDescription] = useState("")

    const [listingImageIndex, setListingImageIndex] = useState(0)
    const [navButtons, setNavButtons] = useState(false)

    const [postingSuccessModal, setPostingSuccessModal] = useState(false)

    function handleLocationChange(locationInput){
        setListingLocation(locationInput)
        if(locationInput == ""){ return }
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        fetch(`https://nextstay-09a1b7efd58f.herokuapp.com/location/autocomplete/${locationInput}`, requestOptions)
        .then(async res => {
            if(res.status == 200){
                let data = await res.json()
                setAutocompleteItems(data.data)
            }
        })
        .catch(error => console.log('error', error));    
    }

    function handleAutocompleteItemClick(item){
        setListingLocationItem(item)
        setListingLocation(item.main_text + " " + item?.secondary_text)
        setAutocompleteItems([])
    }

    function handleNumberOfBedroomsClick(op) {
        if(op == "-" && listingNumberOfBedrooms >= 2){
            setListingNumberOfBedrooms(listingNumberOfBedrooms - 1)
        }
        else if (op == "+"){
            setListingNumberOfBedrooms(listingNumberOfBedrooms + 1)
        }
    }

    function handleNumberOfBedsClick(op) {
        if(op == "-" && listingNumberOfBeds >= 2){
            setListingNumberOfBeds(listingNumberOfBeds - 1)
            setListingBedSizes((previousArr) => (previousArr.slice(0, -1)));
        }
        else if (op == "+"){
            setListingNumberOfBeds(listingNumberOfBeds + 1)
            setListingBedSizes(oldArray => [...oldArray, null]);
        }
    }

    function handleNumberOfBathroomsClick(op) {
        if(op == "-" && listingNumberOfBathrooms >= 2){
            setListingNumberOfBathrooms(listingNumberOfBathrooms - 1)
        }
        else if (op == "+"){
            setListingNumberOfBathrooms(listingNumberOfBathrooms + 1)
        }
    }

    function handleNumberOfLivingroomsClick(op) {
        if(op == "-" && listingNumberofLivingrooms >= 1){
            setListingNumberOfLivingrooms(listingNumberofLivingrooms - 1)
        }
        else if (op == "+"){
            setListingNumberOfLivingrooms(listingNumberofLivingrooms + 1)
        }
    }

    function handleNumberOfRoommatesClick(op){
        if(op == "-" && listingNumberOfRoommates >= 1){
            setListingNumberOfRoommates(listingNumberOfRoommates - 1)
            setListingRoommateDetails((previousArr) => (previousArr.slice(0, -1)));
        }
        else if (op == "+"){
            setListingNumberOfRoommates(listingNumberOfRoommates + 1)
            setListingRoommateDetails(oldArray => [...oldArray, {gender: null, age: null, occupation: null}]);
        }
    }

    function handleRoommateDetailsClick(changeIndex, field, value){
        let updatedList = listingRoommateDetails.map((item,index) => 
        {
            if (index == changeIndex){
            if(field == "gender"){
                return {...item, gender: value}; //gets everything that was already in item, and updates "done"
            } else if (field == "occupation"){
                return {...item, occupation: value}
            } else if (field == "age"){
                return {...item, age: value}
            }
            
            }
            return item; // else return unmodified item 
        });
        setListingRoommateDetails(updatedList); // set state to new object with updated list
    }

    function handelListingBedSizesClick(changeIndex, value) {
        let updatedList = listingBedSizes.map((item,index) => 
        {
            if (index == changeIndex){
                return value
            }
            return item; // else return unmodified item 
        });
        setListingBedSizes(updatedList); // set state to new object with updated list
    }

    function handleInquireGenderClick(gender){
        let updatedList = listinInquireGender
        if(listinInquireGender.includes(gender)){
            setListingInquireGender(updatedList.filter( gen => gen != gender))
        }
        else{
            setListingInquireGender(old => [...old, gender])
        }
    }

    function handlePaidUtilitiesClick(name){
        let updatedList = listingPaidUtilities
        if(listingPaidUtilities.includes(name)){
            setListingPaidUtilities(updatedList.filter( item => item != name))
        }
        else{
            setListingPaidUtilities(old => [...old, name])
        }
    }
    
    function handlePaidAmenitiesClick(name){
        let updatedList = listingPaidAmenities
        if(listingPaidAmenities.includes(name)){
            setListingPaidAmenities(updatedList.filter( item => item != name))
        }
        else{
            setListingPaidAmenities(old => [...old, name])
        }
    }

    function handleImageSelectClick(){
        filesInput.current.click()
    }

    function handleImageInputClick(e){
        let numberOfImages = e.target.files.length
        if (numberOfImages == 0) {return}
        let imageCount = 1;
        for(let i = 0; i < numberOfImages ; i++){
            if(listingImages.length + imageCount > 10) {
                break
            }
            imageCount++;
            setListingImages(oldArray => [...oldArray, {"file": e.target.files[i], "imageURL": URL.createObjectURL(e.target.files[i])}])
        }
    }

    function handleImageOptionsPrimaryClick(toChangeIndex){
        let primaryFile = listingImages[0];
        let toChangeFile= listingImages[toChangeIndex];

        let updatedList = listingImages.map((item,index) => 
        {
            if (index == 0){
                return toChangeFile
            }
            else if(index == toChangeIndex){
                return primaryFile
            }
            return item; // else return unmodified item 
        });
        setListingImages(updatedList); // set state to new object with updated list
        window.scroll({top:0, behavior:'smooth'})
    }

    function handleImageOptionsReplaceClick(toChangeIndex){
        setListingImageReplaceIndex(toChangeIndex)
        filesInputEdit.current.click()
    }

    function handleImageReplace(e){
        let toChangeIndex = listinImageReaplceIndex
        if(toChangeIndex != null){
            let updatedList = listingImages.map((item,index) => 
            {
                if (index == toChangeIndex){
                    return {"file": e.target.files[0], "imageURL": URL.createObjectURL(e.target.files[0])}
                }
                return item; // else return unmodified item 
            });
            setListingImages(updatedList)
        }
    }

    function handleImageOptionsDeleteClick(toChangeIndex){
        if(toChangeIndex != null){
            let updatedList = listingImages.map((item,index) => 
            {
                if (index == toChangeIndex){
                    return null
                }
                return item; // else return unmodified item 
            });
            setListingImages(updatedList)
        }
    }

    function handleFloorplanImageClick(){
        floorplanInput.current.click()
    }

    function handleFloorplanInputChange(e){
        setListingFloorplan({"file": e.target.files[0], "imageURL": URL.createObjectURL(e.target.files[0])})
    }

    function handleFloorplanOptionClick(op){
        if(op == "replace"){
            handleFloorplanImageClick()
        } else if ( op == "delete") {
            setListingFloorplan(null)
        }
    }

    function verifyListingLocation(){
        if(listingLocationItem == null){
            alert("Please enter the location of your place.")
            return
        } else if (listingLocationItem.main_text == null || listingLocationItem.main_text.trim() == ""){
            alert("Please enter a more specific location.")
            setListingLocation("")
            return false
        }  else if (listingLocationItem.secondary_text == null || listingLocationItem.secondary_text.trim() == ""){
            alert("Please enter a more specific location.")
            setListingLocation("")
            return false
        }
        // if(listingLocation == null || listingLocation == undefined){
        //     alert("Please enter the location of your place.")
        //     setListingLocation()
        //     return false
        // } else if (listingLocation.main_text == null || listingLocation.main_text.trim() == ""){
        //     alert("Please enter a more specific location.")
        //     setListingLocation()
        //     return false
        // } else if (listingLocation.secondary_text == null || listingLocation.secondary_text.trim() == ""){
        //     alert("Please enter a more specific location.")
        //     setListingLocation()
        //     return false
        // } else {
        //     return true
        // }
        return true
    }

    function verifyListingType(){
        if(listingType == null){
            alert("Please select the type of your place.")
            return false;
        } else { return true}
    }

    function verifyListingNumberOfRoommates(){
        if(listingNumberOfRoommates == 0) { return true }
        else {
            let containsNull = listingRoommateDetails.map((item, index)=> {
                let alerted = false
                let test = Object.entries(item).map(entry => {
                    let key = entry[0];
                    let value = entry[1];
                    if(value == null && !alerted){
                        alert(`Please select roommate ${index+1}'s ${key}.`)
                        alerted = true
                        return true;
                    }
                });
                return test

            })
            return containsNull[0].indexOf(true) != -1 ? false : true 
        }
    }

    function verifyListingBedSizes(){
        let containsNull = listingBedSizes.map((item, index)=> {
            if(item == null){
                alert(`Please select bed ${index+1}'s size.`)
                return true
            }
        })
        return containsNull[0] ? false : true
    }

    function verifyListingDates(){
        if(listingDateRange.startDate == null){
            alert("Please select a start date.")
            return false
        } else if (listingDateRange.endDate == null || listingDateRange.startDate == listingDateRange.endDate) {
            alert("Please select an end date.")
            return false
        }
        return true
    }

    function verifyInquirerGender(){
        if(listinInquireGender.length == 0){
            alert("Please select genders whom can enquire about your sublet.")
            return false
        }
        return true
    }

    function verifyListingPrice(){
        if(listingRent.trim() == "" || parseInt(listingRent) == 0 || parseInt(listingRent) > 10000){
            alert("Please enter a valid monthly rent price.")
            return false
        }
        return true
    }

    function handleIntegerInput(newVal, prevVal){
        if(newVal == "" || !isNaN(Number(newVal))){
            return newVal
        } 
        return prevVal
    }

    function verifyListingWifi(){
        if(listingWifi.available && ( listingWifi.price == null || listingWifi.price.trim() == "")){
            alert("Please enter cost of WiFi per month.")
            return false
        }
        return true
    }

    function verifyListingElectrivity(){
        if(listingElectricity == null || listingElectricity.trim() == ""){
            alert("Please enter cost of electricity per month.")
            return false
        }
        return true
    }

    function verifyListingImages(){
        //Clean null
        let nonNullListingImages = listingImages.filter(x => x != null)
        setListingImages(nonNullListingImages)
        if(nonNullListingImages.length < 5){
            alert("Please add at least 5 images of your sublet.")
            return false
        }
        return true
    }

    function handleImageScroll(op, e){
        e.stopPropagation();  
       
        
        if(op == "+" && listingImageIndex < listingImages.length -1){
            setListingImageIndex(listingImageIndex+1)
        }
        else if(op == "-" && listingImageIndex > 0){
            setListingImageIndex(listingImageIndex-1)
        }
    }

    function postSublet(){
        setLoading(true)
        let at = localStorage.getItem("at")

        if(at == null){
            alert("Error occured, please try again later!")
        }

        var formdata = new FormData();

        //Sublet location
        console.log("location_main_text: ", listingLocationItem.main_text)
        console.log("location_secondary_text: ", listingLocationItem.secondary_text)

        formdata.append("location_main_text", listingLocationItem.main_text);
        formdata.append("location_secondary_text",listingLocationItem.secondary_text);

        //Sublet type 
        console.log("type: ", listingType)
        formdata.append("type", listingType);

        //Sublet basic information
        console.log("bed", listingNumberOfBeds.toString())
        console.log("bath", listingNumberOfBathrooms.toString())
        formdata.append("bed", listingNumberOfBeds.toString());
        formdata.append("bath", listingNumberOfBathrooms.toString());

        formdata.append("converted_room", listingNumberofLivingrooms.toString())
        //STILL NEED NUMBER OF BEDS
        //STILL NEED LIVINGROOM CONVERTED ROOM

        //Sublet number of roommates and roommates details
        console.log("num_roommates: ", listingRoommateDetails.length)
        formdata.append("num_roommates", listingRoommateDetails.length)


        listingRoommateDetails.map((item, index) => {
            console.log("roommates: ", JSON.stringify({roommate_id: index + 1, gender: item.gender, type: item.occupation, age: item.age}))
            formdata.append("roommates", JSON.stringify({roommate_id: index + 1, gender: item.gender, type: item.occupation, age: item.age}))
        })

        //Sublet bed sizes
        listingBedSizes.map((item) => {
            console.log("bed_info: ", item)
            formdata.append("bed_info", item);
        })

        //Sublet availability
        console.log("from: ", new Date(listingDateRange.startDate).toString())
        console.log("to: ", new Date(listingDateRange.endDate).toString())
        formdata.append("from", new Date(listingDateRange.startDate).toString());
        formdata.append("to", new Date(listingDateRange.endDate).toString());

        //Sublet who can enquire
        listinInquireGender.map((item) => {
            console.log("gender_can_inquire: ", item)
            formdata.append("gender_can_inquire", item);
        })

        //Sublet price
        console.log("rent: ", listingRent.toString())
        console.log("security_deposit: ", (listingRent/2).toString())
        formdata.append("rent", listingRent.toString());
        formdata.append("security_deposit", (listingRent/2).toString());

        //Wifi and electricity
        console.log("wifi_included: ", "true")
        formdata.append("wifi_included", "true");
        if(!listingPaidUtilities.includes("WiFi")){
            console.log("wifi_cost: ", "true")
            formdata.append("wifi_cost", parseInt(listingWifi.price));
        }
        if(listingPaidUtilities.includes("Electricity")){
            console.log("electricity_included: ", "true")
            formdata.append("electricity_included", "true");

        } else {
            console.log("electricity_included: ", "false")
            console.log("electricity_cost: ", listingElectricity)
            formdata.append("electricity_included", "false");
            formdata.append("electricity_cost", parseInt(listingElectricity));
        }

        //Listing amenities
        listingPaidAmenities.map((item)=>{
            console.log("amenities: ", item)
            formdata.append("amenities", item)
        })

        //Listing images
        listingImages.map((item)=>{
            console.log("image: ", item.file, item.file.name)
            formdata.append("image", item.file, item.file.name)
        })

        //Listing floorplan
        if(listingFloorplan != null){
            console.log("floorplan_exists: ", "true")
            console.log("image: ", listingFloorplan.file, listingFloorplan.file.name)
            formdata.append("floorplan_exists", "true");
            formdata.append("image", listingFloorplan.file, listingFloorplan.file.name)
        } else {
            console.log("floorplan_exists: ", "false")
            formdata.append("floorplan_exists", "false");
        }

        //Sublet description
        formdata.append("description", listingDescription);

        //Listing overview
        console.log("furnished: ", listingPaidAmenities.includes("Furnished (Mattress)"))
        console.log("washer_dryer: ", listingPaidAmenities.includes("Washer & Dryer (In-Unit)"))
        formdata.append("furnished", getFurnishedStatus() == "Fully furnished");
        formdata.append("washer_dryer", listingPaidAmenities.includes("Washer & Dryer (In-Unit)") || listingPaidAmenities.includes("Washer & Dryer (In-Building)"));

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${at}`)

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
          };
        fetch("https://nextstay-09a1b7efd58f.herokuapp.com/sublet/", requestOptions)
        .then( async (res) => {
            console.log("POSTING RES ", res.status)
            if(res.status == 200){
                setLoading(false)
                const data = await res.json()
                console.log("DATAAA ", data)
                router.replace("/")
            }
            else {
                setLoading(false)
                alert("Error occured. Please try again later!")
        
            }
        })
        .catch(e => {
            setLoading(false)
            alert("Error occured in catch. Please try again later!")
        })
    }

    function handleIndexNavigationForwardClick(){
        if(loading){
            return
        }
        console.log(pageIndex)
        //Verify location
        if(pageIndex == 1 && !verifyListingLocation()){ return }
        //Verify the type
        if(pageIndex == 2 && !verifyListingType()){ return }
        //Skipping pageIndex 3 (number of bedrooms, bathrooms and beds) since no validation needed

        //Skipping pageIndex 4 (someone else living) since can't unselect
        
        //PageIndex 5 "How many roommates will there be?"
        else if(pageIndex == 5 && !verifyListingNumberOfRoommates()){ return }
        //Select bed sizes, verifyListingBedSizes() will return a non empty string is error
        else if(pageIndex == 6 && !verifyListingBedSizes()){ return }
        else if(pageIndex == 7 && !verifyListingDates()){ return }
        else if(pageIndex == 8 && !verifyInquirerGender()) { return }
        else if(pageIndex == 9 && !verifyListingPrice()) { return }
        else if(pageIndex == 12 && !verifyListingElectrivity()) { return }
        else if(pageIndex == 14 && !verifyListingImages()) { return }
        else if(pageIndex == 17){
            postSublet()
            // alert("oops")
            return
        }
        else {
            setLoading(true)
            //All of page navigation logic
            if(pageIndex == 4 && listingSomeoneElseLiving == false){
               
                setTimeout(() => {
                    setPageIndex(pageIndex+2)
                    setLoading(false)
                }, "1500");
            }
            else if(pageIndex == 10){
                if(!listingPaidUtilities.includes("WiFi")){
                    setTimeout(() => {
                        setPageIndex(pageIndex+1)
                        setLoading(false)
                    // }, "1500");
                    }, "200");
                    
                }
                else if(!listingPaidUtilities.includes("Electricity")){
                    setTimeout(() => {
                        setPageIndex(pageIndex+2)
                        setLoading(false)
                    }, "1500");
                    // }, "200");
                    
                }
                else{
                    setTimeout(() => {
                        setPageIndex(pageIndex+3)
                        setLoading(false)
                    // }, "1500");
                    }, "1500");
                }
            }
            else if(pageIndex == 11) { 
                if(!verifyListingWifi()){
                    return
                }
                else if (listingPaidUtilities.includes("Electricity")){
                    setTimeout(() => {
                        setPageIndex(pageIndex+2)
                        setLoading(false)
                    // }, "1500");
                }, "1500");
                }
                else {
                    setTimeout(() => {
                        setPageIndex(pageIndex+1)
                        setLoading(false)
                    // }, "1500");
                }, "1500");
                }
            }
            else{
                setTimeout(() => {
                    setPageIndex(pageIndex+1)
                    setLoading(false)
                // }, "1500");
            }, "1500");
            }
        }
    }

    async function handleIndexNavigationBackwardClick(op){
        setLoading(true)
        // alert(pageIndex)
        if(pageIndex == 6 && listingSomeoneElseLiving == false){
            setLoading(true)
            setTimeout(() => {
                setPageIndex(pageIndex-2)
                setLoading(false)
            // }, "1500");
            }, "200");
        }
        else if(pageIndex == 12){
            if(listingPaidUtilities.indexOf("WiFi") != -1){
                setTimeout(() => {
                    setPageIndex(pageIndex- 2)
                    setLoading(false)
                }, "1500");
            }
            else{
                setTimeout(() => {
                    setPageIndex(pageIndex- 1)
                    setLoading(false)
                }, "1500");
            }
        }
        else if(pageIndex == 13){
            if(listingPaidUtilities.indexOf("Electricity") != -1 && listingPaidUtilities.indexOf("WiFi") != -1){
                setTimeout(() => {
                    setPageIndex(pageIndex- 3)
                    setLoading(false)
                }, "1500");
                
            }
            else if(listingPaidUtilities.indexOf("Electricity") != -1){
                setTimeout(() => {
                    setPageIndex(pageIndex- 2)
                    setLoading(false)
                }, "1500");
            }
            else{
                setTimeout(() => {
                    setPageIndex(pageIndex- 1)
                    setLoading(false)
                }, "1500");
            }
        }
        else{
            setTimeout(() => {
                setPageIndex(pageIndex-1)
                setLoading(false)
            }, "1500");
        }
    }

    function getFurnishedStatus(){
        if(listingPaidAmenities.includes("Desk") && listingPaidAmenities.includes("Chair") && listingNumberOfBeds > 0){
            return "Fully furnished"
        } else if(listingPaidAmenities.includes("Desk") || listingPaidAmenities.includes("Chair") || listingNumberOfBeds > 0){
            return "Partially furnished"
        } else {
            return "Unfurnished"
        }
    }

    return(
        <div className="flex flex-col w-full h-full">
            {/* Header nav bar */}
            <div className="py-4 flex px-5 border-b border-gray-100 flex flex-row justify-between items-center md:px-[10%] md:h-[10vh]">
                <div className="py-3 px-4 border rounded-full border-gray-300 cursor-pointer">
                    <p onClick={()=> router.back()} className="text-sm">Save & exit</p>
                </div>
            </div>

            <div className={`transition-all ${loading ? 'opacity-0' : 'opacity-100'} ease-out duration-300 w-full md:h-[79vh]`}>

                {pageIndex == 0 &&
                    <div className="flex md:items-center h-full w-full md:flex-row px-5 md:px-[10%]">
                        <div className="md:w-1/2">
                            <div className="py-5 ">
                                <p className="text-2xl font-semibold md:text-3.5xl">Sublease reimagined, <br/> sublet with <span className="text-[#2390FF]">nextstay</span> safer <br/> easier, and faster</p>
                            </div>

                            <div className="flex flex-col w-full">
                                <div className='flex flex-row space-x-5 items-center py-4 border-b border-gray-100'>
                                    <p className="font-medium">1</p>
                                    <div className='flex flex-col space-y-1'>
                                        <p className='font-semibold'>Tell us a bit about your place</p>
                                        <p className='text-sm text-slate-600 w-5/6'>Share basic information such as location, type, availability and amenities etc.</p>
                                    </div>
                                </div>
                                <div className='flex flex-row space-x-5 items-center py-4'>
                                    <p className="font-medium">2</p>
                                    <div className='flex flex-col space-y-1'>
                                        <p className='font-semibold'>Show others how it looks</p>
                                        <p className='text-sm text-slate-600 w-5/6'>Include amazing images so your sublet can stand out among others</p>
                                    </div>
                                </div>
                            </div>

                            <div className=" w-full py-8 items-center">
                                <p className="text-sm text-slate-600">Join <span className="font-medium" >100+</span> nextstayers and sublet your place today</p>
                                <div className="space-x-2 flex flex-row items-center">
                                    <div className="flex flex-row py-4 -space-x-2">
                                        {   NEXTSTAYERS.map((item,index)=> {
                                            return (
                                                <div key={"postingnextayers" + index} className="h-12 w-12 rounded-full bg-gray-200 justify-start border-4 border-white">
                                                    <img src="https://images.squarespace-cdn.com/content/v1/534e7ce5e4b0e50b069a89f2/1508768337700-Q6KQDMSXTXHE4XGPY2BA/TJ+Lee-5.jpg?format=750w" alt="Sublet image" className="w-full h-full rounded-full object-cover"/>
                                                </div>
                                            )})
                                        }
                                    </div>
                                    <p className="text-sm text-gray-700 font-semibold">30+ more ...</p>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:flex w-1/2 justify-center items-center">
                            <Lottie animationData={groovyWalkAnimation} loop={true} className="w-full"/>
                        </div>
                    </div>
                }

                {/* Address */}
                {pageIndex == 1 &&
                    <div className="flex flex-col flex-1 justify-center">
                        <div className="flex flex-col w-full py-5 px-5 md:pb-4 md:pt-10 space-y-6 md:w-2/5 md:self-center">
                            <p className="text-2xl font-medium">What is the address of your place?</p>
                            <input type="text" value={listingLocation} onChange={(val)=> handleLocationChange(val.target.value)} className="border border-gray-300 rounded-md block w-full px-3 py-4 ring-0 focus:border-black focus:ring-0" placeholder='Search location ...'/>
                        </div>
                        <div className="px-5 md:w-2/5 md:self-center">
                            {
                                autocompleteItems.map((item, index) => {
                                    return (
                                        <div key={"autocompleteItems" + index} onClick={()=>handleAutocompleteItemClick(item)} className="w-full py-4 border-b border-gray-200 flex flex-row items-center space-x-2 cursor-pointer">
                                            <LocationOnIcon className="text-black text-md"/>
                                            <div className="flex flex-col">
                                                <p className="font-medium">{item.main_text}</p>
                                                <p className="text-sm text-gray-600">{item.secondary_text}</p>
                                            </div>
                                        </div>
                                    )
                                })
                                    
                            }
                        </div>
                        <div className="w-full h-[12vh]">
                        </div>

                    </div>
                }

                {/* Type */}
                {pageIndex == 2 &&
                    <div className="flex flex-1 justify-center">
                        <div className="flex flex-col w-full py-5 px-5 space-y-6 md:w-2/5 md:py-10">
                            <p className="text-2xl font-medium">Which of these best describes your place?</p>
                            <div className="flex flex-col space-y-4">
                                <div onClick={()=>{setListingType("Studio"), setListingSomeoneElseLiving(false)}} className={`flex flex-row items-center px-5 md:py-4 space-x-5 border-2 ${listingType == "Studio" ? "border-black" : "border-gray-200"} rounded-md py-3 ${listingType == "Studio" ? "bg-gray-100" : "bg-white"} cursor-pointer`}>
                                    <WeekendIcon className="text-3xl"/>
                                    <div className='flex flex-col space-y-1'>
                                        <p className='font-semibold'>Studio</p>
                                        <p className='text-sm text-slate-600 '>Open concept apartment where there is no specific bedroom</p>
                                    </div>
                                </div>
                                <div onClick={()=> {setListingType("Room"), setListingSomeoneElseLiving(true)}} className={`flex flex-row items-center px-5 md:py-4 space-x-5 border-2 ${listingType == "Room" ? "border-black" : "border-gray-200"} rounded-md py-3 ${listingType == "Room" ? "bg-gray-100" : "bg-white"} cursor-pointer`}>
                                    <BedIcon className="text-3xl"/>
                                    <div className='flex flex-col space-y-1'>
                                        <p className='font-semibold'>Room</p>
                                        <p className='text-sm text-slate-600 '>One room within the apartment with shared or private bathroom. (Includes 1 bed 1 bath)</p>
                                    </div>
                                </div>
                                <div onClick={()=> {setListingType("Apartment"), setListingSomeoneElseLiving(false)}} className={`flex flex-row items-center md:py-4 px-5 space-x-5 border-2 ${listingType == "Apartment" ? "border-black" : "border-gray-200"} rounded-md py-3 ${listingType == "Apartment" ? "bg-gray-100" : "bg-white"} cursor-pointer`}>
                                    <ApartmentIcon className="text-3xl"/>
                                    <div className='flex flex-col space-y-1'>
                                        <p className='font-semibold'>Entire apartment</p>
                                        <p className='text-sm text-slate-600 '>Multiple bedrooms and bathrooms. No other people will be present during the sublease</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }           

                {/* Basic information : number of bedrooms, bathrooms, beds */}
                {pageIndex == 3 &&
                    <div className="flex flex-1 justify-center">
                        <div className="flex flex-col w-full py-5 px-5 space-y-6 md:w-fit md:max-w-[50%]">
                            <p className="text-2xl font-medium">Basic information about your place</p>
                            <div className="flex flex-col ">
                                <div className='flex flex-col py-5 md:py-8 border-b border-gray-200'>
                                    <div className='flex flex-row justify-between items-center w-full ' > 
                                        <p className=''>Number of bedrooms</p>
                                        <div className='flex flex-row space-x-4 items-center'>
                                            <RemoveCircleIcon onClick={()=> handleNumberOfBedroomsClick("-")} className='text-3xl cursor-pointer' />
                                            <p className="w-6 text-center">{listingNumberOfBedrooms}</p>
                                            <AddCircleIcon onClick={()=> handleNumberOfBedroomsClick("+")}  className='text-3xl cursor-pointer' />
                                        </div>
                                    </div>
                                    <p className='text-slate-600 text-sm w-4/6'>Within the entire place</p>
                                </div>
                                {/* <div className='flex flex-col py-5 md:py-8 border-b border-gray-200'>
                                    <div className='flex flex-row justify-between items-center w-full ' > 
                                        <p className=''>Number of beds</p>
                                        <div className='flex flex-row space-x-4 items-center'>
                                            <RemoveCircleIcon onClick={()=> handleNumberOfBedsClick("-")} className='text-3xl cursor-pointer' />
                                            <p className="w-6 text-center">{listingNumberOfBeds}</p>
                                            <AddCircleIcon onClick={()=> handleNumberOfBedsClick("+")}  className='text-3xl cursor-pointer' />
                                        </div>
                                    </div>
                                    <p className='text-slate-600 text-sm w-4/6'>Available for guest</p>
                                </div> */}
                                <div className='flex flex-col py-5 md:py-8 border-b border-gray-200'>
                                    <div className='flex flex-row justify-between items-center w-full ' > 
                                        <p className=''>Number of bathrooms</p>
                                        <div className='flex flex-row space-x-4 items-center'>
                                            <RemoveCircleIcon onClick={()=> handleNumberOfBathroomsClick("-")} className='text-3xl cursor-pointer' />
                                            <p className="w-6 text-center">{listingNumberOfBathrooms}</p>
                                            <AddCircleIcon onClick={()=> handleNumberOfBathroomsClick("+")}  className='text-3xl cursor-pointer' />
                                        </div>
                                    </div>
                                    <p className='text-slate-600 text-sm w-4/6'>Within the entire place</p>
                                </div>
                                <div className='flex flex-col py-5 md:py-8'>
                                    <div className='flex flex-row justify-between items-center w-full ' > 
                                        <p className=''>Livingroom converted room</p>
                                    
                                        <div className='flex flex-row space-x-4 items-center'>
                                            <RemoveCircleIcon onClick={()=> handleNumberOfRoommatesClick("-")} className='text-3xl cursor-pointer' />
                                            <p className="w-6 text-center">{listingNumberofLivingrooms}</p>
                                            <AddCircleIcon onClick={()=> handleNumberOfLivingroomsClick("+")}  className='text-3xl cursor-pointer' />
                                        </div>
                                    </div>
                                    <p className='text-slate-600 text-sm w-4/6'>Please only indicate if there is someone living in the living room or this is a living room sublet </p>
                                </div>
                            </div>

                        </div>
                    </div>
                }

                {/* Are there roommates */}
                {pageIndex == 4 &&
                    <div className="flex flex-1 justify-center">
                        <div className="flex flex-col w-full py-5 px-5 space-y-6 md:w-fit md:max-w-[50%]">
                            <p className="text-2xl font-medium">Will anyone else live in the sublet?</p>
                            <div className="flex flex-row gap-4">
                                <div onClick={()=> setListingSomeoneElseLiving(true)} className={`px-4 py-4 rounded-md ${listingSomeoneElseLiving ? "border-2" : "border"} ${ listingSomeoneElseLiving ? "border-black" : "border-gray-300"} flex flex-row space-x-3 text-gray-700 ${listingSomeoneElseLiving ? "bg-gray-100" : "bg-white"} cursor-pointer`}>
                                    <PeopleIcon className=""/>
                                    <p>Yes</p>
                                </div>
                                <div onClick={()=> setListingSomeoneElseLiving(false)} className={`px-4 py-4 rounded-md ${!listingSomeoneElseLiving ? "border-2" : "border"} ${ !listingSomeoneElseLiving ? "border-black" : "border-gray-300"} flex flex-row space-x-3 text-gray-700 ${!listingSomeoneElseLiving ? "bg-gray-100" : "bg-white"} cursor-pointer`}>
                                    <PersonIcon className=""/>
                                    <p>No</p>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {/* Roommate situation (optional) */}
                {pageIndex == 5 &&
                    <div className="flex flex-1 justify-center overflow-y-scroll h-full">
                        <div className="flex flex-col w-full py-5 px-5 md:w-2/5 ">
                            <p className="text-2xl font-medium">How many roommates will there be?</p>
                            <div className="flex flex-col ">
                                <div className='flex flex-row justify-between items-center w-full border-b border-gray-200 py-5 md:py-8'>
                                    <p className='text-gray-700'>Number of roommates</p>
                                    <div className='flex flex-row space-x-4 items-center'>
                                        <RemoveCircleIcon onClick={()=> handleNumberOfRoommatesClick("-")} className='text-3xl cursor-pointer' />
                                        <p className="w-6 text-center" >{listingNumberOfRoommates}</p>
                                        <AddCircleIcon onClick={()=> handleNumberOfRoommatesClick("+")}  className='text-3xl cursor-pointer' />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex flex-col">
                                {listingRoommateDetails.map((item, index) => {
                                    return (
                                        <div key={"roommatedetails" + index} className="flex flex-col space-y-6 py-6 border-b border-gray-200 md:py-8">
                                            <p className='font-semibold '>Roomate {index + 1}</p>
                                            <div className="flex flex-row gap-4 overflow-auto flex-wrap">
                                                <div onClick={()=> handleRoommateDetailsClick(index, "gender", "Male")} className={`px-4 py-4 rounded-md items-center border ${ item.gender == "Male" ? "border-black" : "border-gray-300"} flex flex-row space-x-3 text-gray-700 ${item.gender == "Male" ? "bg-gray-100" : "bg-white"} cursor-pointer`}>
                                                    <MaleIcon className=""/>
                                                    <p>Male</p>
                                                </div>
                                                <div onClick={()=> handleRoommateDetailsClick(index, "gender", "Female")} className={`px-4 py-4 rounded-md items-center border ${ item.gender == "Female" ? "border-black" : "border-gray-300"} flex flex-row space-x-3 text-gray-700 ${ item.gender == "Female"? "bg-gray-100" : "bg-white"} cursor-pointer`}>
                                                    <MaleIcon className=""/>
                                                    <p>Female</p>
                                                </div>
                                                <div onClick={()=> handleRoommateDetailsClick(index, "gender", "Others")} className={`px-4 py-4 rounded-md items-center border ${item.gender == "Others" ? "border-black" : "border-gray-300"} flex flex-row space-x-3 text-gray-700 ${item.gender == "Others" ? "bg-gray-100" : "bg-white"} cursor-pointer`}>
                                                    <div>   
                                                        <MaleIcon className=""/>
                                                        <FemaleIcon className=""/>
                                                    </div>
                                                    <p>Others</p>
                                                </div>
                                            </div>

                                            <div>
                                                <Select value={item.occupation == null ? null : {value: item.occupation, label: item.occupation}} inputProps={{readOnly:true}} isSearchable={ false } placeholder="Occupation" onChange={(val)=> handleRoommateDetailsClick(index, "occupation", val.value)} styles={{control: base => ({ ...base, height: 60, minHeight: 60, borderColor: "#D9D9D9" })}} options={OCCUPATIONOPTIONS} />
                                            </div>
                                            <div>
                                                <Select value={item.age == null ? null : {value: item.age, label: item.age}} inputProps={{readOnly:true}} isSearchable={ false } placeholder="Age" styles={{control: base => ({ ...base, height: 60, minHeight: 60, borderColor: "#D9D9D9" })}} options={AGES} onChange={(val)=> handleRoommateDetailsClick(index, "age", val.value)}/>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="w-full py-16"/>
                        </div>
                    </div>
                }

                {/* Bed size details */}
                {pageIndex == 6 &&
                    <div className="flex flex-1 justify-center">
                        <div className="flex flex-col w-full py-5 px-5 space-y-2 md:w-fit">
                            <p className="text-2xl font-medium">How many beds are available for the guest(s)?</p>
                             <div className='flex flex-col py-5 md:py-8 border-b border-gray-200'>
                                <div className='flex flex-row justify-between items-center w-full ' > 
                                    <p className=''>Number of beds</p>
                                    <div className='flex flex-row space-x-4 items-center'>
                                        <RemoveCircleIcon onClick={()=> handleNumberOfBedsClick("-")} className='text-3xl cursor-pointer' />
                                        <p className="w-6 text-center">{listingNumberOfBeds}</p>
                                        <AddCircleIcon onClick={()=> handleNumberOfBedsClick("+")}  className='text-3xl cursor-pointer' />
                                    </div>
                                </div>
                                <p className='text-slate-600 text-sm w-4/6'>Available for guest</p>
                            </div>
                            {listingBedSizes.map((item, index) => {
                                return (
                                    <div key={"bedDetails" + index} className="flex flex-col space-y-6 py-6 border-b border-gray-200">
                                        <p className='font-semibold'>Bed {index + 1}</p>
                                        <div className="flex flex-row gap-4 overflow-auto flex-wrap">
                                            {BEDSIZES.map((bedItem, bedIndex)=>{
                                                return (
                                                    <div key={"bedSizes" + bedIndex} onClick={()=> handelListingBedSizesClick(index, bedItem)} className={`px-4 py-4 md:px-6 cursor-pointer rounded-md items-center border-2 ${ item == bedItem ? "border-black" : "border-gray-300"} flex flex-row space-x-3 text-gray-700 ${item == bedItem ? "bg-gray-100" : "bg-white"}`}>
                                                        <p>{bedItem}</p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                }

                {/* Sublet availability */}
                {pageIndex == 7 &&
                    <div className="flex flex-1 justify-center">
                        <div className="flex flex-col w-full py-5 px-5 space-y-6 md:w-fit md:space-y-12">
                            <p className="text-2xl font-medium">When is the availability of your place?</p>
                            <div className="w-full justify-center items-center flex">
                            <DateRange
                            
                            minDate={new Date()}
                            rangeColors={['#000000']}
                            ranges={[listingDateRange]}
                            calendarFocus="backwards"
                            onChange={(e)=> 
                                setListingDateRange({
                                    startDate: e.selection.startDate,
                                    endDate: e.selection.endDate,
                                    key: e.selection.key
                                })
                            }
                            />
                            </div>
                        </div>
                    </div>
                }

                {/* What genders can enquire */}
                {pageIndex == 8 &&
                    <div className="flex flex-1 justify-center">
                        <div className="flex flex-col w-full py-5 px-5 space-y-6 md:w-fit">
                            <div>
                                <p className="text-2xl font-medium">Who can inquire about your sublet?</p>
                                <p className='text-slate-700'>Select <span className="font-semibold">all</span> that applies</p>
                            </div>
                            <div className="flex flex-row gap-4 overflow-auto flex-wrap">
                                <div onClick={()=> handleInquireGenderClick("Male")} className={`px-4 py-4 rounded-md items-center border-2 ${ listinInquireGender.includes("Male") ? "border-black" : "border-gray-300"} flex flex-row space-x-3 text-gray-700 ${listinInquireGender.includes("Male") ? "bg-gray-100" : "bg-white"} cursor-pointer`}>
                                    <MaleIcon className=""/>
                                    <p>Male</p>
                                </div>
                                <div onClick={()=> handleInquireGenderClick("Female")} className={`px-4 py-4 rounded-md items-center border-2 ${ listinInquireGender.includes("Female") ? "border-black" : "border-gray-300"} flex flex-row space-x-3 text-gray-700 ${ listinInquireGender.includes("Female") ? "bg-gray-100" : "bg-white"} cursor-pointer`}>
                                    <MaleIcon className=""/>
                                    <p>Female</p>
                                </div>
                                <div onClick={()=> handleInquireGenderClick("Others")} className={`px-4 py-4 rounded-md items-center border-2 ${listinInquireGender.includes("Others") ? "border-black" : "border-gray-300"} flex flex-row space-x-3 text-gray-700 ${listinInquireGender.includes("Others") ? "bg-gray-100" : "bg-white"} cursor-pointer`}>
                                    <div>   
                                        <MaleIcon className=""/>
                                        <FemaleIcon className=""/>
                                    </div>
                                    <p>Others</p>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {/* Price of sublet */}
                {pageIndex == 9 &&
                <div className="flex flex-1 justify-center h-full overflow-y-scroll">
                    <div className="flex flex-col w-full py-5 px-5 space-y-6 md:w-2/5">
                        <div>
                            <p className="text-2xl font-medium">Set the price of your rent</p>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <input type="tel" value={listingRent} onChange={(val) => setListingRent(handleIntegerInput(val.target.value, listingRent))} className="border border-gray-300 rounded-md block w-full px-3 py-4 ring-0 focus:border-black focus:ring-0" placeholder='Price / month'/>
                            {listingRent.trim() != "" &&
                            <div className="flex flex-row justify-between items-center ">
                                <p className='text-slate-600 text-sm'>Guest price before tax ${listingRent} per month</p>
                                <div className="flex flex-row items-center cursor-pointer" onClick={()=> setListingRentShowMore(!listingRentShowMore)}>
                                    <p className='text-slate-600 text-sm font-semibold'>{listingRentShowMore ? "Show less" : "Show more"}</p>
                                    {listingRentShowMore ?
                                        <KeyboardArrowUpIcon className="text-md font-semibold"/>
                                        :
                                        <KeyboardArrowDownIcon className="text-md font-semibold"/>
                                    }
                                </div>
                            </div>
                            }
                            { listingRentShowMore &&
                            <div className="flex flex-col space-y-4">
                                <div className="flex flex-col rounded-md border border-gray-600 px-5">
                                    <div className="flex flex-row justify-between items-center border-b border-gray-200 py-5">
                                        <p className='text-gray-700 text-sm'>Monthly rent set by you</p>
                                        <p className='text-gray-700 text-sm'>${listingRent}</p>
                                    </div>
                                    <div className="flex flex-row justify-between items-center border-b border-gray-200 py-5">
                                        <p className='text-gray-700 text-sm'>nextstay service fee (10%)</p>
                                        <p className='text-gray-700 text-sm'>${(listingRent*0.1).toFixed(2)}</p>
                                    </div>
                                    <div className="flex flex-row justify-between items-center py-5">
                                        <p className='text-gray-700 text-sm'>Price guest sees</p>
                                        <p className='text-gray-700 text-sm'>${(parseFloat(parseFloat(listingRent) + parseFloat(listingRent*0.1)).toFixed(2))}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col rounded-md border border-gray-600 px-5">
                                    <div className="flex flex-row justify-between items-center border-b border-gray-200 py-5">
                                        <p className='text-gray-700 text-sm font-medium'>You make </p>
                                        <p className='text-gray-700 text-sm font-medium'>${listingRent} / month</p>
                                    </div>
                                </div>
                            </div>
                            }
                            {

                            }
                        </div>
                        
                        <div className="flex flex-col rounded-md border border-gray-600 px-5 py-5 space-y-1 mt-4">
                            <div className="flex flex-row justify-between items-center">
                                <p className='black text-sm font-medium'>Security deposit (50% of rent)</p>
                                <p className='black text-sm font-medium'>${listingRent/2} / month</p>
                            </div>
                            <p className='text-slate-600 text-xs'>Paid by guest, held by nextstay until end of sublease</p>
                        </div>
                        <div className="w-full h-[10vh] md:h-[0]" />
                    </div> 
                    
                </div>
                }

                {/* Utilities and electricity */}
                {pageIndex == 10 &&
                    <div className="flex flex-1 justify-center">
                        <div className="flex flex-col w-full py-5 px-5 space-y-6 md:w-2/5">
                            <div>
                                <p className="text-2xl font-medium">Which utilities are included in the monthly rent?</p>
                            </div>
                            <div className="flex flex-row gap-4 overflow-auto flex-wrap">
                                {UTILITIES.map((item) => {
                                    return(
                                        <div key={"utilitiesIncluded" + item.name} onClick={()=> handlePaidUtilitiesClick(item.name)} className={`px-4 py-4 rounded-md items-center border-2 ${ listingPaidUtilities.includes(item.name) ? "border-black" : "border-gray-300"} flex flex-row space-x-3 text-gray-700 ${listingPaidUtilities.includes(item.name) ? "bg-gray-100" : "bg-white"} cursor-pointer`}>
                                            {item.icon}
                                            <p>{item.name}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                }

                {/* Cost of Wifi */}
                {pageIndex == 11 &&
                    <div className="flex flex-1 justify-center">
                        <div className="flex flex-col w-full py-5 px-5 space-y-6 md:w-2/5">
                            <p className="text-2xl font-medium">Cost of WiFi per month?</p>
                            <input type="tel" value={listingWifi.price} onChange={(val) => setListingWifi({available: true, price: handleIntegerInput(val.target.value, listingWifi.price)})} className="border border-gray-300 rounded-md block w-full px-3 py-4 ring-0 focus:border-black focus:ring-0" placeholder='$Price / month'/>
                        </div>
                    </div>
                }

                {/* Cost of Electricity */}
                {pageIndex == 12 &&
                    <div className="flex flex-1 justify-center">
                        <div className="flex flex-col w-full py-5 px-5 space-y-6 md:w-2/5">
                            <div className="space-y-2">
                                <p className="text-2xl font-medium">Average electricity cost per month</p>
                                <p className='text-slate-600'>If unknown, please use last month's utility bill as reference</p>
                            </div>
                            <input type="tel" value={listingElectricity} onChange={(val) => setListingElectricity(handleIntegerInput(val.target.value, listingElectricity))} className="border border-gray-300 rounded-md block w-full px-3 py-4 ring-0 focus:border-black focus:ring-0" placeholder='$Price / month'/>
                        </div>
                    </div>
                }

                {/* Amenities */}
                {pageIndex == 13 &&
                    <div className="flex flex-1 justify-center pb-[10vh]">
                        <div className="flex flex-col w-full py-5 px-5 space-y-6 md:w-2/5">
                            <div>
                                <p className="text-2xl font-medium">Which amenities are included in the monthly rent?</p>
                            </div>
                            <div className="flex flex-row gap-4 overflow-auto flex-wrap">
                                {/* {PAIDAMENITIES.map((item) => {
                                    return(
                                        <div key={"amenities" + item.name} onClick={()=> handlePaidAmenitiesClick(item.name)} className={`px-4 py-4 rounded-md items-center border-2 ${ listingPaidAmenities.includes(item.name) ? "border-black" : "border-gray-300"} flex flex-row space-x-3 text-gray-700 ${listingPaidAmenities.includes(item.name) ? "bg-gray-100" : "bg-white"} cursor-pointer`}>
                                            {item.icon}
                                            <p>{item.name}</p>
                                        </div>
                                    )
                                })} */}
                                {
                                    POSTINGAMENITIES.map((item) => {
                                        return(
                                            <div className="py-3 w-full space-y-3">
                                                <p className="font-medium text-md">{item.category}</p>
                                                <div className="flex flex-row gap-4 overflow-auto flex-wrap">
                                                    {item.items.map((item)=>{
                                                        return (
                                                            <div key={"amenities" + item.name} onClick={()=> handlePaidAmenitiesClick(item.name)} className={`px-4 py-4 rounded-md items-center border-2 ${ listingPaidAmenities.includes(item.name) ? "border-black" : "border-gray-300"} flex flex-row space-x-3 text-gray-700 ${listingPaidAmenities.includes(item.name) ? "bg-gray-100" : "bg-white"} cursor-pointer w-fit`}>
                                                                {item.icon}
                                                                <p>{item.name}</p>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                }

                {/* Sublet images */}
                {pageIndex == 14 &&
                    <div className="flex flex-1 justify-center md:pb-32">
                        <div className="flex flex-col w-full py-5 px-5 space-y-6 md:w-2/5">
                            <div className="space-y-1">
                                <p className="text-2xl font-medium">Add some pictures of your place</p>
                                <p className='text-slate-600'>Please add at least 5 images of your sublet, you can upload at most 10 images.</p>
                            </div>
                            { listingImages.length == 0 ?
                            <div className="flex flex-col">
                                <div onClick={()=> handleImageSelectClick()} className="w-full rounded-md border border-gray-200 py-12 justify-center items-center flex space-y-4 flex-col cursor-pointer">
                                    <AddPhotoAlternateIcon className="text-4xl text-gray-600"/>
                                    <p className='text-gray-700 font-medium'>Add at least 5 images</p>
                                    <p className='text-gray-400 text-sm underline'>Click to upload images</p>
                                </div>
                            </div>
                            :
                            <div className="w-full flex flex-col overflow-auto flex-wrap gap-6">
                                {
                                    listingImages.map((item, index) => {
                                        return (
                                            <div key={"image" + index} className={`relative w-full h-72 rounded-md`}>
                                                {item != null ?
                                                <>
                                                    <img src={item.imageURL} className={`w-full h-full object-cover rounded-md border border-gray-300`}/>
                                                    <div className="absolute top-4 right-4 cursor-pointer">
                                                        <ListingImageOptions onPrimaryClick={()=> handleImageOptionsPrimaryClick(index)} onReplaceClick={()=> handleImageOptionsReplaceClick(index)} onDeleteClick={()=>handleImageOptionsDeleteClick(index)}/>
                                                    </div>
                                                    {index == 0 &&
                                                        <div className="absolute top-4 left-4">
                                                            <div className="bg-white rounded-md px-3 py-2">
                                                                <p className="text-sm font-medium">Primary</p>
                                                            </div>
                                                        </div>
                                                    }
                                                </>
                                                :
                                                <div onClick={()=> handleImageOptionsReplaceClick(index)} className="flex flex-col w-full h-72 justify-center items-center rounded-md border border-gray-300 space-y-2">
                                                    <AddPhotoAlternateIcon className="text-4xl text-gray-600"/>
                                                    {/* <p className='text-gray-700 font-medium'>Click to add image</p> */}
                                                    <p className='text-gray-400 text-sm underline'>Click to add image</p>
                                                </div>
                                                }
                                            </div>
                                        )
                                    })
                                }
                                { listingImages.length < 10 &&
                                <div className={`w-full h-52 rounded-md flex justify-center items-center border border-gray-200 flex-col space-y-4 cursor-pointer`} onClick={()=> handleImageSelectClick()}>
                                    <AddPhotoAlternateIcon className="text-4xl text-gray-600"/>
                                    <p className='text-gray-700 font-medium'>{listingImages.length}/10 images added</p>
                                    <p className='text-gray-400 text-sm underline'>Click to add more</p>
                                </div>
                                }
                            </div>
                            }
                            <div className="w-full h-[10vh] md:h-[0]" />
                        </div>
                        
                    </div>
                }

                {/* Sublet floorplan */}
                {pageIndex == 15 &&
                    <div className="flex flex-1 justify-center">
                        <div className="flex flex-col w-full py-5 px-5 space-y-6 md:w-2/5">
                            <div className="space-y-1">
                                <p className="text-2xl font-medium">Add an image of the floorplan (Optional)</p>
                                <p className='text-gray-700'>This gives interested guests a better understanding of your place.</p>
                            </div>
                            { listingFloorplan == null ?
                            <div className="flex flex-col">
                                <div onClick={()=> handleFloorplanImageClick()} className="w-full rounded-md border border-gray-200 py-12 justify-center items-center flex space-y-4 flex-col cursor-pointer">
                                    <AddPhotoAlternateIcon className="text-4xl text-gray-600"/>
                                    <p className='text-gray-700 font-medium'>Add an image of floorplan</p>
                                    <p className='text-gray-400 text-sm underline'>Click to upload images</p>
                                </div>
                            </div>
                            :
                            <div className="w-full flex flex-col overflow-auto flex-wrap gap-6">
                            
                                <div className={`relative w-full h-72 rounded-md`}>
                                
                                    <img src={listingFloorplan.imageURL} className={`w-full h-full object-cover rounded-md border border-gray-300`}/>
                                    <div className="absolute top-4 right-4 cursor-pointer">
                                        <ListingImageOptions onPrimaryClick={null} onReplaceClick={()=> handleFloorplanOptionClick("replace")} onDeleteClick={()=>handleFloorplanOptionClick("delete")}/>
                                    </div>
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                }

                {/* Sublet description */}
                {pageIndex == 16 &&
                <div className="flex flex-1 justify-center">
                    <div className="flex flex-col w-full py-5 px-5 space-y-6 md:w-2/5">
                        <div className="space-y-2">
                            <p className="text-2xl font-medium">Add a description to your sublet</p>
                            <p className='text-slate-600'>Please mention anything you want the guest to know and even a bit about the place :)</p>
                        </div>
                        <textarea type="text" value={listingDescription} onChange={(val) => setListingDescription(val.target.value)} className="border border-gray-300 rounded-md block w-full px-3 py-4 ring-0 focus:border-black focus:ring-0 h-[25vh]" placeholder='Description'/>
                    </div>
                </div>
                }
                {/* Review */}
                {pageIndex == 17 &&
                    <div className="space-y-6 md:space-y-0 flex flex-col w-full py-5 px-5 md:px-[10%] md:flex-row h-full overflow-y-scroll">
                        
                        {/* Preview Card */}
                        <div className="w-full md:w-1/2 flex flex-col space-y-6 justify-center">
                            <div className="space-y-1 flex flex-col">
                                <p className="text-2xl font-medium">Yay! It’s time to publish</p>
                                <p className='text-slate-600'>Please review  your sublet details and make sure everything is correct.</p>
                            </div>
                            <div onMouseEnter={()=>setNavButtons(true)} onMouseLeave={()=>setNavButtons(false)} className="w-full md:w-3/5 shadow-md rounded-lg cursor-pointer">
                                <div className="relative w-full">
                                    <div className="relative overflow-hidden rounded-tl-lg rounded-tr-lg h-72 z-1 w-full">
                                        { listingImages.map((item, index) => {
                                            return (
                                                <div key={"reviewListingImages" + index} className={`${index == listingImageIndex ? "block" :'hidden'} duration-700 ease-in-out bg-red-200 h-72`}>
                                                    <img key={item.url} src={item.imageURL} alt="Sublet image" className="absolute w-full h-72 flex -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 object-cover"/>
                                                </div>
                                            )   
                                        })
                                        }
                                    </div>
                                    {/* The index dots */}
                                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2  flex flex-row space-x-2">
                                        { listingImages.map((item, index) => {
                                            return (
                                                <div key={"listingImageDots" + index} className={`h-2 w-2 rounded-full ${listingImageIndex == index ? "bg-white" : "bg-gray-400"}`}/>
                                            )
                                        })
                                        }
                                    </div>
                                    
                                    {/* Nav symbol */}
                                    <div className={`transition-opacity ${navButtons ? "opacity-100" : "opacity-0"} absolute left-2 top-1/2 transform -translate-y-1/2 shadow-md`}>
                                        <div onClick={(e)=> handleImageScroll("-", e)} className='h-8 w-8 rounded-full bg-white hover:flex items-center justify-center flex cursor-pointer z-50'>
                                            <ChevronLeftIcon className='text-black text-md text-gray-600'/>
                                        </div>
                                    </div>
                                    <div className={`transition-opacity ${navButtons ? "opacity-100" : "opacity-0"} absolute right-2 top-1/2 transform -translate-y-1/2 shadow-md`}>
                                        <div onClick={(e)=> handleImageScroll("+", e)} className='h-8 w-8 rounded-full bg-white hover:flex items-center justify-center flex cursor-pointer z-50'>
                                            <ChevronRightIcon className='text-black text-md text-gray-600'/>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row items-center py-3 px-4 justify-left space-x-4">
                                    <div className="flex flex-col align-left space-y-2 ">
                                        <div className='space-y-1'>
                                            <p className="font-medium text-black leading-tight text-sm font-medium md:text-regular line-clamp-1"> {listingType} at {listingLocationItem.secondary_text}</p>
                                            <p className="font-medium text-gray-500 leading-tight text-sm font-medium md:text-xs line-clamp-1">{new Date(listingDateRange.startDate).toLocaleDateString('en-us',{month:'short', day:'numeric'})} - {new Date(listingDateRange.endDate).toLocaleDateString('en-us',{month:'short', day:'numeric'})}</p>
                                        </div>
                                        <p className="text-sm text-black leading-tight md:text-xs line-clamp-1">${listingRent} /month</p>                
                                    </div>
                                    
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="w-full flex flex-col md:w-1/2 md:pl-[5%]">

                            {/* Location and type */}
                            <div className="pb-6 w-full border-b border-gray-200 space-y-3">
                                <div>
                                    <p className='text-2xl'>{listingType} at {listingLocationItem.secondary_text}</p>
                                    <p className='text-md text-slate-500'>{listingNumberOfBedrooms} bed {listingNumberOfBathrooms} bath</p>
                                </div>
                                <p className='text-slate-500'>{listingDescription}</p>
                            </div>

                            {/* Overview */}
                            <div className="py-6 w-full border-b border-gray-200 space-y-3">
                                <p className='text-md text-balck font-medium'>Overview</p>
                                <div>
                                    <div className='flex flex-row space-x-4 items-center md:space-x-4 py-3'>
                                        <WeekendIcon className='text-2xl'/>
                                        <div className='flex flex-col space-y-1'>
                                            <p className=''>{getFurnishedStatus()}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-row space-x-4 items-center md:space-x-4 py-3'>
                                        <BoltIcon className='text-2xl'/>
                                        <div className='flex flex-col space-y-1'>
                                            <p className=''>{listingElectricity.trim() == "" ? "Electricity included" : "Electricity not included"}</p>
                                            {!listingElectricity.trim() == "" &&
                                                <p className='text-slate-500 text-sm'>${listingElectricity.trim()} monthly</p>
                                            }
                                        </div>
                                    </div>
                                    <div className='flex flex-row space-x-4 items-center md:space-x-4 py-3'>
                                        <WifiIcon className='text-2x'/>
                                        <div className='flex flex-col space-y-1'>
                                            <p className=''>{listingPaidUtilities.includes("WiFi") ? "Wifi included" : "Wifi not included"}</p>
                                            {!listingPaidUtilities.includes("WiFi") &&
                                                <p className='text-sm text-slate-500'>Fixed ${listingWifi.price.trim()} monthly</p>
                                            }
                                        </div>
                                    </div>
                                    <div className='flex flex-row space-x-4 items-center md:space-x-4 py-3'>
                                        <LocalLaundryServiceIcon className='md:text-2xl text-2xl'/>
                                        <div className='flex flex-col space-y-1'>
                                            <p className=''>{listingPaidAmenities.includes("Washer & Dryer (In-Unit)") ? "In-unit Washer & Dryer" : listingPaidAmenities.includes("Washer & Dryer (In-building)") ? "Washer & Dryer (In-building)" : "Washer & Dryer not available"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Roommates */}
                            {listingRoommateDetails.length != 0 && listingRoommateDetails[0].gender != null &&
                            <div className="py-6 w-full border-b border-gray-200 space-y-3">
                                <p className='text-md text-balck font-medium'>Roommate information</p>
                                {listingRoommateDetails.map((item, index) => {
                                    return(
                                        <div key={"reviewListingRoommatesDetails" + index} className='flex flex-row space-x-4 items-center md:space-x-8 py-3'>
                                            <PeopleIcon className='text-2xl'/>
                                            <div className='flex flex-col space-y-1'>
                                                <p className=''>Roommate {index+1}</p>
                                                <p className='text-slate-500 text-sm md:text-base'>{item.gender} • {item.gender} • {item.occupation}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                                
                            </div>
                            }

                            {/* Amenities */}
                            <div className="py-6 w-full space-y-3">
                                <p className='text-md text-balck font-medium'>Amenities</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 w-full wrap">
                                    {listingPaidAmenities.map((item) => {
                                        return (
                                            <div key={"listingAmenities" + item} className="w-full py-3 flex flex-row space-x-4 ">
                                                {getAmenitiesIcon(item)}
                                                <p className='text-black'>{item}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="w-full h-[10vh] md:h-[0]" />
                        </div>                
                    </div>
                }
            </div>

            <input type="file" ref={floorplanInput} name="files" className="hidden" onChange={(e) => handleFloorplanInputChange(e)}/>
            <input type="file" ref={filesInputEdit} name="files" className="hidden" onChange={(e) => handleImageReplace(e)}/>
            <input type="file" ref={filesInput} name="files" multiple className="hidden" onChange={(e) => handleImageInputClick(e)}/>
            <PostingSuccessfullModal postingSuccessModal={postingSuccessModal} handleClose={()=> setPostingSuccessModal(false)}/>
            <div className="fixed bottom-0 items-center flex w-full bg-white h-[11vh] md:h-[11vh]">
                <div>
                    <div className="absolute top-0 w-full h-1 bg-gray-200"/>
                    <div className={`absolute top-0 ${pageIndex == 0 ? 'w-0' : pageIndex == 1 ? 'w-[6.7%]' : pageIndex == 2 ? 'w-[13.4%]': pageIndex == 3 ? 'w-[20%]' : pageIndex == 4 ? 'w-[26.7%]' : pageIndex == 5 ? 'w-[33.5%]' : pageIndex == 6 ? 'w-[40%]' : pageIndex == 7 ? 'w-[46.7%]' : pageIndex == 8 ? 'w-[53.6%]' : pageIndex == 9 ? 'w-[60.3%]' : pageIndex == 10 ? 'w-[67%]' : pageIndex == 11 ? 'w-[73.7%]' : pageIndex == 12 ? 'w-[80.4%]' : pageIndex == 13 ? 'w-[87.1%]' : pageIndex == 14 ? 'w-[93.8%]' : 'w-full'} h-1 bg-black transition-w ease-out duration-300`}/>
                </div>
                <div className="px-5 flex w-full md:px-[10%] md:justify-end">
                {pageIndex == 0 ?
                    <div onClick={handleIndexNavigationForwardClick} className={`py-3 border rounded-md ${loading ? 'bg-gray-400' : 'bg-gradient-to-r from-[#2390FF] to-[#174AFE]'} w-full justify-center items-center flex h-12 cursor-pointer md:w-28`}>
                        {loading ? 
                        <LoadingDots/>
                        :
                        <p className="font-medium text-white">Get started</p>
                        }
                    </div>
                    :
                    <div className={`flex flex-row justify-between w-full items-center `}>
                        <p onClick={handleIndexNavigationBackwardClick} className="font-medium text-gray-600 underline cursor-pointer">Back</p>
                        <div onClick={handleIndexNavigationForwardClick} className={`py-3 border rounded-md ${loading ? 'bg-gray-400' : 'bg-gradient-to-r from-[#2390FF] to-[#174AFE]'} justify-center items-center flex px-4 h-12 w-28 cursor-pointer`}>
                            {loading ? 
                                <LoadingDots />
                            :
                            pageIndex == 17 ?
                                <p className={`font-medium text-white`}>Post</p>
                            :
                                <p className={`font-medium text-white`}>Continue</p>
                            }
                        </div>
                    </div>
                }
                </div>
            </div>

        </div>
    )
}