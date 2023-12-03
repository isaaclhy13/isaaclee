"use client"
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PersonIcon from '@mui/icons-material/Person';

import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SmsIcon from '@mui/icons-material/Sms';

import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { useRef } from 'react';

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import Select from 'react-select'
import Modal from '@mui/material/Modal';

//Const 
import {DAYS, GENDERS, MONTHS, YEARS } from '@/constants/sharedUtils';
import { UserContext } from '@/UserContext';
import LoadingDots from '../loadingDots';


export default function SignUpModal(props){
    const {user, setUser} = useContext(UserContext)
    const profilePictureInput = useRef(null)
    const [email, setEmail] = useState("")
    const [uid, setUid] = useState(null)
    const [emailOTP, setEmailOTP] = useState("")

    //Sign up information
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [gender, setGender] = useState(null)
    const [birthday, setBirthday] = useState({day:null, month:null, year:null})

    const [instagramH, setInstagramH] = useState("")
    const [linkedinH, setLinkedinH] = useState("")
    const [wechatH, setWechatH] = useState("")

    const [loading, setLoading] = useState(false)
    const [pageIndex, setPageIndex] = useState(0)
    const [profilePicture, setProfilePicture] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState()
    const [countryCode, setCountryCode] = useState()
    const [phoneOTP, setPhoneOTP] = useState("")
    const router = useRouter()

    function handlePageNavigation(index) {
        if(pageIndex == 0){
            sendLoginOTP()
        }
        else if(pageIndex == 1){
            checkLoginOTP()
        }
        else if (pageIndex == 2){
            if(!verifyBasicInfo()){return}
            else{
                setPageIndex(pageIndex+1)
            }
        }
        else if(pageIndex == 3){
            if(!verifyProfilePic()){return}
            else{
                setPageIndex(pageIndex+1)
            }
        }
        else if(pageIndex == 4){
            if(!verifySocialH()){return}
            else{
                setPageIndex(pageIndex+1)
            }
        }
        else if(pageIndex == 5){
            verifyPhoneNumber()
        }
        else if(pageIndex == 6){
            verifyOTPCode()
        }
        
    }

    function signUp(){
        let at = localStorage.getItem("at")
        
        if(at == null) {
            alert("Please try again later.")
            router.refresh()
            return
        }
        //Organize social media
        let socialMediaArr = JSON.stringify({"instagram": instagramH, "linkedin": linkedinH, "wechat": wechatH})

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
        formdata.append("image", profilePicture.file, "image 2.png");
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
                setLoading(false)
                props.handleClose()
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

    function sendLoginOTP(){
        if(email.trim() == "" || !email.includes("@")){
            alert("Please enter a valid email.")
            return
        }
        setLoading(true)
        fetch('https://nextstay-09a1b7efd58f.herokuapp.com/auth/login', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                "email": email,
            })
        })
        .then( async res => {
            if (res.status == 200){
                const data = await res.json()
                setUid(data.data._id)
                console.log(data.data._id)
                setPageIndex(pageIndex+1)
            }
            else{
                //Handle if the email is not right and alert user
                alert("Please enter a valid email.")
            }
            setLoading(false)
        })
        .catch( e => {alert("Login error, please try again later.")})
    }

    function checkLoginOTP(){
        if(emailOTP.length != 6){
            alert("Please enter a valid OTP")
            return
        } else {
            setLoading(true)
            fetch('https://nextstay-09a1b7efd58f.herokuapp.com/auth/otp', {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                },
                body:JSON.stringify({
                    "email": email,
                    "code": emailOTP
                })
            })
            .then( async res => {
                if(res.status == 200){
                    let data = await res.json()
                    localStorage.setItem("at", data.access_token)
                    checkUserHasAccount()
                } else {
                    alert("Invald code. Please try again!")
                    setLoading(false)
                    return
                }
            })
        }
    }

    function checkUserHasAccount(){
        fetch(`https://nextstay-09a1b7efd58f.herokuapp.com/auth/check/${email}`, {
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
        }).then( async res => {
            if(res.status == 404){
                console.log("User not onboarded yet. Go to signup")
                setPageIndex(pageIndex+1)
                setLoading(false)
            } else {
                console.log("User onboarded, close this tab")
                const data = await res.json()
                localStorage.setItem("uid",data._id)
                getCurrentUserInfo(data._id)
            }
            
        })
        .catch( e => {
            console.log("Error at checkUserHasAccount")
        })
    }

    function getCurrentUserInfo(uid){
        let at = localStorage.getItem("at")
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
                    setUser(data.data)
                    setLoading(false)
                    setPageIndex(0)
                    goBackToHome()
                }
            })
        }
    }

    function goBackToHome(){
        props.handleClose()
        router.refresh()
    }

    function verifyBasicInfo(){
        if(firstName.trim() == ""){
            alert("Please enter your first name.")
            return false;
        }
        else if(lastName.trim() == ""){
            alert("Please enter your last name.")
            return false;
        }
        else if(gender == null){
            alert("Please select your gender.")
            return false;
        }
        else if(birthday.day == null || birthday.month == null || birthday.year == null){
            alert("Please enter your birthday.")
            return false;
        }
        return true
    }

    function verifyOTPCode(){
        if(phoneOTP.length != 6){
            alert("Please enter a 6 digit OTP code.")
            return false
        }
        else{
            setLoading(true)
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
            "phone_number": `+${phoneNumber}`,
            "code": phoneOTP
            });

            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };

            fetch("https://nextstay-09a1b7efd58f.herokuapp.com/auth/sms/verifyotp", requestOptions)
            .then(async res => {
                console.log("SIGN IN RES", res)
                if(res.status == 200){
                    signUp()
                    // const data = await res.json()
                    // setUser({id:data._id})
                    // localStorage.setItem("uid",data._id)
                    // router.replace("/")
                }
                else{
                    setLoading(false)
                    alert("Incorrect OTP code, please try again!")
                }
            })
        }
    }

    function verifyProfilePic(){
        if(profilePicture == null){
            alert("Please select a profile picture.")
            return false
        }
        return true
    }

    function verifySocialH(){
        if(instagramH.trim() == "" && linkedinH.trim() == "" && wechatH.trim() == ""){
            alert("Please enter at least one social handle.")
            return false
        }
        return true
    }

    function verifyPhoneNumber(){
        if(phoneNumber.trim() == "") {
            alert("Please enter a valid phone number")
            return false
        } else {
            setLoading(true)
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
                setLoading(false)
                if(res.status == 200){
                    setPageIndex(pageIndex+1)
                }
                else{
                    alert("Please enter a valid phone number.")
                }
            })
        }
    }

    function sendPhoneOTPCode(){

    }

    function handlePageBackNavigation(){
        setPageIndex(pageIndex - 1)
    }

    function getBackNavigationIcon(){
        if(pageIndex == 0){
            return <CloseIcon onClick={()=> props.handleClose()} className='cursor-pointer text-md text-slate-600'/>
        }
        else {
            return <ChevronLeftIcon onClick={()=> handlePageBackNavigation()} className='cursor-pointer text-slate-600'/>
        }
    }

    function getNavigationTitle(){
        if(pageIndex == 0){
            return "Login or sign up"
        } else if (pageIndex == 1){
            return "Login"
        } else {
            return "Sign up"
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

    function handleProfilePictureChange(e){
        setProfilePicture({"file": e.target.files[0], "imageURL": URL.createObjectURL(e.target.files[0])})
    }

    function handleProfilePictureClick(){
        profilePictureInput.current.click()
    }


    return(
        <Modal disableAutoFocus open={props.signupLoginModel} className="flex flex-col items-center justify-center outline-none overflow-scroll">
            <div className='w-2/5 rounded-lg bg-white h-fit border border-slate-200 '>
                <div className='py-4 flex flex-row border-b border-gray-200 justify-between items-center w-full px-[5%]'>
                    {getBackNavigationIcon()}
                    <p className='font-semibold'>{getNavigationTitle()}</p>
                    <CloseIcon className='opacity-0'/>
                </div>
                { pageIndex == 0 &&
                <div className='flex flex-col px-[5%] py-10 space-y-5'>
                    <div className='space-y-5'>
                        <p className="text-xl font-medium text-black">Welcome to nextstay</p>
                        <div className='flex flex-col space-y-3'>
                            <input onChange={(val)=> setEmail(val.target.value)} type="text" className="border border-gray-300 rounded-md block w-full px-3 py-3 ring-0 focus:border-black focus:ring-0" placeholder='School email'/>
                            {/* <p className='text-gray-500 text-xs'>We’ll email you to confirm your school email.By entering your school email, you are agreeing to our Privacy Policy and Terms of services.</p> */}
                        </div>
                    </div>
                    <div onClick={()=>handlePageNavigation()} className={`rounded-md block w-full px-3 py-3 ${loading ? "bg-gray-400" : "bg-gradient-to-r from-[#2390FF] to-[#174AFE]"} justify-center items-center flex cursor-pointer h-[6.5vh] ring-0`}>
                        {loading ? 
                            <LoadingDots/>
                        :
                            <p className='text-white font-medium'>Continue</p>
                        }
                    </div>
                </div>
                }

                { pageIndex == 1 &&
                    <div className='flex flex-col px-[5%] py-10 space-y-12'>
                        <div className='space-y-1'>
                            <p className="text-xl font-medium text-black">Enter OTP code below</p>
                            <p className="text-slate-600">An OTP code has been sent to you email. Please enter the 6 digit code below to continue sign up</p>
                        </div>
                        <div className='flex flex-col space-y-3'>
                            <input onChange={(val)=> setEmailOTP(val.target.value)} type="tel" className="border border-gray-300 rounded-md block w-full px-3 py-3 ring-0 focus:border-black focus:ring-0" placeholder='6 digit code'/>
                            {/* <p className='text-gray-500 text-xs'>We’ll email you to confirm your school email.By entering your school email, you are agreeing to our Privacy Policy and Terms of services.</p> */}
                        </div>
                        <div onClick={()=>handlePageNavigation()} className='rounded-md block w-full px-3 py-3 bg-gradient-to-r from-[#2390FF] to-[#174AFE] justify-center items-center flex cursor-pointer h-[6.5vh] ring-0'>
                            {loading ?
                                <LoadingDots/>
                            :
                                <p className='text-white font-medium'>Continue</p>
                            }
                        </div>
                    </div>
                }

                {/* Basic information */}
                { pageIndex == 2 &&
                    <div className='flex flex-col px-[5%] py-10 space-y-12'>
                        
                        <div className='flex flex-col space-y-6'>
                            <div className='flex flex-col space-y-2'>
                                <input value={firstName} type="text" onChange={(val)=>setFirstName(val.target.value)} className="border border-gray-300 rounded-md block w-full px-3 py-3 ring-0 focus:border-black focus:ring-0" placeholder='First name'/>
                                <input value={lastName} type="text" onChange={(val)=>setLastName(val.target.value)} className="border border-gray-300 rounded-md block w-full px-3 py-3 ring-0 focus:border-black focus:ring-0" placeholder='Last name'/>
                                {/* <p className='text-gray-500 text-xs'>We’ll email you to confirm your school email.By entering your school email, you are agreeing to our Privacy Policy and Terms of services.</p> */}
                            </div>
                            <div className='flex flex-col'>
                                <Select value={gender == null ? null : {label: gender, value: gender}} onChange={(val) => setGender(val.value)} inputProps={{readOnly:true}} isSearchable={ false } options={GENDERS} placeholder="Gender" styles={{ control: base => ({ ...base,  cursor:'pointer', borderColor: "#D9D9D9", borderRadius:'0.375rem', outline:'none', boxShadow: 'none', paddingTop: '0.5rem', paddingBottom: '0.5rem', flex: 1, fontSize: '1rem', '&:hover': { borderStyle:'solid', borderColor:'black'}})}}/>                      
                            </div>

                            <div className='flex flex-col space-y-2'>
                                <p className="text-slate-600 text-sm font-medium">Birthday</p>
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
                        </div>
                        <div className='pt-3'>
                            <div onClick={()=>handlePageNavigation()} className='rounded-md block w-full px-3 py-3 bg-gradient-to-r from-[#2390FF] to-[#174AFE] justify-center items-center flex cursor-pointer'>
                                <p className='text-white font-medium'>Continue</p>
                            </div>
                        </div>
                    </div>
                }

                {/* Profile pictures */}
                { pageIndex == 3 &&
                    <div className='flex flex-col px-[5%] py-10 space-y-5'>
                        <div className='space-y-1'>
                            <p className="text-xl font-medium text-black">Set you profile picture</p>
                        </div>
                        <div className= "border border-gray-300 rounded-md block w-full px-4 py-3 flex flex-row items-center justify-between space-x-2">
                            <div className="flex flex-col space-y-1">
                                <p className='text-black font-semibold'>Example:</p>
                                <p className='text-slate-600 text-sm'>Please make sure your face is visible in the image.</p>
                            </div>
                            <div className="h-14 w-16 rounded-full items-center ">
                                <img src="https://www.gsd.harvard.edu/wp-content/uploads/2023/05/Yoolim-Jenn-Kim-300x300.jpg" className="rounded-full object-cover" />
                            </div>
                        </div>
                        <div className='w-full py-3 flex justify-center'>
                            <div onClick={()=> handleProfilePictureClick()} className='w-[30vh] h-[30vh] rounded-full bg-gray-200 flex justify-center items-center cursor-pointer overflow-hidden border border-gray-200'>
                                {profilePicture == null ?
                                <PersonIcon className='text-4xl text-gray-400'/>
                                :
                                <img src={profilePicture.imageURL} style={{height:'100%', width:'100%', objectFit:'cover'}} />
                                }
                            </div>
                            <input type="file" ref={profilePictureInput} name="files" className="hidden" onChange={(e) => handleProfilePictureChange(e)}/>
                        </div>
                        <div onClick={()=>handlePageNavigation()} className='rounded-md block w-full px-3 py-3 bg-gradient-to-r from-[#2390FF] to-[#174AFE] justify-center items-center flex cursor-pointer'>
                            <p className='text-white font-medium'>Continue</p>
                        </div>
                    </div>
                }

                {/* Social handles */}
                { pageIndex == 4 &&
                    <div className='flex flex-col px-[5%] py-10 space-y-12'>
                        <div className='space-y-1'>
                            <p className="text-xl font-medium text-black">Social handles</p>
                            <p className="text-slate-600">This will not be shown to others, it is for us to verify your social media. (Must enter at least 1)</p>
                        </div>
                        <div className='space-y-6'>
                            <div className='flex flex-row items-center border border-gray-200 rounded-md px-3 hover:border-black'>
                                <InstagramIcon className='text-slate-600'/>
                                <input value={instagramH} onChange={(val) => setInstagramH(val.target.value)} type="tel" className="block w-full px-3 py-3 outline-none border-none ring-0 focus:ring-0" placeholder='Instagram handle'/>
                            </div>
                            <div className='flex flex-row items-center border border-gray-200 rounded-md px-3 hover:border-black'>
                                <LinkedInIcon className='text-slate-600'/>
                                <input value={linkedinH} onChange={(val) => setLinkedinH(val.target.value)} type="tel" className="block w-full px-3 py-3 outline-none border-none focus:ring-0" placeholder='LinkedIn handle'/>
                            </div>
                            <div className='flex flex-row items-center border border-gray-200 rounded-md px-3 hover:border-black'>
                                <SmsIcon className='text-slate-600'/>
                                <input value={wechatH} onChange={(val) => setWechatH(val.target.value)} type="tel" className="block w-full px-3 py-3 outline-none border-none focus:ring-0" placeholder='Wechat username'/>
                            </div>
                        </div>
                        <div onClick={()=>handlePageNavigation()} className='rounded-md block w-full px-3 py-3 bg-gradient-to-r from-[#2390FF] to-[#174AFE] justify-center items-center flex cursor-pointer'>
                            <p className='text-white font-medium'>Continue</p>
                        </div>
                    </div>
                }

                {/* Enter phone number */}
                {pageIndex == 5 &&
                <div className='flex flex-col px-[5%] py-10 space-y-12'>
                     <div className='space-y-1'>
                        <p className="text-xl font-medium text-black">Enter your phone number</p>
                        <p className="text-slate-600">Please enter your phone number below. We will send you an 5 digit code to verify your phone number.</p>
                    </div>
                    <div className='flex-row flex w-full space-y-3 text-slate-600'>
                        <PhoneInput
                        inputStyle={{height:50, fontSize:'1rem', '&:focus': { borderStyle:'solid', borderColor:'black'}}}
                        containerStyle={{height:50, backgroundColor:'white', width:60,  '&:focus': { borderStyle:'solid', borderColor:'black'}}}
                        country={'us'}
                        value={phoneNumber}
                        className={"input-phone-number"}
                        onChange={(phone, countryCode) => {
                            setCountryCode(countryCode.dialCode)
                            setPhoneNumber(phone)
                        }}
                        />
                    </div>
                    <div onClick={()=>handlePageNavigation()} className='rounded-md block w-full px-3 py-3 bg-gradient-to-r from-[#2390FF] to-[#174AFE] justify-center items-center flex cursor-pointer h-[6.5vh]'>
                        {loading ?
                            <LoadingDots/>
                        :
                            <p className='text-white font-medium'>Continue</p>
                        }
                    </div>
                </div>
                }

                {/* Enter phone number OTP */}
                { pageIndex == 6 &&
                    <div className='flex flex-col px-[5%] py-10 space-y-12'>
                        <div className='space-y-1'>
                            <p className="text-xl font-medium text-black">Enter OTP code below</p>
                            <p className="text-slate-600">Please enter the 6 digit code below to verify your phone number and finish sign up</p>
                        </div>
                        <div className='flex flex-col space-y-6'>
                            <input value={phoneOTP} onChange={(val)=>setPhoneOTP(val.target.value)} type="tel" className="border border-gray-300 rounded-md block w-full px-3 py-3 ring-0 focus:border-black focus:ring-0" placeholder='6 digit code'/>
                            {/* <p className='text-gray-500 text-xs'>We’ll email you to confirm your school email.By entering your school email, you are agreeing to our Privacy Policy and Terms of services.</p> */}
                            <div className='space-y-2'>
                                <p onClick={()=> setPageIndex(pageIndex-1)} className="w-fit text-slate-600 cursor-pointer text-sm">Edit phone number</p>
                                <p onClick={()=> sendPhoneOTPCode()}className="w-fit text-slate-600 cursor-pointer text-sm">Resend code</p>
                            </div>
                        </div>
                        
                        <div onClick={()=>handlePageNavigation()} className='rounded-md block w-full px-3 py-3 bg-gradient-to-r from-[#2390FF] to-[#174AFE] justify-center items-center flex cursor-pointer h-[6.5vh]'>
                            {loading ?
                                <LoadingDots/>
                            :
                                <p className='text-white font-medium'>Continue</p>
                            }
                        </div>
                    </div>
                }

            </div>
        </Modal>
    )
}