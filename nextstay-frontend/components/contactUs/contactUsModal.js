"use client"

import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';


export default function ContactUsModal(prop){

    const [messageSent, setMessageSent] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    function handleSendMessage(){
        let uid = localStorage.getItem("uid")
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "email": uid,
        "name": "User",
        "message": message,
        "ip_address": "test"
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("https://nextstay-09a1b7efd58f.herokuapp.com/leads/contact", requestOptions)
        .then(async (res) => {
            if(res.status == 200){
                setMessageSent(true)
            }             
        })
    }
    return (
        <Modal open={prop.contactUsModal} disableAutoFocus className="flex flex-col items-center justify-center px-5">
            <div className='w-full bg-white h-[60vh] rounded-md md:w-fit md:h-fit'>
                <div className='px-5 py-6 md:py-3 justify-between items-center flex flex-row  border-b border-gray-200'>
                    <CloseIcon onClick={()=> prop.handleClose()} className='text-md cursor-pointer'/>
                    <p className='font-semibold'></p>
                    <CloseIcon className='text-md opacity-0'/>
                </div>
                {!messageSent ? 
                <>
                    <div className='px-5 py-6'>
                        <p className='text-md font-medium'>Send {prop.tenantDetails.firstName} a message</p>
                        <p className=' text-sm'>One of our members will get back to you via sms or email once the tenant responds</p>
                    </div>
                    <div className='px-5'>
                        <textarea value={message} onChange={(e)=>setMessage(e.target.value)} className='w-full h-[20vh] rounded-md border border-gray-400 p-3' placeholder='Message...'/>
                        <p className='text-xs text-slate-500'>For you safety, please do not enter any personal information such as phone number or paymnet information</p>
                    </div>
                    <div className='flex flex-row justify-between items-center px-5 py-8'>
                        {/* <p className='underline text-sm font-medium text-slate-600'>Need help?</p> */}
                        <div onClick={()=>handleSendMessage()} className='bg-black rounded-md cursor-pointer justify-center items-center px-3 py-3'>
                            <p className='text-white font-medium'>Send message</p>
                        </div>
                    </div>
                </>
                :
                <>
                    <div className='px-5 py-16'>
                        <p className='text-md font-medium'>Message successfully sent!</p>
                        <p className=' text-sm'>One of our members will get back to you via sms or email once the tenant responds</p>
                    </div>
                </>
                }

            </div>
        </Modal>
    )
}