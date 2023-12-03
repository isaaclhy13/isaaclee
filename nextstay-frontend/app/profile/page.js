"use client"
//Icons
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import IosShareIcon from '@mui/icons-material/IosShare';
import AddHomeIcon from '@mui/icons-material/AddHome';
import PersonIcon from '@mui/icons-material/Person';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArticleIcon from '@mui/icons-material/Article';
import SecurityIcon from '@mui/icons-material/Security';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MailIcon from '@mui/icons-material/Mail';
import SendIcon from '@mui/icons-material/Send';

//Lottie
import Lottie from "lottie-react";
import groovyWalkAnimation from '../../public/groovyWalk.json'

import { usePathname, useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { UserContext } from '@/UserContext';
import LoadingDots from '@/components/loadingDots';

export default function ProfilePage(){
    const pathname = usePathname()
    const router = useRouter()
    const {user, setUser} = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')

    useEffect(()=> {
        getCurrentUserInfo()
    }, [])

    function getCurrentUserInfo(){
        let at = localStorage.getItem("at")
        let uid = localStorage.getItem("uid")

        if(uid != null && at != null){
            fetch(`https://nextstay-09a1b7efd58f.herokuapp.com/user/${uid}`, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + at
            },
            })
            .then( async res => {
                if(res.status == 200){
                    let data = await res.json()
                    setUser(data.data)
                }
            })
        }
    }

    function handleNavigation(page){
        router.push(pathname + `/${page}`, {data:"hello"})
    }

    function handleLogout(){
        localStorage.clear()
        setUser(null)
        router.refresh("/")
    }

    function sendLoginOTP(){
        if(loading){
            return
        }
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
                localStorage.setItem("email", email)
                router.push("/login")
                setLoading(false)
            } else if(res.status == 400){
                setLoading(false)
                alert("Please use an edu email. We are currently only accepting students! Sorry for the inconvenience.")
            }
        })
        .catch( e => {
            setLoading(false)
            alert("Login error, please try again later.")
        })
    }

    return(
        <div className="flex min-h-screen flex-col items-center">
            {user ?
            <div className='flex flex-col w-full px-5'>
                <div className="w-full py-5">
                    <p className="text-3xl font-semibold">My profile</p>
                </div>

                <div className="flex flex-row w-full space-x-4 items-center py-5">
                    <div className="h-20 w-20 rounded-full bg-gray-200 justify-start">
                        <img src={user.image.url} alt="Sublet image" className="w-full h-full rounded-full object-cover"/>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <p className="font-semibold text-gray-700">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-700">Joined Dec 2023</p>
                        <p className="text-sm text-gray-700">Referrals: 0</p>
                    </div>
                </div>

                <div onClick={()=> handleNavigation('posting')} className="w-full rounded-md border border-gray-200 py-6 shadow-md flex flex-row px-5 mt-5 justify-between">
                    <div className="flex flex-col space-y-1">
                        <p className="font-semibold text-gray-700">Sublease your place</p>
                        <p className="text-sm text-gray-500 w-4/6">Save thousands in minutes easier than ever</p>
                    </div>
                    <div  className="w-1/4"> 
                        <Lottie animationData={groovyWalkAnimation} loop={true} className="w-full"/>

                    </div>
                </div>

                <div className="w-full py-4 mt-8">
                    <p className="font-semibold text-xl text-gray-700 py-2">Referral and credits</p>
                    <div className="flex flex-row py-5 justify-between">
                        <div className='flex flex-row space-x-4 items-center '>
                            <CardGiftcardIcon className='text-gray-600'/>
                            <p className="font-md text-gray-700">Get up to $200 per referral</p>
                        </div>
                        <ChevronRightIcon className='text-gray-600'/>
                    </div>
                    <div className="flex flex-row py-5 justify-between border-b border-b-gray-200">
                        <div className='flex flex-row space-x-4 items-center '>
                            <IosShareIcon className='text-gray-600'/>
                            <p className="font-md text-gray-700">Share</p>
                        </div>
                        <ChevronRightIcon className='text-gray-600'/>
                    </div>
                </div>

                <div className="w-full py-4">
                    <p className="font-semibold text-xl text-gray-700 py-2">Listing</p>
                    <div onClick={()=> handleNavigation("mySublet")} className="flex flex-row py-5 justify-between border-b border-b-gray-200">
                        <div className='flex flex-row space-x-4 items-center '>
                            <AddHomeIcon className='text-gray-600'/>
                            <p className="font-md text-gray-700">Manage my listing</p>
                        </div>
                        <ChevronRightIcon className='text-gray-600'/>
                    </div>
                </div>

                <div className="w-full py-4">
                    <p className="font-semibold text-xl text-gray-700 py-2">My requests</p>
                    <div onClick={()=> handleNavigation("myRequests")} className="flex flex-row py-5 justify-between border-b border-b-gray-200">
                        <div className='flex flex-row space-x-4 items-center '>
                            <SendIcon className='text-gray-600'/>
                            <p className="font-md text-gray-700">Requests</p>
                        </div>
                        <ChevronRightIcon className='text-gray-600'/>
                    </div>

                </div>

                <div className="w-full py-4">
                    <p className="font-semibold text-xl text-gray-700 py-2">Account information</p>
                    <div onClick={()=> handleNavigation("edit")} className="flex flex-row py-5 justify-between">
                        <div className='flex flex-row space-x-4 items-center '>
                            <AddHomeIcon className='text-gray-600'/>
                            <p className="font-md text-gray-700">Edit profile</p>
                        </div>
                        <ChevronRightIcon className='text-gray-600'/>
                    </div>
                    <div onClick={()=> handleNavigation("saved")} className="flex flex-row py-5 justify-between border-b border-b-gray-200">
                        <div className='flex flex-row space-x-4 items-center '>
                            <FavoriteIcon className='text-gray-600'/>
                            <p className="font-md text-gray-700">Saved properties</p>
                        </div>
                        <ChevronRightIcon className='text-gray-600'/>
                    </div>
                </div>

                <div className="w-full py-4">
                    <p className="font-semibold text-xl text-gray-700 py-2">Support</p>
                    <div className="flex flex-row py-5 justify-between ">
                        <div className='flex flex-row space-x-3 items-center '>
                            <ArticleIcon className='text-gray-600'/>
                            <p className="font-md text-gray-700">Terms of services</p>
                        </div>
                        <ChevronRightIcon className='text-gray-600'/>
                    </div>
                    <div className="flex flex-row py-5 justify-between ">
                        <div className='flex flex-row space-x-3 items-center '>
                            <SecurityIcon className='text-gray-600'/>
                            <p className="font-md text-gray-700">Privacy</p>
                        </div>
                        <ChevronRightIcon className='text-gray-600'/>
                    </div>
                    <div className="flex flex-row py-5 justify-between">
                        <div className='flex flex-row space-x-3 items-center'>
                            <AddIcCallIcon className='text-gray-600'/>
                            <p className="font-md text-gray-700">Contact us</p>
                        </div>
                        <ChevronRightIcon className='text-gray-600'/>
                    </div>
                    <div className='w-full justify-center items-center flex py-6'>
                        <p onClick={()=> handleLogout()} className="font-medium" >Logout</p>
                    </div>
                </div>
                <div className='py-10 w-full' />
            </div>
            :
            <div className='flex flex-col w-full'>
                <div className='py-4 flex flex-row border-b border-gray-200 justify-center items-center w-full '>
                    <p className='font-semibold text-sm'>Login / Sign up</p>
                </div>
                <div className='flex flex-col px-5 pt-10 space-y-5'>
                    <p className="text-2xl font-medium text-black">Welcome to nextstay</p>
                    <div className='flex flex-col space-y-3'>
                        <input value={email} onChange={(val)=> setEmail(val.target.value)} type="text" className="border border-gray-300 rounded-md block w-full px-3 py-4 !outline-none" placeholder='School email'/>
                        {/* <p className='text-gray-500 text-xs'>We’ll email you to confirm your school email.By entering your school email, you are agreeing to our Privacy Policy and Terms of services.</p> */}
                    </div>
                    <div onClick={()=> sendLoginOTP()} className={`rounded-md block w-full px-3 py-3 ${loading ? "bg-gray-400" : "bg-gradient-to-r from-[#2390FF] to-[#174AFE]"} justify-center items-center flex h-[7vh]`}>
                        {loading ?
                            <LoadingDots/>
                        :
                            <p className='text-white font-medium'>Continue</p>
                        }
                    </div>
                </div>
            </div>
            }
          
        </div>
    )
}