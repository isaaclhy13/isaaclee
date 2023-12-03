"use client"

import LoadingDots from '@/components/loadingDots';
import { UserContext } from '@/UserContext';
//Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { usePathname, useRouter, useParams } from 'next/navigation';
import { useContext, useState } from 'react';


export default function LoginOTP(props){
    const {user, setUser} = useContext(UserContext)
    const router = useRouter()
    const [emailOTP, setEmailOTP] = useState('')
    const [loading, setLoading] = useState(false)

    function NavigateToSignUp(){
        router.replace("/signup")
    }

    function checkLoginOTP(){
        if(loading){
            return
        }
        if(emailOTP.length != 6){
            alert("Please enter a valid OTP")
            return
        } else {
            setLoading(true)
            let email = localStorage.getItem("email")
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
                    checkUserHasAccount(email)
                }
                else{
                    setLoading(false)
                    alert("Incorrect OTP code. Please try again!")
                }
            })
            .catch( e => {
                alert("Error at check OTP code")
            })
        }
    }

    function checkUserHasAccount(email){
        fetch(`https://nextstay-09a1b7efd58f.herokuapp.com/auth/check/${email}`, {
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
        }).then( async res => {
            if(res.status == 404){
                console.log("User not onboarded yet. Go to signup")
                router.push("/signup")
            } else {
                console.log("User onboarded, close this tab")
                const data = await res.json()
                // setUser({id:data._id})
                localStorage.setItem("uid",data._id)
                // router.replace("/")
                // setLoading(false)
                getCurrentUserInfo(data._id)
            }
            
        })
        .catch( e => {
            alert("Errorr")
            console.log("Error at checkUserHasAccount")
        })
    }

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
                    router.replace("/")
                    setLoading(false)
                } else {
                    setLoading(false)
                    alert("Error, please try again later.")
                    
                }
            })
            .catch( e => {
                setLoading(false)
                alert("Error")
                
            })
        }
    }

    return(
        <div className="flex flex-col relative">
            <div className='py-4 flex flex-row border-b border-gray-200 justify-between items-center w-full px-5'>
                <ArrowBackIcon onClick={()=> router.back()}/>
                <p className='font-semibold text-sm'>Email Login</p>
                <ArrowBackIcon className='opacity-0'/>
            </div>
            <div className='px-5 pt-10 space-y-7'>
                <div className='space-y-1'>   
                    <p className="text-2xl font-medium text-black">Enter OTP code below</p>
                    <p className='text-gray-500 text-sm'>An OTP code has been sent to you email. Please enter the 6 digit code below to continue sign up.</p>
                </div>
                <input value={emailOTP} onChange={(val)=>setEmailOTP(val.target.value)} type="tel" className="border border-gray-300 rounded-md block w-full px-3 py-4" placeholder='6 digit code'/>
                <div onClick={()=>checkLoginOTP()} className={`rounded-md block w-full px-3 py-3 ${loading ? "bg-gray-400" : "bg-gradient-to-r from-[#2390FF] to-[#174AFE]"} justify-center items-center flex h-[7vh]`}>
                    {loading ?
                        <LoadingDots/>
                        :
                        <p className='text-white font-medium'>Continue</p>
                    }
                </div>
            </div>
        </div>
    )
}