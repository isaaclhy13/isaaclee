"use client"
import { useRouter } from 'next/navigation';

//Icon
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useEffect, useState } from 'react';
import RequestCard from '@/components/requests/requestCard';
import RequestSentCard from '@/components/requests/requestSentCard';
import NavHeaderBar from '@/components/nav/headerNav';



export default function MyRequestsScreen(){
    const router = useRouter()
    const [pageIndex, setPageIndex] = useState(0)
    const [requestsReceived, setRequestReceived] = useState([])
    const [requestsSent, setRequestsSent] = useState([])
    useEffect(() => {
        getMySublet()
        fetchSentRequests()
        // fetchReceivedRequests()
    }, [])

    function getMySublet(){
        let at = localStorage.getItem("at")
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `bearer ${at}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch("https://nextstay-09a1b7efd58f.herokuapp.com/sublet/mysublet", requestOptions)
        .then( async res => {
            if(res.status == 200){
                let data = await res.json()
                if(data != null){
                    fetchReceivedRequests(data.data._id)
                }
            }
        })
    }

    function fetchReceivedRequests(subletID){
        var myHeaders = new Headers();
        let at = localStorage.getItem("at")
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${at}`);

        
        var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
        };
       
        fetch(`https://nextstay-09a1b7efd58f.herokuapp.com/request/received/${subletID}`, requestOptions)
        .then( async res => {
            if(res.status == 200){
                const data = await res.json()
                console.log(data)
                setRequestReceived(data.data)
            } else {
                alert('Error occured. Please try again later')
            }
        })
    }

    function fetchSentRequests(){
        let uid = localStorage.getItem("uid")
        var myHeaders = new Headers();
        let at = localStorage.getItem("at")
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${at}`);

        
        var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
        };
       
        
        fetch(`https://nextstay-09a1b7efd58f.herokuapp.com/request/sent/${uid}`, requestOptions)
        .then( async res => {
            if(res.status == 200){
                const data = await res.json()
                setRequestsSent(data.data)
            } else {
                alert('Error occured. Please try again later')
            }
        })
    }
    return(
        <div className="flex flex-col w-full">
            <NavHeaderBar/>
            <div onClick={()=> router.replace("/")} className="md:hidden fixed w-full px-[5%] h-[10vh] items-center flex shadow-md bg-white z-50">
                <ChevronLeftIcon className='cursor-pointer' />
            </div>
            <div className='mt-[10vh] md:mt-[0] pt-6 pb-4 px-[5%] w-full'>
                <p className='font-semibold text-md'>My requests</p>
            </div>
            <div className='px-[5%]'>
                <div className='flex flex-row space-x-3'>
                    <div onClick={()=> setPageIndex(0)} className={`px-3 py-3 ${pageIndex == 0 ? 'bg-black border-black' : 'bg-white border-gray-200'} border rounded-md cursor-pointer`}>
                        <p className={`font-medium ${pageIndex == 0 ? 'text-white' : 'text-black'}`}>Requests received</p>
                    </div>
                    <div onClick={()=> setPageIndex(1)} className={`px-3 py-3 ${pageIndex == 1 ? 'bg-black border-black' : 'bg-white border-gray-200'} border rounded-md cursor-pointer`}>
                        <p className={`font-medium ${pageIndex == 1 ? 'text-white' : 'text-black'}`}>Requests sent</p>
                    </div>
                </div>
                {pageIndex == 0 ?
                    <div className='gap-6 grid grid-cols-1 md:grid-cols-3 w-full flex py-8'>
                        {requestsReceived.map((item) => {
                            return (
                                
                                
                                <RequestCard details={item}/>
                            
                            )
                        })}
                        
                    </div>
                :
                    <div className='grid grid-cols-1 md:grid-cols-3 w-full flex py-8 gap-6'>
                        {
                            requestsSent.map((item) => {
                                return (
                                    <RequestSentCard details={item}/>
                                )
                            })
                        }
                    </div>
                }
            </div>
        </div>
    )
}