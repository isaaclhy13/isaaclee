"use client"
import LoadingDots from "@/components/loadingDots";
import Select from 'react-select'

import { useContext, useEffect, useRef, useState } from "react";

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

//Const
import { AGES, DAYS, MONTHS, YEARS } from "@/constants/sharedUtils";

//Icons
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SmsIcon from '@mui/icons-material/Sms';
import { UserContext } from "@/UserContext";
import { useRouter } from "next/navigation";

export default function Signup(){
    const router = useRouter()
    const {user, setUser} = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const [pageIndex, setPageIndex] = useState(0)

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [age, setAge] = useState(null)
    const [birthday, setBirthday] = useState({day:null, month:null, year:null})
    const [gender, setGender] = useState(null)
    const [profilePic, setProfilePic] = useState(null)
    const profilePicInputRef = useRef(null)
    const [insta, setInsta] = useState("")
    const [linkedin, setLinkedin] = useState("")
    const [wechat, setWechat] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [countryCode, setCountryCode] = useState("")
    const [OTPCode, setOTPCode] = useState("")

    function NavigatePageForward(){
        if(loading){
            return
        }
        if(pageIndex == 0 && !verifyNames()){ return }
        else if(pageIndex == 1 && !verifyAge()) { return }
        else if(pageIndex == 2 && !verifyGender()){ return }
        else if(pageIndex == 3 && !verifyProfilePic()){ return }
        else if(pageIndex == 4 && !verifySocialHandle()){ return }
        else if(pageIndex == 5 && !verifyPhoneNumber()){ return}
        else if(pageIndex == 6){
            handleSignUp()
        }
        
        else{
            setLoading(true)
            setPageIndex(pageIndex+1)
            setLoading(false)
        }  
    }

    function NavigatePageBackward(){
        if(pageIndex == 0){
            return
        }
        setPageIndex(pageIndex-1)
    }

    function handleSignUp(){
        //API Call to sign up
        if(loading){
            return
        }
        if(OTPCode.length != 6){
            alert("Please enter a 6 digit OTP code.")
            return false
        }
        else{
            setLoading(true)
            console.log(phoneNumber)
            console.log(OTPCode)
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
            "phone_number": `+${phoneNumber}`,
            "code": OTPCode
            });

            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };

            fetch("https://nextstay-09a1b7efd58f.herokuapp.com/auth/sms/verifyotp", requestOptions)
            .then(async res => {
                if(res.status == 200){
                    const data = await res.json()
                    localStorage.setItem("uid",data._id)
                    signUp(data._id)
                }
                else{
                    alert("Error")
                }
            })
        }
    }

    function handleDateSelect(op, value){
        if(op == "day"){
            setBirthday({day: value, month: birthday.month, year: birthday.year})
        } else if (op == "month"){
            setBirthday({day: birthday.day, month: value, year: birthday.year})
        } else {
            setBirthday({day: birthday.day, month: birthday.month, year: value})
        }
    }

    function handleProfilePicClick(){
        profilePicInputRef.current.click()
    }

    function handleProfilePicImageChange(e){
        setProfilePic({"file": e.target.files[0], "imageURL": URL.createObjectURL(e.target.files[0])})
    }

    function verifyNames(){
        if(firstName.trim() == ""){
            alert("Please enter a valid first name.")
            return false
        }
        if(lastName.trim() == ""){
            alert("Please enter a valid last name.")
            return false
        }
        return true
    }

    function verifyAge(){
        if(birthday.day == null || birthday.month == null || birthday.year == null){
            alert("Please enter your birthday.")
            return false 
        }
        return true
    }

    function verifyGender(){
        if(gender == null){
            alert("Please select a gender.")
            return false
        }
        return true
    }

    function verifyProfilePic(){
        if(profilePic == null){
            alert("Please upload a profile picture.")
            return false
        }
        return true 
    }

    function verifySocialHandle(){
        if(insta.trim() == "" && linkedin.trim() == "" && wechat.trim() == ""){
            alert("Please enter at least 1 social handle.")
            return false
        }
        return true
    }

    function verifyPhoneNumber(){
        if(phoneNumber.trim() == ""){
            alert("Please enter a phone number")
            return false
        } 
        else{
            console.log(phoneNumber)
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "phone_number": `+${phoneNumber}`
            });

            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };

            fetch("https://nextstay-09a1b7efd58f.herokuapp.com/auth/sms/otp", requestOptions)
            .then((res) =>{
                if(res.status == 200){
                }
            })

            return true
        }
        
    }

    function signUp(uid){
        let at = localStorage.getItem("at")
        
        if(at == null) {
            alert("Please try again later.")
            router.refresh()
            return
        }
        //Organize social media
        let socialMediaArr = JSON.stringify({"instagram": insta, "linkedin": linkedin, "wechat": wechat})

        //Organize dob
        let birthdayString = String(birthday.year) + "-"
        birthdayString += String(birthday.month.value) + "-"
        birthdayString += String(birthday.day)

        let formdata = new FormData();
        formdata.append("email", email);
        formdata.append("firstName", firstName);
        formdata.append("lastName", lastName);
        formdata.append("dob", birthdayString);
        formdata.append("social_handles", socialMediaArr);
        formdata.append("gender", gender);
        formdata.append("auth0_user_id", uid);
        formdata.append("image", profilePic.file, "image 2.png");
        formdata.append("phone_number", phoneNumber);


        fetch('https://nextstay-09a1b7efd58f.herokuapp.com/user/profile', {
            method: 'POST',
            headers: {
                'Authorization': "Bearer " + at
            },
            body: formdata
        })
        .then(async res => {
            console.log("Resss", res)
            if(res.status == 200){

                let data = await res.json()
                localStorage.setItem("uid", data.data._id)
                setUser(user)
                //Save some data in localStorage like name id photo etc
                router.replace("/")
            }
            else{
                setLoading(false)
                alert("Something went wrong. Please try again later!")
            }
        })
        .catch(e => {
            setLoading(false)
            alert("Something went wrong. Please try again later!")
            router.refresh()
        })

        
    }

    return(
        <div className="flex flex-col relative">

            <div className='top-0 py-4 flex flex-row border-b border-gray-200 justify-center items-center w-full bg-white'>
                <p className='font-semibold text-sm'>Sign up</p>
            </div>

            {pageIndex == 0 && 
            <div className="px-5 py-10 space-y-4">
                <p className="text-2xl font-medium text-black">Tell us a bit about you</p>
                <input value={firstName} onChange={(val) => setFirstName(val.target.value)} type="text" className="border border-gray-300 rounded-md block w-full px-3 py-4 " placeholder='First name'/>
                <input value={lastName} onChange={(val) => setLastName(val.target.value)} type="text" className="border border-gray-300 rounded-md block w-full px-3 py-4 " placeholder='Last name'/>
            </div>
            }

            {pageIndex == 1 && 
            <div className="px-5 py-10 space-y-4">
                <p className="text-2xl font-medium text-black">How old are you?</p>
                <div className='flex flex-row w-full justify-between'>
                    <div className='flex-row w-4/12'>
                        <Select value={birthday.month == null ? null : {label: birthday.month.label, value: birthday.month.value}} menuPlacement="auto" menuPosition="fixed" inputProps={{readOnly:true}} isSearchable={ false } onChange={(val)=>handleDateSelect("month", val)} placeholder="Month" styles={{ control: base => ({ ...base,  cursor:'pointer', borderColor: "#D9D9D9", borderRadius:'0.375rem', outline:'none', boxShadow: 'none', paddingTop: '0.5rem', paddingBottom: '0.5rem', flex: 1, fontSize: '1rem', '&:hover': { borderStyle:'solid', borderColor:'black'}})}} options={MONTHS}/>                      
                    </div>
                    <div className='flex-row w-3/12'>
                        <Select value={birthday.day == null ? null : {label: birthday.day, value: birthday.day}} menuPlacement="auto" menuPosition="fixed" inputProps={{readOnly:true}} isSearchable={ false } onChange={(val)=>handleDateSelect("day", val.value )} placeholder="Day" styles={{ control: base => ({ ...base,  cursor:'pointer',borderColor: "#D9D9D9", borderRadius:'0.375rem', outline:'none', boxShadow: 'none', paddingTop: '0.5rem', paddingBottom: '0.5rem', fontSize: '1rem','&:hover': { borderStyle:'solid', borderColor:'black'} })}} options={DAYS}/>                      
                    </div>
                    <div className='flex-row w-4/12'>
                        <Select value={birthday.year == null ? null : {label: birthday.year, value: birthday.year}} menuPlacement="auto" menuPosition="fixed" inputProps={{readOnly:true}} isSearchable={ false }  placeholder="Year" onChange={(val)=>handleDateSelect("year", val.value )} styles={{ control: base => ({ ...base,  cursor:'pointer',borderColor: "#D9D9D9", borderRadius:'0.375rem', outline:'none', boxShadow: 'none', paddingTop: '0.5rem', paddingBottom: '0.5rem', flex: 1, fontSize: '1rem', '&:hover': { borderStyle:'solid', borderColor:'black'}})}} options={YEARS}/>                      
                    </div>
                </div>
            </div>
            }

            {pageIndex == 2 && 
            <div className="px-5 py-10 space-y-4">
                <p className="text-2xl font-medium text-black">What is your gender?</p>
                <div className="flex flex-row gap-4 overflow-auto flex-wrap">
                    <div onClick={()=> setGender("Male")} className={`px-4 py-4 rounded-md items-center border ${ gender == "Male" ? "border-black" : "border-gray-300"} flex flex-row space-x-3 text-gray-700 ${gender == "Male" ? "bg-gray-100" : "bg-white"}`}>
                        <MaleIcon className=""/>
                        <p>Male</p>
                    </div>
                    <div onClick={()=> setGender("Female")} className={`px-4 py-4 rounded-md items-center border ${ gender == "Female" ? "border-black" : "border-gray-300"} flex flex-row space-x-3 text-gray-700 ${ gender == "Female" ? "bg-gray-100" : "bg-white"}`}>
                        <FemaleIcon className=""/>
                        <p>Female</p>
                    </div>
                    <div onClick={()=> setGender("Others")} className={`px-4 py-4 rounded-md items-center border ${gender == "Others" ? "border-black" : "border-gray-300"} flex flex-row space-x-3 text-gray-700 ${gender == "Others" ? "bg-gray-100" : "bg-white"} wrap-auto`}>
                        <div>   
                            <MaleIcon className=""/>
                            <FemaleIcon className=""/>
                        </div>
                        <p>Others</p>
                    </div>
                </div>
            </div>
            }

            {pageIndex == 3 && 
            <div className="px-5 py-10 space-y-4">
                <div>
                    <p className="text-2xl font-medium text-black">Set your profile picture</p>
                </div>
                <div className= "border border-gray-300 rounded-md block w-full px-4 py-4 flex flex-row items-center ">
                    <div className="flex flex-col space-y-1">
                        <p className='text-gray-700 text-sm font-semibold'>Example:</p>
                        <p className='text-gray-700 text-sm w-4/6 '>Please make sure your face is visible in the image.</p>
                    </div>
                    <div className="h-14 w-16 rounded-full items-center ">
                        <img src="https://www.gsd.harvard.edu/wp-content/uploads/2023/05/Yoolim-Jenn-Kim-300x300.jpg" className="rounded-full object-cover" />
                    </div>
                </div>
                <div className="flex flex-col w-full justify-center items-center py-5 justify-center space-y-6" >
                    <div onClick={handleProfilePicClick} className="w-52 h-52 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                        {profilePic != null ?
                        <img src={profilePic != null ? profilePic.imageURL : null} className="h-52 w-52 rounded-full object-cover" />
                        :
                        <div className="space-y-2 flex justify-center flex-col items-center">
                            <AddPhotoAlternateIcon className="texrt-gray-500 text-3xl"/>
                            <p className='text-gray-700 text-sm font-semibold'>Add image</p>
                        </div>
                        }
                    </div>
                    {profilePic != null &&
                        <p onClick={handleProfilePicClick} className='text-gray-700 text-sm underline'>Replace Image</p>
                    }

                </div>
                <input type="file" ref={profilePicInputRef} name="files" className="hidden" onChange={(e) => handleProfilePicImageChange(e)}/>

            </div>
            }

            {pageIndex == 4 && 
            <div className="px-5 py-10 space-y-6">
                <div className="space-y-1">
                    <p className="text-2xl font-medium text-black">Verify your social handle</p>
                    <p className='text-gray-600'>This will not be shown to others, it is for us to verify your social media. (Must select at least 1)</p>
                </div>
                <div className="space-y-4">
                    <div type="text" className="border border-gray-300 rounded-md block w-full px-3 py-4 flex flex-row items-center" >
                        <InstagramIcon/>
                        <input value={insta} onChange={(val) => setInsta(val.target.value)} placeholder="Instagram handle" className="flex pl-2 w-full border-none outline-none" />
                    </div>
                    <div type="text" className="border border-gray-300 rounded-md block w-full px-3 py-4 flex flex-row items-center" >
                        <LinkedInIcon/>
                        <input value={linkedin} onChange={(val) => setInsta(val.target.value)} placeholder="LinkedIn handle" className="flex pl-2 w-full border-none outline-none" />
                    </div>
                    <div type="text" onChange={(val) => setLinkedin(val.target.value)} className="border border-gray-300 rounded-md block w-full px-3 py-4 flex flex-row items-center" >
                        <SmsIcon/>
                        <input value={wechat} onChange={(val) => setWechat(val.target.value)} placeholder="weChat handle" className="flex pl-2 w-full border-none outline-none" />
                    </div>
                </div>
            </div>
            }

            {pageIndex == 5 && 
            <div className="px-5 py-10 space-y-6">
                <div className="space-y-1">
                    <p className="text-2xl font-medium text-black">Enter your phone number</p>
                    <p className='text-gray-600'>This will not be shown to others and will be only used to your subleasing process in the future.</p>
                </div>
                <div className='flex-row flex w-full space-y-3 text-slate-600'>
                    <PhoneInput
                    inputStyle={{height:50, fontSize:'1rem', '&:focus': { borderStyle:'solid', borderColor:'black'}}}
                    containerStyle={{height:50, backgroundColor:'white', flex:1,  '&:focus': { borderStyle:'solid', borderColor:'black'}}}
                    country={'us'}
                    value={phoneNumber}
                    onChange={(phone, countryCode) => {
                        setCountryCode(countryCode.dialCode)
                        setPhoneNumber(phone)
                    }}
                    />
                </div>

            </div>
            }

            {pageIndex == 6 && 
            <div className="px-5 py-10 space-y-6">
                <div className="space-y-1">
                    <p className="text-2xl font-medium text-black">Enter OTP code</p>
                    <p className='text-gray-600'>Please verify your phone number by entering the 6 digit code sent to you.</p>
                </div>
                <input value={OTPCode} onChange={(val)=>setOTPCode(val.target.value)} type="tel" className="border border-gray-300 rounded-md block w-full px-3 py-4" placeholder='6 digit code'/>
            </div>
            }

            <div className={`fixed bottom-0 flex flex-row justify-between w-full items-center py-5 block`}>
                <div>
                    <div className="absolute top-0 w-full h-1 bg-gray-200"/>
                    <div className={`absolute top-0 ${pageIndex == 0 ? 'w-1/5' : pageIndex == 1 ? 'w-2/5' : pageIndex == 2 ? 'w-3/5': pageIndex == 3 ? 'w-4/5' : 'w-full'} h-1 bg-black transition-w ease-out duration-300`}/>
                </div>
               
                <div className={`flex flex-row justify-between w-full items-center px-5 z-50`}>
                    <p onClick={() => NavigatePageBackward()} className="font-medium text-gray-600 underline">Back</p>
                    <div onClick={NavigatePageForward} className={`cursor-pointer py-3 border rounded-md ${loading ? 'bg-gray-400' : 'bg-black'} justify-center items-center flex px-4 h-12 w-28`}>
                        {loading ? 
                            <LoadingDots />
                            :
                            pageIndex == 6 ?
                            <p className={`font-medium text-white`}>Sign up</p>
                            :
                            <p className={`font-medium text-white`}>Continue</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}