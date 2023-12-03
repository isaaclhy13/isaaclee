"use client"
import { useRouter, useSearchParams } from 'next/navigation';

//Icon
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PhoneIcon from '@mui/icons-material/Phone';
import InstagramIcon from '@mui/icons-material/Instagram';
import MailIcon from '@mui/icons-material/Mail';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import PaidIcon from '@mui/icons-material/Paid';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SingleBedIcon from '@mui/icons-material/SingleBed';

import CheckIcon from '@mui/icons-material/Check';
import WeekendIcon from '@mui/icons-material/Weekend';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';



export default function RequestDetailsPage(){
    const router = useRouter()
    const searchParams = useSearchParams()
    let requestDetails = JSON.parse(searchParams.get("requestDetails"))
    let totalRent = searchParams.get("totalRent")

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

   function handleTenantAcceptDeclineRequest(decision){
        let at = localStorage.getItem("at")

        if(at == null){
            alert("Please sign in.")
            return 
        }

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `bearer ${at}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "subtenantId": requestDetails.subtenant._id,
        "tenantAccepted": decision
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("https://nextstay-09a1b7efd58f.herokuapp.com/request/response", requestOptions)
        .then( async res => {
            if(res.status == 200){
                let data = await res.json()

                console.log(data)
            }
        })
    }

    return(
        <div className="flex flex-col w-full">
            <div onClick={()=> router.back()} className="fixed w-full px-[5%] h-[10vh] items-center flex shadow-md  bg-white z-50">
                <ChevronLeftIcon className='cursor-pointer' />
            </div>
            <div className='flex flex-col md:flex-row w-full px-[5%] mt-[12vh] md:px-[10%]'>
                <div className=' md:w-1/2'>

                    {/* Guest info */}
                    <div className='space-y-4 border-b border-gray-200 py-6 '>
                        <p className='font-semibold text-xl'>Guest inforamtion</p>
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
                        <div className="flex flex-row flex-wrap gap-2">
                            <div className="flex flex-row space-x-2 rounded-md bg-black py-1.5 px-3 items-center truncate">
                                <PhoneIcon className='text-sm text-white'/>
                                <p className='text-sm text-white'>Phone no. verified</p>
                            </div>
                            <div className="flex flex-row space-x-2 rounded-md bg-black py-1.5 px-3 items-center">
                                <InstagramIcon className='text-sm text-white'/>
                                <p className='text-sm text-white'>Instagram verified</p>
                            </div>
                            <div className="flex flex-row space-x-2 rounded-md bg-black py-1.5 px-3 items-center">
                                <MailIcon className='text-sm text-white'/>
                                <p className='text-sm text-white'>School email verified</p>
                            </div>
                            <div className="flex flex-row space-x-2 rounded-md bg-black py-1.5 px-3 items-center">
                                <DescriptionIcon className='text-sm text-white'/>
                                <p className='text-sm text-white'>Internship offer verified</p>
                            </div>
                        </div>
                        <div className='flex flex-col w-full space-y-2'>
                            <p className="font-medium text-black text-md" >Message from {requestDetails.subtenant.firstName}</p>
                            <p className='text-slate-600'>{requestDetails.message}</p>
                        </div> 
                    </div>

                    {/* Sublet info */}
                    <div className='space-y-4 border-b border-gray-200 py-6'>
                        <p className='font-semibold text-xl'>Sublet inforamtion</p>
                        <div className='flex flex-col space-y-6'>
                            <div className='flex flex-row items-center space-x-3 w-full'>
                                <div className='flex flex-row w-[40%] items-center space-x-3'>
                                    <CalendarMonthIcon className='text-2xl'/>
                                    <div className='flex flex-col'>
                                        <p className='text-md text-sm'>From</p>
                                        <p className='text-black text-sm font-medium'>{new Date(requestDetails.from).toLocaleDateString('en-us',{month:'short', day:'numeric', year:'numeric'})}</p>
                                    </div>
                                </div>
                                <div className='flex flex-row w-[40%] items-center space-x-3'>
                                    <CalendarMonthIcon className='text-2xl'/>
                                    <div className='flex flex-col'>
                                        <p className='text-md text-sm'>To</p>
                                        <p className='text-black text-sm font-medium'>{new Date(requestDetails.to).toLocaleDateString('en-us',{month:'short', day:'numeric', year:'numeric'})}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-row space-x-3 items-center'>
                                <PersonIcon className='text-2xl'/>
                                <p className='text-md font-medium text-sm'>1 guest</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment info */}
                    <div className='space-y-4 border-b border-gray-200 py-6'>
                        <p className='font-semibold text-xl'>Payment inforamtion</p>
                        <div className='flex flex-row w-full'>
                            <div className='flex flex-row space-x-2 items-center w-[40%]'>
                                <PaidIcon className='text-2xl'/>
                                <div className='flex flex-col'>
                                    <p className='text-md text-sm'>Total rent </p>
                                    <p className='text-black text-sm font-medium'>${totalRent}</p>
                                </div>
                            </div>
                            <div className='flex flex-row space-x-3 items-center w-[40%]'>
                                <SecurityIcon className='text-2xl'/>
                                <div className='flex flex-col'>
                                    <p className='text-md text-sm'>Security deposit</p>
                                    <p className='text-black text-sm font-medium'>${requestDetails.sublet.rent/2}</p>
                                </div>
                            </div>
                        </div>
                        
                    </div>

                    {/* What's next */}
                    <div className='space-y-4 border-b border-gray-200 py-6 md:hidden'>
                        <p className='font-semibold text-xl'>What's next?</p>
                        <div className='flex flex-col space-y-8'>
                            <div className='flex flex-row space-x-4 items-center w-full'>
                                <AccountBalanceIcon className='text-2xl'/>
                                <div className='flex flex-col'>
                                    <p className='text-md text-sm'>Guest has 3 days to transfer the first month rent and security deposit to nextStay. Otherwise, your sublet will be available again for other users. </p>
                                </div>
                            </div>

                            <div className='flex flex-row space-x-4 items-center w-full'>
                                <SingleBedIcon className='text-2xl'/>
                                <div className='flex flex-col'>
                                    <p className='text-md text-sm'>We will contact you for further information such as keys handoff, move-in procedure and monthly automatic payout account detials etc.</p>
                                </div>
                            </div>

                            <div className='flex flex-row space-x-4 items-center w-full'>
                                <SecurityIcon className='text-2xl'/>
                                <div className='flex flex-col'>
                                    <p className='text-md text-sm'>When guest moves out, we will contact you to make sure everything is okay before returning the security deposit to them.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Got a question */}
                    <div className='flex flex-row border-b border-gray-200 py-6 items-center justify-between md:hidden'>
                        <p className='font-semibold text-xl'>Got a question?</p>
                        <div className='bg-white px-6 py-2 border-2 rounded-md border-black flex flex-col w-fit'>
                            <p className='font-medium'>Contact us</p>
                        </div>
                    </div>

                    {/* Terms of services, privacy and sublease contract */}
                    <div className='flex flex-col space-y-4 border-b border-gray-200 py-6'>
                        <p className='text-slate-600 text-sm'>By selecting Agree and continue, I agree to Nextstay’s Terms of Service, Payments Terms of Service, and Nondiscrimination Policy and acknowledge the Privacy Policy.</p>
                        <div className='w-full flex flex-row grid grid-cols-2 gap-4'>
                            <div onClick={()=>handleTenantAcceptDeclineRequest("true")} className='bg-white py-2 border-2 rounded-md border-black flex flex col justify-center items-center cursor-pointer'>
                                <p className='font-medium'>Decline</p>
                            </div>
                            <div onClick={()=>handleTenantAcceptDeclineRequest("true")} className='bg-black py-2 border-2 rounded-md border-black flex flex col justify-center items-center cursor-pointer'>
                                <p className='font-medium text-white'>Accept</p>
                            </div>
                        </div>
                    </div>
                </div>      
                <div className='hidden md:flex flex-col h-full w-1/2 py-6 items-center'>
                        <div className='w-4/5 rounded-lg border border-gray-200 shadow-lg flex flex-col block flex p-8 space-y-6'>
                            <p className='text-2xl font-medium'>What's next?</p>
                            <div className="space-y-8">
    
                                <div className='flex flex-row space-x-4 items-center'>
                                    <AccountBalanceIcon className='text-2xl'/>
                                    <div className='flex flex-col space-y-1'>
                                        {/* <p className='font-medium'>Pay 1st month rent + security deposit</p> */}
                                        <p className='text-slate-500'>Guest has 3 days to transfer the first month rent and security deposit to nextStay. Otherwise, your sublet will be available again for other users. </p>
                                    </div>
                                </div>

                                <div className='flex flex-row space-x-4 items-center'>
                                    <WeekendIcon className='text-2xl'/>
                                    <div className='flex flex-col space-y-1'>
                                        {/* <p className='font-medium'>Discuss move-in procedures</p> */}
                                        <p className='text-slate-500'>We will contact you for further information such as keys handoff, move-in procedure and monthly automatic payout.</p>
                                    </div>
                                </div>

                                <div className='flex flex-row space-x-4 items-center'>
                                    <VerifiedUserIcon className='text-2xl'/>
                                    <div className='flex flex-col space-y-1'>
                                        {/* <p className='font-medium'>Return of security deposit</p> */}
                                        <p className='text-slate-500'>When guest moves out, we will contact you to make sure everything is okay before returning the security deposit to them.</p>
                                    </div>
                                </div>
                                <div className='flex flex-col justify-between space-y-3'>
                                    <p className='font-medium text-xl'>Got a question?</p>
                                    <div className='bg-white px-6 py-2 border-2 rounded-md border-black flex flex-col w-full justify-center items-center'>
                                        <p className='font-medium'>Contact us</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>      
        </div>
    )
}