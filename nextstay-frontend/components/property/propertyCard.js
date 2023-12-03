"use client"

//Icon
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import Fade from '@mui/material/Fade';



//Constants

export default function PropertyCard(prop){
    const propDetails = prop.details
    const tenantDetails = prop.details.tenantInfo
    const router = useRouter()
    const linkRef = useRef(null)
    const [imageIndex, setImageIndex] = useState(0)
    const [navButtons, setNavButtons] = useState(false)
    const [likedSublet, setLikedSublet] = useState(false)
    const [fadeInPropertyCard, setFadeInPropertyCard] = useState(prop.loading)
    const [mySublet, setMySublet]= useState(false)

    useEffect(() => {
        checkIfMySublet()
        checkIfSubletIsLiked()
    }, [])

    function checkIfMySublet(){
        let at = localStorage.getItem("at")

        if( at == null){
            return
        }

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `bearer ${at}`);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        fetch("https://nextstay-09a1b7efd58f.herokuapp.com/sublet/mysublet", requestOptions)
        .then(async (res) => {
            if(res.status == 200){
                let data = await res.json()
                if(data.data._id == propDetails._id){
                    setMySublet(true)
                }
            }
        })
    }

    function handleNavigation(){
        router.push(`/discover/properties/${propDetails._id}`, { scroll: false, details: prop.details  })
    }

    function handleImageScroll(op, e){
        e.stopPropagation();  
        console.log(imageIndex)
        console.log(propDetails.images.length)
        if(op == "+" && imageIndex < propDetails.images.length -1){
            setImageIndex(imageIndex+1)
        }
        else if(op == "-" && imageIndex > 0){
            setImageIndex(imageIndex-1)
        }
    }

    function checkIfSubletIsLiked(){
        let at = localStorage.getItem("at")
        console.log(at)
        if(at == null){
            return;
        } else {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `bearer ${at}`);

            var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
            };

            fetch(`https://nextstay-09a1b7efd58f.herokuapp.com/sublet/didilike/${propDetails._id}`, requestOptions)
            .then( async res => {
                if(res.status == 200){
                    let data = await res.json()
                    if(data.liked == true){
                        setLikedSublet(true)
                    }
                }
            })
        }
    }

    function handleToggleLike(e){
        e.stopPropagation();  
        let at = localStorage.getItem("at")

        if(at == null){
            alert("Please log in first.")
            return
        }

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `bearer ${at}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "subletID": propDetails._id
        });

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("https://nextstay-09a1b7efd58f.herokuapp.com/sublet/like", requestOptions)
        .then(res => {
            if(res.status == 200){
                setLikedSublet(!likedSublet)
            }
        })
    }



    return(
        <div className=''>
        {!prop.loading ? 
            <Fade in={true}>
                <div className={` w-full shadow-md rounded-lg cursor-pointer`}>
                    <div onMouseEnter={()=>setNavButtons(true)} onMouseLeave={()=>setNavButtons(false)} onClick={()=> linkRef.current.click()} className="relative">
                        <div className="relative w-full">
                                <div className="relative overflow-hidden rounded-tl-lg rounded-tr-lg h-80 md:h-72 z-1">
                                { propDetails?.images.map((item, index) => {
                                    return (
                                        <div key={"propertyCardImages" + item.url} className={`${index == imageIndex ? "block" :'hidden'} duration-700 ease-in-out h-80 md:h-72`}>
                                            <img src={item.url} alt="Sublet image" className="absolute w-full h-80 md:h-72 flex -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 object-cover"/>
                                        </div>
                                    )   
                                })
                                }
                            </div>
                        </div>

                        {/* Favorite Icon */}
                        {!mySublet &&
                        <div onClick={(e)=> handleToggleLike(e)} className='absolute top-5 right-5' >
                            {likedSublet ?
                                <FavoriteIcon className='text-red-200'/>
                            :
                                <FavoriteBorderIcon className='text-gray-300'/>
                            }
                        </div>
                        }

                        <div onClick={(e)=> handleImageScroll("-", e)} className={`transition-opacity ${navButtons ? "opacity-100" : "opacity-0"} absolute left-2 top-1/2 transform -translate-y-1/2 shadow-md`}>
                            <div className='h-8 w-8 rounded-full bg-white hover:flex items-center justify-center flex cursor-pointer z-50'>
                                <ChevronLeftIcon className='text-black text-md text-gray-600'/>
                            </div>
                        </div>

                        <div onClick={(e)=> handleImageScroll("+", e)} className={`transition-opacity ${navButtons ? "opacity-100" : "opacity-0"} absolute right-2 top-1/2 transform -translate-y-1/2 shadow-md`}>
                            <div className='h-8 w-8 rounded-full bg-white hover:flex items-center justify-center flex cursor-pointer z-50'>
                                <ChevronRightIcon className='text-black text-md text-gray-600'/>
                            </div>
                        </div>
                        <div className='absolute left-[5%] bottom-[5%] h-[9vh] w-[9vh] rounded-full border-2 border-white'>
                            <img src={tenantDetails.image.url}  className="w-full h-full rounded-full object-cover"/>
                        </div>
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2  flex flex-row space-x-2">
                            { propDetails?.images.map((item, index) => {
                                return (
                                    <div key={"propImageGalleryDots" + index} className={`h-2 w-2 rounded-full ${imageIndex == index ? "bg-white" : "bg-gray-400"}`}>
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>
                    <div className="tflex flex-row items-center py-3 px-4 justify-left space-x-4">
                        <div className="flex flex-col align-left space-y-2 ">
                            <div className='space-y-1'>
                                <p className="font-medium text-black leading-tight text-sm font-medium md:text-regular line-clamp-1"> {propDetails.type} at {propDetails.location.secondary_text}</p>
                                <p className="font-medium text-gray-500 leading-tight text-sm font-medium md:text-xs line-clamp-1">{new Date(propDetails.from).toLocaleDateString('en-us',{month:'short', day:'numeric'})} - {new Date(propDetails.to).toLocaleDateString('en-us',{month:'short', day:'numeric'})}</p>
                            </div>
                            <p className="text-sm text-black leading-tight md:text-xs line-clamp-1"><span className='font-medium'>${propDetails.rent}</span>  monthly</p>                
                        </div>
                    </div>
                    <Link ref={linkRef} href={`/discover/properties/${propDetails._id}`} rel="noopener noreferrer" target="_blank" className='hidden'></Link>
                </div>
            </Fade>
            :
            <div className="animate-pulse w-full shadow-lg rounded-lg">
                <div className="relative border-white border">
                    
                    <img src={null} className="w-full h-72 rounded-tl-lg rounded-tr-lg bg-slate-200 border border-white md:h-64"/>
                </div>
                <div className="flex flex-row items-center py-4">
                   
                    <div className="flex flex-col align-left w-full space-y-1 px-5">
                        
                        <div className="font-semibold text-gray-700 text-md w-16 bg-slate-200 h-5 w-full rounded-full"></div>
                        <div className="font-semibold text-gray-700 text-md w-16 bg-slate-200 h-5 w-1/2 rounded-full"></div>
                        <div className="font-semibold text-gray-700 text-md w-16 bg-slate-200 h-5 w-1/2 rounded-full"></div>        
                    </div>
                </div>
            </div> 
        }
        </div>
    )
}