"use client"
import { usePathname } from "next/navigation"

import { Urbanist } from 'next/font/google';
const urbanist = Urbanist({ subsets: ['latin'] })

//Icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CheckIcon from '@mui/icons-material/Check';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WeekendIcon from '@mui/icons-material/Weekend';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LockIcon from '@mui/icons-material/Lock';
import DateSelectModal from "@/components/property/dateSelectModal";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GuestSelectModal from "@/components/property/guestSelectModal";
import { data } from "autoprefixer";
import LoadingDots from "@/components/loadingDots";
import NotificaitonModal from "@/components/notification/notificaitonModal";

export default function RequestToBookConfirmationPage(){
    const router = useRouter()
    const pathname = usePathname()
    const [loading, setLoading] = useState(false)
    const [dateRange, setDateRange] = useState({startDate: null, endDate:  null , key:"selection"})
    const [numberOfGuests, setNumberOfGuests] = useState(1)
    const [paymentSchedules, setPaymentSchedules] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)
    const [introduction, setIntroduction] = useState("")

    const [dateSelectionModal, setDateSelectionModal] = useState(false)
    const [guestSelectModal, setGuestSelectModal] = useState(false)

    const [requestSuccessModal, setRequestSuccessModal] = useState(false)

    useEffect(()=> {
        getRequestDates()
        getRentPreview()
    }, [])

    function getRequestDates(){
        let urlParts = pathname.split("/")
        let dateParts = urlParts[urlParts.length-1].split("&")
        let startDate = new Date(parseInt(dateParts[0].split("start=")[1]))
        let endDate = new Date(parseInt(dateParts[1].split("end=")[1]))
        setDateRange({startDate: startDate, endDate: endDate, key: "selection"})
    }

    function getRentPreview(){
        let urlParts = pathname.split("/")
        let subletId = urlParts[urlParts.length-2]
        let dateParts = urlParts[urlParts.length-1].split("&")
        let startDate = new Date(parseInt(dateParts[0].split("start=")[1]))
        let endDate = new Date(parseInt(dateParts[1].split("end=")[1]))

        let at = localStorage.getItem("at")

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${at}`);
        
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
        console.log(subletId)

        fetch(`https://nextstay-09a1b7efd58f.herokuapp.com/sublet/paymentschedule?sid=${subletId}&from=${startDate}&to=${endDate}`, requestOptions)
        .then( async res => {
            if(res.status == 200){
                const data = await res.json()
                console.log(data.data)
                getTotalAmount(data.data)
                setPaymentSchedules(data.data)
            }
        })
    }

    function handleRequestToBook(){
        setLoading(true)
        let urlParts = pathname.split("/")
        let subletId = urlParts[urlParts.length-2]
        var myHeaders = new Headers();
        let uid = localStorage.getItem("uid")
        let dateParts = urlParts[urlParts.length-1].split("&")
        let startDate = new Date(parseInt(dateParts[0].split("start=")[1]))
        let endDate = new Date(parseInt(dateParts[1].split("end=")[1]))
        let at = localStorage.getItem("at")
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${at}`);

        var raw = JSON.stringify({
        "subtenantId": uid,
        "subletId": subletId,
        "from": startDate,
        "to": endDate,
        "message": introduction,
        "num_guests": numberOfGuests
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("https://nextstay-09a1b7efd58f.herokuapp.com/request", requestOptions)
        .then( async res => {
            if(res.status == 200){
                const data = await res.json()
                console.log(data)
                setLoading(false)
                setRequestSuccessModal(true)
            }
            else{
                setLoading(false)
                alert("Error occured.")
                router.replace("/")
            }
        })

    }

    function getTotalAmount(items){
        let total = 0;
        items.map((item) => {
            total = total + item.amount
        })
        setTotalAmount(total)
    }

    return(
        <div className="flex flex-col">
            <div className="hidden md:flex flex-row justify-between items-center relative w-full md:justify-between md:space-x-2 h-[12vh] px-[10%]">
                <div className="flex flex-row justify-between items-center relative w-full md:justify-between md:space-x-2 md:h-[12vh]">
                    <div className="w-1/3 hidden md:block">
                        <img onClick={()=>router.replace("/")} src={"/logo.png"} className="h-8 cursor-pointer"/>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:px-[10%]">
                <div onClick={()=> router.back()} className="py-4 px-5 md:px-0 flex flex-row cursor-pointer md:space-x-3">
                    <ChevronLeftIcon className="cursor-pointer"/>
                    <p className='font-medium '>Back to sublet</p>
                    <ChevronLeftIcon className="opacity-0 md:hidden"/>
                </div>
                <div className="flex flex-col md:flex-row">
                    <div className="flex flex-col w-full md:w-1/2">
                        <div className="py-6 px-5 border-b-4 border-gray-200 space-y-6">
                            <p className="text-2xl font-semibold">Request details</p>
                            <div className='flex flex-col space-y-1'>
                                <div className='flex flex-row  justify-between'>
                                    <p className='font-semibold'>Dates</p>
                                    <p onClick={()=> setDateSelectionModal(true)} className='font-md text-slate-600 cursor-pointer'>Edit</p>
                                </div>
                                <p className='font-md text-slate-500'>{new Date(dateRange.startDate).toLocaleDateString('en-us',{month:'short', day:'numeric'})} - {new Date(dateRange.endDate).toLocaleDateString('en-us',{month:'short', day:'numeric'})}</p>
                            </div>
                            <div className='flex flex-col space-y-1'>
                                <div className='flex flex-row  justify-between'>
                                    <p className='font-semibold'>Guests</p>
                                    <p onClick={()=> setGuestSelectModal(true)} className='font-md text-slate-500 cursor-pointer'>Edit</p>
                                </div>
                                <p className='font-md text-slate-500'>{numberOfGuests} guests</p>
                            </div>
                        </div>

                        <div className="py-6 px-5 border-b-4 border-gray-200 space-y-6">
                            <div>
                                <p className="text-2xl font-semibold">Rent preview</p>
                                <p className='font-md text-slate-500'>You won't be charged right now</p>
                                <div>
                                    {paymentSchedules.map((item, index) => {
                                        return (
                                            <div className="w-full flex flex-col py-3">
                                                <div className="flex flex-row w-full justify-between items-center">
                                                    <p>Month {index+1} {index == 0 ? " + security deposit" : ""}</p>
                                                    <p className="text-sm font-medium">${item.amount.toFixed(2)}</p>
                                                </div>
                                                <p className="text-slate-500 text-sm">{new Date(item.from).toLocaleDateString('en-us',{month:'short', day:'numeric'})} - {new Date(item.to).toLocaleDateString('en-us',{month:'short', day:'numeric'})}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="w-full flex flex-col border-t border-gray-200 pt-6">
                                    <div className="flex flex-row w-full justify-between items-center">
                                        <p className="font-medium">Total amount</p>
                                        <p className="font-medium">${totalAmount.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="py-6 px-5 border-b-4 border-gray-200 space-y-6 w-full md:hidden">
                            
                            <p className="text-2xl font-semibold">What's next?</p>
                            <div className="space-y-8">
                                <div className='flex flex-row space-x-4 items-center'>
                                    <CheckIcon className='text-2xl'/>
                                    <div className='flex flex-col space-y-1'>
                                        <p className='font-semibold'>Await tenant’s approval</p>
                                        <p className='text-gray-500'>Once requested, the tenant has 3 days to approve or reject your request. The request automatically expires after 3 days</p>
                                    </div>
                                </div>

                                <div className='flex flex-row space-x-4 items-center'>
                                    <AccountBalanceIcon className='text-2xl'/>
                                    <div className='flex flex-col space-y-1'>
                                        <p className='font-semibold'>Pay 1st month rent + security deposit</p>
                                        <p className='text-gray-500'>Once approved, you will be notified and given 3 days to pay either through ACH or credit card on our website</p>
                                    </div>
                                </div>

                                <div className='flex flex-row space-x-4 items-center'>
                                    <WeekendIcon className='text-2xl'/>
                                    <div className='flex flex-col space-y-1'>
                                        <p className='font-semibold'>Discuss move-in procedures</p>
                                        <p className='text-gray-500'>We will provide you with the tenant’s contact information to further discuss move-in procedure and keys pick-up</p>
                                    </div>
                                </div>

                                <div className='flex flex-row space-x-4 items-center'>
                                    <VerifiedUserIcon className='text-2xl'/>
                                    <div className='flex flex-col space-y-1'>
                                        <p className='font-semibold'>Return of security deposit</p>
                                        <p className='text-gray-500'>nextStay will transfer your security deposit back to your original payment method at the end of the sublease assuming no damage has been done</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="py-6 px-5 border-b-4 border-gray-200 space-y-6">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-2xl font-semibold">Introduce yourself</p>
                                    <p className='text-slate-500'>Add a self intro for the tenant, be sure to include your reason of subletting and a but about yourself</p>
                                </div>
                                <textarea value={introduction} onChange={(val) => setIntroduction(val.target.value)} type='text' className='w-full border-2 border-gray-200 rounded-md p-2 h-[20vh] align-top' placeholder="Introduce yourself..." />
                            </div>    
                        </div>

                        <div className="py-6 px-5 border-b-4 border-gray-200 space-y-6">
                            
                            <p className="text-2xl font-semibold text-[#2390FF]"><span className={`${urbanist.className} text-black`}>nextstay</span> Secure</p>
                            <div className='flex flex-row space-x-4 items-center'>
                                <LockIcon className='text-ld'/>
                                <p className='text-sm text-slate-600'>Your request won’t be confirmed until the host accepts your request. You will not be charged.</p>
                                
                            </div>
                            <div className='flex flex-row space-x-4 items-center'>
                                <AccountBalanceIcon className='text-ld'/>
                                <p className='text-sm text-slate-600'>Once tenant approves, we undergo an background and lease verification to ensure your safety</p>
                            </div>
                            
                        </div>

                        <div className="py-6 px-5 space-y-6">
                            <p className='font-md text-xs text-gray-600'>By clicking "Request to Book", I state that I have read and understood the terms and conditions. Using a clickwrap method may better protect a business because a user must take proactive measures to agree to terms and conditions. You can review the sublease contract here.</p>
                            <div onClick={()=> handleRequestToBook() } className="w-full md:w-fit md:px-6 py-4 bg-gradient-to-r from-[#2390FF] to-[#174AFE] rounded-md items-center justify-center flex cursor-pointer h-12">
                                {loading ?
                                <LoadingDots/>
                                :
                                <p className='font-semibold text-white'>Request to Book</p>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:flex md:flex-col md:w-1/2 items-end space-y-6">
                        <div className='w-4/5 rounded-lg border border-gray-200 shadow-lg flex flex-col block flex p-8 space-y-6'>
                            <p className='text-2xl font-medium'>What's next?</p>
                            <div className="space-y-8">
                                <div className='flex flex-row space-x-4 items-center'>
                                    <CheckIcon className='text-2xl'/>
                                    <div className='flex flex-col space-y-1'>
                                        <p className='font-medium'>Await tenant’s approval</p>
                                        <p className='text-slate-500'>The tenant has 3 days to approve or reject your request.</p>
                                    </div>
                                </div>

                                <div className='flex flex-row space-x-4 items-center'>
                                    <AccountBalanceIcon className='text-2xl'/>
                                    <div className='flex flex-col space-y-1'>
                                        <p className='font-medium'>Pay 1st month rent + security deposit</p>
                                        <p className='text-slate-500'>Once approved, you will be notified and given 3 days for payment</p>
                                    </div>
                                </div>

                                <div className='flex flex-row space-x-4 items-center'>
                                    <WeekendIcon className='text-2xl'/>
                                    <div className='flex flex-col space-y-1'>
                                        <p className='font-medium'>Discuss move-in procedures</p>
                                        <p className='text-slate-500'>Once paid, We will provide you with move-in procedure, key pick up dates and all the essentials</p>
                                    </div>
                                </div>

                                <div className='flex flex-row space-x-4 items-center'>
                                    <VerifiedUserIcon className='text-2xl'/>
                                    <div className='flex flex-col space-y-1'>
                                        <p className='font-medium'>Return of security deposit</p>
                                        <p className='text-slate-500'>nextStay will return your security deposit within a week from the end of the sublease assuming no damage has been done</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='w-4/5 rounded-lg border border-gray-200 shadow-lg flex flex-col block flex p-8 space-y-6'>
                            <p className='text-2xl font-medium'>Got a question?</p>
                            <div className="w-full py-3 border-black border rounded-md items-center justify-center flex cursor-pointer">
                                <p className='font-medium text-black'>Contact us</p>
                            </div>
                        </div>
                    </div>
                </div>
                <DateSelectModal edit={true} dateRange={dateRange} setDateRange={setDateRange} dateSelectionModal={dateSelectionModal} closeDateSelectionModal={()=>setDateSelectionModal(false)}/>
                <GuestSelectModal numberOfGuests={numberOfGuests} setNumberOfGuests={setNumberOfGuests} guestSelectModal={guestSelectModal} closeGuestSelectModal={()=> setGuestSelectModal(false)} />
                <NotificaitonModal requestSuccessModal={requestSuccessModal} handleClose={()=>setRequestSuccessModal(false)}/>
            </div>
        </div>
    )
}