"use client"

import PaidIcon from '@mui/icons-material/Paid';
import SecurityIcon from '@mui/icons-material/Security';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RequestSentCard(prop){
    const requestDetails = prop.details
    const router = useRouter()

    const [totalRent, setTotalRent] = useState('')

    useEffect(()=>{
        getRentTotal()
    },[])

    function getRentTotal(){
        let total = 0;
        requestDetails.payment_schedule.map((item) => {
            total += item.amount
        })
        total = total - requestDetails.sublet.security_deposit
        setTotalRent(total)
    }

    function handleDeleteRequest(){
        let at = localStorage.getItem("at")
        if(at == null) {
            alert("Please sign in again.")
            router.replace("/")
            return
        }
    }

    function handleViewSubletClick(){

    }

   

    return(
        <div className="border border-gray-200 rounded-md w-full flex flex-col p-[5%] shadow-md">
            {/* Guest Info */}
            <div className='flex flex-col border-b border-gray-200 pb-5'>
                <div className="flex flex-row space-x-3 items-center">
                    <div className="w-[10vh] h-[10vh] rounded-md border border-gray-100 overflow-hidden ">
                        <img src={requestDetails.sublet.images[0].url} className="w-full h-full" />
                    </div>
                    <div className="flex flex-col">
                        <p className="font-medium text-black" >{requestDetails.sublet.type} at {requestDetails.sublet.location.secondary_text}</p>
                        <p className="text-slate-600 text-sm">${requestDetails.sublet.rent} monthly</p>
                    </div>
                </div>
            </div>

            {/* Request details */}
            <div className='flex flex-col w-full py-5 space-y-3 border-b border-gray-200'>
                <p className="font-semibold text-black text-md" >Request details</p>
                <div className='flex flex-row items-center justify-between'>
                    <div className='flex flex-row items-center space-x-3'>
                        {/* <CalendarMonthIcon className='text-2xl'/> */}
                        <div className='flex flex-row space-x-4'>
                            <div className='flex flex-col'>
                                <p className='text-md text-sm'>From</p>
                                <p className='text-black text-sm font-medium'>{new Date(requestDetails.from).toLocaleDateString('en-us',{month:'short', day:'numeric', year:'numeric'})}</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-md text-sm'>To</p>
                                <p className='text-black text-sm font-medium'>{new Date(requestDetails.to).toLocaleDateString('en-us',{month:'short', day:'numeric', year:'numeric'})}</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center'>
                        {/* <PersonIcon className='text-sm'/> */}
                        <p className='text-md font-medium text-sm'>1 guest</p>
                    </div>
                </div>
            </div>

            {/* Rent overview stuff */}
            <div className='flex flex-row w-full py-5 space-x-6 '>
                <div className='flex flex-row space-x-2 items-center'>
                    <PaidIcon className='text-2xl'/>
                    <div className='flex flex-col'>
                        <p className='text-md text-sm'>Total rent </p>
                        <p className='text-black text-sm font-medium'>${parseInt(totalRent).toFixed(0)}</p>
                    </div>
                </div>
                <div className='flex flex-row space-x-3 items-center'>
                    <SecurityIcon className='text-2xl'/>
                    <div className='flex flex-col'>
                        <p className='text-md text-sm'>Security deposit</p>
                        <p className='text-black text-sm font-medium'>${requestDetails.sublet.rent/2}</p>
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-2 gap-3 flex'>
                
                <div className='mt-1 w-full rounded-md bg-white border-gray-400 border flex justify-center items-center py-3 cursor-pointer'>
                    <p className='font-medium text-black' >Delete request</p>
                </div>
               
                <Link href={{pathname: `/discover/properties/${requestDetails.sublet._id}`}}>
                    <div className='mt-1 w-full rounded-md bg-black flex justify-center items-center py-3 cursor-pointer'>
                        <p className='font-medium text-white'>View sublet</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}