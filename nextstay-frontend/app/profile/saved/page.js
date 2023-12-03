"use client"
import { useRouter } from 'next/navigation';

//Icon
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import Menu from '@mui/material/Menu';

import { useContext, useEffect, useState } from 'react';
import PropertyCard from '@/components/property/propertyCard';
import { UserContext } from '@/UserContext';
import { LOGGEDINMENUITEMS, MENUITEMS } from '@/constants/sharedUtils';
import NavHeaderBar from '@/components/nav/headerNav';

export default function MySavedScreen(){
    const {user, setUser} = useContext(UserContext)
    const router = useRouter()
    const [savedSublets, setSavedSublets] = useState([])
    const [loading, setLoading] = useState(false)

    //Profile (Login stuff)
    const [anchorElMenuInput, setAnchorElMenuInput] = useState(null)
    const openProfileMenu = Boolean(anchorElMenuInput);

    useEffect(()=> {
        retrieveCurrentUserInfo()
        getAllSavedSublets()
    }, [])

    function retrieveCurrentUserInfo(){
        console.log("retrieving")
        let at = localStorage.getItem("at")
        let uid = localStorage.getItem("uid")       

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
                }
            })
        }
        else {
            setUser(null)
        }
    }

    function getAllSavedSublets(){
        let at = localStorage.getItem("at")
        if(at == null){
            router.push("/profile")
            return 
        }
        setLoading(true)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `bearer ${at}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch("https://nextstay-09a1b7efd58f.herokuapp.com/user/mylikes", requestOptions)
        .then(async (res) => {
            if(res.status == 200){
                let data = await res.json()
                console.log("DATA", data.data)
                setSavedSublets(data.data)
                setLoading(false)
            }
        })
    }

    

    return(
        <div className="flex flex-col">
                
            {/* Header  */}
            <NavHeaderBar/>
     
            

            {/* Page Content goes inside */}
            <div className=' py-6 px-[5%] w-full space-y-6'>
                <p className='font-semibold text-md'>Saved properties</p>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
                    {
                        savedSublets.map((item, index) => {
                            return(
                                <PropertyCard key={"savedSublets" + index} details={item} loading={loading}/>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}