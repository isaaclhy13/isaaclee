"use client"
import { useRouter } from 'next/navigation';

//Icon
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useContext, useEffect, useState } from 'react';
import PropertyCard from '@/components/property/propertyCard';

import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import Menu from '@mui/material/Menu';
import { UserContext } from '@/UserContext';
import { LOGGEDINMENUITEMS, MENUITEMS } from '@/constants/sharedUtils';
import NavHeaderBar from '@/components/nav/headerNav';

export default function ManageMySublet(){
    const {user, setUser} = useContext(UserContext)
    const router = useRouter()
    const [sublet, setSublet] = useState([])
    const [loading, setLoading] = useState(false)

    //Profile (Login stuff)
    const [anchorElMenuInput, setAnchorElMenuInput] = useState(null)
    const openProfileMenu = Boolean(anchorElMenuInput);
    

    //Check if the user have posted a sublet
    async function checkIfPostedSublet(){
        let at = localStorage.getItem("at")
        console.log(at)
        let haveProp = false;
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `bearer ${at}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        let result = await fetch("https://nextstay-09a1b7efd58f.herokuapp.com/sublet/mysublet", requestOptions)
        .then( async res => {
            if(res.status == 200){
                let data = await res.json()
                return true
            } else {
                return false
            }
        })
        return result
    }

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

    function handleProfileMenuClose(){
        setAnchorElMenuInput(null)
    }

    async function handleProfileItemClick(item){
        if(item == "Sign up" || item == "Login"){
            handleProfileMenuClose()
            setSignupLoginModel(true)
            return
        }
        else if(item == "Summer sublets"){
            router.replace("/profile/edit")
            return
        }
        else if(item == "My profile"){
            router.push("/profile/edit")
            return
        }
        else if(item == "Logout"){
            handleProfileMenuClose()
            localStorage.clear()
            setUser(null)
            router.refresh("/")
        }
        else if(item == "My sublet"){
            let res = await checkIfPostedSublet()
            if(!res){
                router.push("/profile/posting")
                return
            } else {
                router.push("profile/mySublet")
                return
            }           
        }
        else if(item == "My requests"){
            router.replace("/profile/myRequests")
            return
        }
        else if(item == "Saved"){
            router.push("/profile/saved")
        }
    }

    useEffect(() => {
        retrieveCurrentUserInfo()
        getMySublet()
    }, [])

    function getMySublet(){
        let at = localStorage.getItem("at")
        setLoading(true)
        if(at != null){
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${at}`);

            var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
            };

            fetch("https://nextstay-09a1b7efd58f.herokuapp.com/sublet/mysublet", requestOptions)
            .then( async res => {
                if(res.status == 200){
                    let data = await res.json()
                    setLoading(false)
                    setSublet([data.data])
                }
            })
        }
    }

    function handleDeleteSublet(){
        let at = localStorage.getItem("at")

        if(at == null){
            alert("Please sign in again.")
            return
        }
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `bearer ${at}`);
        
        var requestOptions = {
          method: 'DELETE',
          headers: myHeaders,
          redirect: 'follow'
        };
        
        fetch("https://nextstay-09a1b7efd58f.herokuapp.com/sublet", requestOptions)
        .then(res => {
            if(res.status == 200){
                setSublet([])
            }
            else{
                alert("fail")
            }
        })

    }

    return(
        <div className="flex flex-col items-center ">

            <NavHeaderBar/>

            <div className='mt-[8vh] pt-6 md:w-1/2 items-center flex flex-col w-full px-5 space-y-6'>
                <div className='w-full md:w-1/2'>
                    {sublet.map((item, index) => {
                        return(
                            <PropertyCard key={"propertyCardMySublet" + index} details={item} loading={false} />
                        )
                    })}
                </div>
                <div  onClick={()=>handleDeleteSublet()} className='w-full bg-black p-4 rounded-md flex justify-center items-center md:w-1/2 cursor-pointer'>
                    <p className='text-white'>Delete</p>
                </div>
            </div>
        </div>
    )
}