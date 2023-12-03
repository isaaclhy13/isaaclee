"use client"
import { useRouter } from 'next/navigation';

//Icon
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useContext, useEffect, useState } from 'react';

import Menu from '@mui/material/Menu';
import { UserContext } from '@/UserContext';
import { LOGGEDINMENUITEMS, MENUITEMS } from '@/constants/sharedUtils';

import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function NavHeaderBar(){
    const {user, setUser} = useContext(UserContext)
    const router = useRouter()

    //Profile (Login stuff)
    const [anchorElMenuInput, setAnchorElMenuInput] = useState(null)
    const openProfileMenu = Boolean(anchorElMenuInput);


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

    //Open up the menu 
    function handleProfileClick(event){
        setAnchorElMenuInput(event.currentTarget);
    }

    //Close the menu 
    function handleProfileMenuClose(){
        setAnchorElMenuInput(null)
    }

    async function handleProfileItemClick(item){
        if(item == "Sign up / Login"){
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

    return (
        <>
            <div onClick={()=> router.back()} className="md:hidden fixed w-full px-[5%] h-[8vh] items-center flex shadow-md bg-white z-50">
                <ChevronLeftIcon className='cursor-pointer' />
            </div>
            {/* Header  */}
            <div className="border-b border-gray-200 flex flex-row justify-between items-center relative w-full md:justify-between md:space-x-2 md:h-[12vh] md:px-[5%]">

                {/* Left logo image (Only availble for web) */}
                <div onClick={()=>router.push("/")} className="w-1/3 hidden md:block cursor-pointer">
                    <img src={"/logo.png"} className="h-8"/>
                </div>

                
                {/* Profile and Menu (Only available for web) */}
                <div className="hidden md:flex md:w-1/3 justify-end flex-row">
                    {user == null ?
                        <div className="space-x-6 flex flex-row items-center justify-between">
                            <p  className="text-slate-700 cursor-pointer text-sm font-medium">Sublet your place</p>
                            <div className="flex flex-row space-x-2 items-center justify-between rounded-full border border-slate-400 px-2 py-1 cursor-pointer">
                                <MenuIcon className="text-md text-slate-700" />
                                <AccountCircleIcon className="text-3.5xl text-slate-800"/>
                            </div>
                        </div>
                        :
                        <div className="space-x-6 flex flex-row items-center justify-between">
                            <p  className="text-slate-700 cursor-pointer text-sm font-medium">Sublet your place</p>
                            <div onClick={(e)=> handleProfileClick(e)} className="flex flex-row space-x-2 items-center justify-between rounded-full border border-slate-400 px-2 py-1 cursor-pointer">
                                <MenuIcon className="text-md text-slate-700" />
                                <img src={user.image.url} alt="user img" className="w-9 h-9 rounded-full object-cover border border-gray-200"/>
                            </div>
                        </div>
                    }
                    <Menu
                    disableScrollLock
                    anchorEl={anchorElMenuInput}
                    open={openProfileMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    onClose={() => handleProfileMenuClose()}
                    PaperProps={{
                        style: {
                            marginTop: '1%',
                            borderRadius: 10
                        }
                    }}
                    MenuListProps={{
                    style: {
                        padding: 0,
                    },
                    }}
                    >   {user == null ?
                        <div>
                            {MENUITEMS.map((item)=> {
                                return(
                                <div key={"menuItems" + item.name} onClick={()=>handleProfileItemClick(item.name)} className="bg-white hover:bg-gray-200 w-60 py-4 flex justify-start items-center px-5 border-b border-gray-200 cursor-pointer">
                                    <p className="text-slate-600 text-sm">{item.name}</p>
                                </div>
                                )
                            })}
                        </div>
                        :
                        <div>
                            {LOGGEDINMENUITEMS.map((item)=> {
                                return(
                                <div key={"loggedinmenuItems" + item.name} onClick={()=>handleProfileItemClick(item.name)} className="bg-white hover:bg-gray-200 w-60 py-4 flex justify-start items-center px-5 border-b border-gray-200 cursor-pointer">
                                    <p className="text-slate-600 text-sm">{item.name}</p>
                                </div>
                                )
                            })}
                        </div>
                        }
                    </Menu>
                </div>
            </div>
        </>
    )
}