"use client"

import { useRouter,} from 'next/navigation';

//Icon
import PhoneIcon from '@mui/icons-material/Phone';
import InstagramIcon from '@mui/icons-material/Instagram';
import MailIcon from '@mui/icons-material/Mail';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import PaidIcon from '@mui/icons-material/Paid';
import SecurityIcon from '@mui/icons-material/Security';
import { useEffect, useState } from 'react';
import Link from 'next/link';


export default function RequestCard(prop){
    const router = useRouter()
    const requestDetails = prop.details
    const [totalRent, setTotalRent] = useState('')

    useEffect(()=>{
        getRentTotal()
    },[])

    function getAge(){
        //calculate month difference from current date in time  
       var month_diff = new Date() - new Date(requestDetails.subtenant.dob) 
     
        //convert the calculated difference in date format  
        var age_dt = new Date(month_diff);   
            
        //extract year from date      
        var year = age_dt.getUTCFullYear();  
            
        //now calculate the age of the user  
        var age = Math.abs(year - 1970);  
            
        //display the calculated age  
        return age
   }

    function getRentTotal(){
        let total = 0;
        requestDetails.payment_schedule.map((item) => {
            total += item.amount
        })
        total = total - requestDetails.sublet.security_deposit
        setTotalRent(total)
    }
    return(
        <div className="border border-gray-200 rounded-md w-full flex flex-col p-[5%] shadow-md">

            {/* Guest Info */}
            <div className='flex flex-col border-b border-gray-200 pb-5'>
                <div className="flex flex-row space-x-3 items-center">
                    <div className="w-[10vh] h-[10vh] rounded-full border border-gray-100 overflow-hidden ">
                        <img src={requestDetails.subtenant.image.url} className="w-full h-full roudned-full" />
                    </div>
                    <div className="flex flex-col">
                        <p className="font-medium text-black" >{requestDetails.subtenant.firstName} {requestDetails.subtenant.lastName}</p>
                        <p className="text-slate-600 text-sm">{requestDetails.subtenant.gender}  •  {getAge()} years old</p>
                        <p className="text-slate-600 text-sm">{requestDetails.subtenant.uni_name}</p>
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
                        <p className='text-black text-sm font-medium'>${ parseInt(totalRent).toFixed(0)}</p>
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
            <Link href={{pathname: `/profile/myRequests/${requestDetails._id}`, query:{requestDetails: JSON.stringify(prop.details), totalRent: totalRent} }}>
                <div className='mt-1 w-full rounded-md bg-black flex justify-center items-center py-3 cursor-pointer'>
                    <p className='font-medium text-white' >View details</p>
                </div>
            </Link>
        </div>
    )
}