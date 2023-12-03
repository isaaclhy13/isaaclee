"use client"

//Icon
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PersonIcon from '@mui/icons-material/Person';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

//Const
import { GENDERS } from '@/constants/sharedUtils';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import Select from 'react-select'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'


export default function EditProfilePage(){
    const router = useRouter()
    const [userInfo, setUserInfo] = useState(null)
    const [editingIndex, setEditingIndex] = useState(null)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [gender, setGender] = useState('')
    const [phoneNumber, setPhoneNumber] = useState("+1 6089991395")
    const [profilePic, setProfilePic] = useState(null)
    const [email, setEmail] = useState('')
    const profilePicInputRef = useRef(null)
    const [instagram, setInstagram] = useState('')
    const [linkedin, setLinkedin] = useState('')

    //Edit
    const [editFirstName, setEditFirstName] = useState('')
    const [editLastName, setEditLastName] = useState('')


    useEffect(()=> {
        getCurrentUserInfo()
    }, [])

    function getCurrentUserInfo(){
        let at = localStorage.getItem("at")
        let uid = localStorage.getItem("uid")

        fetch(`https://nextstay-09a1b7efd58f.herokuapp.com/user/${uid}`, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + at
            },
        })
        .then( async res => {
            if(res.status == 200){
                let data = await res.json()
                setUserInfo(data.data)
            
                setProfilePic({file: data.data.image, imageURL:data.data.image.url})
                setFirstName(data.data.firstName)
                setLastName(data.data.lastName)
                setGender(data.data.gender)
                setEmail(data.data.email)
                setSocialHandles(data.data.social_handles[0])
            }
        })

    }
    
    function setSocialHandles(items){
       
        Object.entries(items).map((item,index)=>{
            console.log(item)
            if(item[0] == "instagram"){
                setInstagram(item[1])
            } else if(item[0] == "facebook"){
                setLinkedin(item[1])
            }
        })
    }

    function handleEditIndexChange(index){
        if(editingIndex != null) { 
            setEditingIndex(null) 
        } else {
            setEditingIndex(parseInt(index))
        }
    }

    function handleProfilePicClick(){
        profilePicInputRef.current.click()
    }

    function handleProfilePicChange(e){
        setProfilePic({"file": e.target.files[0], "imageURL": URL.createObjectURL(e.target.files[0])})

        //Change it in the backend
    }

    function handleProfileChanges(field){
        if (field == "name"){

        }
    }

    return(
        <div className="flex w-full ">
            <div onClick={()=> router.back()} className="fixed w-full px-[5%] h-[10vh] items-center flex shadow-md bg-white z-50">
                <ChevronLeftIcon className='cursor-pointer' />
            </div>
            <div className='mt-[10vh] py-8 px-[5%] w-full'>
                <p className='font-semibold text-md md:text-2xl'>About you</p>
                <div className='w-full flex flex-row pt-6'>
                    <div className='w-full md:w-2/6 hidden md:flex flex-col items-center space-y-12' >
                        <div className='w-full'>
                            <div className='w-full justify-center items-center flex cursor-pointer'>
                                <div onClick={()=>handleProfilePicClick()} className='h-[30vh] w-[30vh] rounded-full bg-gray-200 border border-gray-200 flex justify-center items-center'>
                                    {profilePic == null ? 
                                        <div className='flex flex-col justify-center items-center'>
                                            <PersonIcon className='text-gray-400 text-3xl'/>
                                            <p className='font-medium text-xs text-gray-400'>Add image</p>
                                        </div>
                                        :
                                        <div className='relative w-full h-full rounded-full'>
                                            <div onClick={()=>handleProfilePicClick()} className='absolute -bottom-5 left-1/2 translate -translate-x-1/2 border border-gray-200 bg-white shadow-lg px-3 py-1 rounded-full flex flex-row items-center space-x-2'>
                                                <PhotoCameraIcon className='text-md'/>
                                                <p className=' font-medium' >Edit</p>
                                            </div>
                                            <img src={profilePic.imageURL} className='w-full h-full rounded-full object-cover'/>
                                        </div>
                                    }
                                    <input type="file" ref={profilePicInputRef} name="files" className="hidden" onChange={(e) => handleProfilePicChange(e)}/>
                                </div>
                            </div>
                        </div>
                        <div className='w-4/5 rounded-lg border border-gray-200 shadow-lg flex flex-col block flex p-6 space-y-6'>
                            <p className='text-lg font-medium'>Verify these information to get better results</p>
                        </div>
                    </div>
                    <div className='w-full md:w-4/6'>
                        {/* Profile Picture */}
                        <div className='py-6 w-full justify-center items-center flex cursor-pointer md:hidden'>
                            <div onClick={()=>handleProfilePicClick()} className='h-[20vh] w-[20vh] rounded-full bg-gray-200 border border-gray-200 flex justify-center items-center'>
                                {profilePic == null ? 
                                    <div className='flex flex-col justify-center items-center'>
                                        <PersonIcon className='text-gray-400 text-3xl'/>
                                        <p className='font-medium text-xs text-gray-400'>Add image</p>
                                    </div>
                                    :
                                    <div className='relative w-full h-full rounded-full'>
                                        <div onClick={()=>handleProfilePicClick()} className='absolute -bottom-5 left-1/2 translate -translate-x-1/2 border border-gray-200 bg-white shadow-lg px-3 py-1 rounded-full flex flex-row items-center space-x-2'>
                                            <PhotoCameraIcon className='text-md'/>
                                            <p className=' font-medium' >Edit</p>
                                        </div>
                                        <img src={profilePic.imageURL} className='w-full h-full rounded-full object-cover'/>
                                    </div>
                                }
                                <input type="file" ref={profilePicInputRef} name="files" className="hidden" onChange={(e) => handleProfilePicChange(e)}/>
                            </div>
                        </div>
                        {/* Legal name = */}
                        <div className='pb-4 md:py-6 border-b border-gray-200 w-full'>
                            <div className='w-full flex justify-between flex-row items-center'>
                                <p>Legal name</p>
                                <p onClick={()=>handleEditIndexChange(0)} className='underline text-black font-medium cursor-pointer'>{editingIndex != null && editingIndex == 0 ? "Cancel" : "Edit"}</p>
                            </div>
                            <p className='text-gray-500 text-sm w-4/6'>{editingIndex != null && editingIndex == 0  ? "Please enter your legal name shown on ID and passport." : firstName + " " + lastName}</p>
                            {editingIndex != null && editingIndex == 0 &&
                            <>
                                <div className='mt-4 space-y-2 flex flex-col'>
                                    <input value={editFirstName} onChange={(val)=> setEditFirstName(val.target.value)} className='w-full md:w-2/6 border-gray-200 border py-3 px-2 focus:border-black outline-none rounded-md' placeholder='First name'/>
                                    <input value={editLastName} onChange={(val)=> setEditLastName(val.target.value)} className='w-full md:w-2/6 border-gray-200 border py-3 px-2 focus:border-black outline-none rounded-md' placeholder='Last name'/>
                                </div>
                                <div className='flex mt-6'>
                                    <div onClick={()=>handleProfileChanges('name')} className='rounded-md bg-black px-6 py-3 flex justify-center items-center cursor-pointer outline-none'>
                                        <p className='text-white font-semibold'>Done</p>
                                    </div>
                                </div>
                            </>
                            }
                        </div> 
                        {/* Gender */}
                        <div className='py-4 md:py-6 border-b border-gray-200 w-full'>
                            <div className='w-full flex justify-between flex-row items-center'>
                                <p>Gender</p>
                                <p onClick={()=>handleEditIndexChange(1)} className='underline text-black font-medium cursor-pointer'>{editingIndex != null && editingIndex == 1 ? "Cancel" : "Edit"}</p>
                            </div>
                            <p className='text-gray-500 text-sm w-4/6'>{editingIndex != null && editingIndex == 1  ? "Please select the gender you're identified as." : gender}</p>
                            {editingIndex != null && editingIndex == 1 &&
                            <>
                                <div className='mt-4 space-y-2 md:w-2/6'>
                                    <Select inputProps={{readOnly:true}} isSearchable={ false } options={GENDERS} placeholder="Gender" styles={{ control: base => ({ ...base, color:'red', cursor:'pointer',borderColor: "#D9D9D9", borderRadius:'0.375rem', outline:'none', boxShadow: 'none', paddingTop: '0.5rem', paddingBottom: '0.5rem', flex: 1, fontSize: '1rem', color:'red', '&:hover': { borderStyle:'solid', borderColor:'black'} })}}/>                      
                                </div>
                                <div className='flex mt-6'>
                                    <div className='rounded-md bg-black px-6 py-3 flex justify-center items-center cursor-pointer outline-none'>
                                        <p className='text-white font-semibold'>Done</p>
                                    </div>
                                </div>
                            </>
                            }
                        </div>
                        {/* Phone number */}
                        <div className='py-4 md:py-6 border-b border-gray-200 w-full'>
                            <div className='w-full flex justify-between flex-row items-center'>
                                <p>Phone number</p>
                                <p onClick={()=>handleEditIndexChange(2)} className='underline text-black font-medium cursor-pointer'>{editingIndex != null && editingIndex == 2 ? "Cancel" : "Edit"}</p>
                            </div>
                            <p className='text-gray-500 text-sm w-4/6'>{editingIndex != null && editingIndex == 2  ? "We will contact you for any future communications." :"+1 6089991395"}</p>
                            {editingIndex != null && editingIndex == 2 &&
                            <>
                                <div className='mt-4 space-y-2 flex flex-row'>
                                <PhoneInput
                                    inputStyle={{height:50, fontSize:'1rem', '&:focus': { borderStyle:'solid', borderColor:'black'}}}
                                    containerStyle={{height:50, sbackgroundColor:'white', width:60,  '&:focus': { borderStyle:'solid', borderColor:'black'}}}
                                    
                                    country={'us'}
                                    value={phoneNumber}
                                    onChange={phone => setPhoneNumber(phone)}
                                />                      
                                </div>
                                <div className='flex mt-6'>
                                    <div className='rounded-md bg-black px-6 py-3 flex justify-center items-center cursor-pointer outline-none'>
                                        <p className='text-white font-semibold'>Done</p>
                                    </div>
                                </div>
                            </>
                            }
                        </div>
                        {/* Instagram */}
                        <div className='py-4 md:py-6 border-b border-gray-200 w-full'>
                            <div className='w-full flex justify-between flex-row items-center'>
                                <p>Instagram handle</p>
                                <p onClick={()=>handleEditIndexChange(3)} className='underline text-black font-medium cursor-pointer'>{editingIndex != null && editingIndex == 3 ? "Cancel" : "Edit"}</p>
                            </div>
                            <p className='text-gray-500 text-sm w-4/6'>{editingIndex != null && editingIndex == 3 ? "This will not be displayed to the public" : instagram}</p>
                            {editingIndex != null && editingIndex == 3 &&
                            <>
                                <div className='mt-4 space-y-2'>
                                    <input className='w-full border-gray-200 border py-3 px-2 focus:border-black outline-none' placeholder='Instagram handle'/>
                                </div>
                                <div className='flex mt-6'>
                                    <div className='rounded-md bg-black px-6 py-3 flex justify-center items-center cursor-pointer outline-none'>
                                        <p className='text-white font-semibold'>Done</p>
                                    </div>
                                </div>
                            </>
                            }
                        </div>
                        {/* Linkedin */}
                        <div className='py-4 md:py-6 border-b border-gray-200 w-full'>
                            <div className='w-full flex justify-between flex-row items-center'>
                                <p>LinkedIn handle</p>
                                <p onClick={()=>handleEditIndexChange(4)} className='underline text-black font-medium cursor-pointer'>{editingIndex != null && editingIndex == 4 ? "Cancel" : "Edit"}</p>
                            </div>
                            <p className='text-gray-500 text-sm w-4/6'>{editingIndex != null && editingIndex == 4 ? "This will not be displayed to the public" : linkedin == null ? '.' : linkedin}</p>
                            {editingIndex != null && editingIndex == 4 &&
                            <>
                                <div className='mt-4 space-y-2'>
                                    <input className='w-full border-gray-200 border py-3 px-2 focus:border-black outline-none' placeholder='Instagram handle'/>
                                </div>
                                <div className='flex mt-6'>
                                    <div className='rounded-md bg-black px-6 py-3 flex justify-center items-center cursor-pointer outline-none'>
                                        <p className='text-white font-semibold'>Done</p>
                                    </div>
                                </div>
                            </>
                            }
                        </div>
                        {/* Wechat */}
                        <div className='py-4 md:py-6 border-b border-gray-200 w-full'>
                            <div className='w-full flex justify-between flex-row items-center'>
                                <p>Wechat handle</p>
                                <p onClick={()=>handleEditIndexChange(5)} className='underline text-black font-medium cursor-pointer'>{editingIndex != null && editingIndex == 5 ? "Cancel" : "Edit"}</p>
                            </div>
                            <p className='text-gray-500 text-sm w-4/6'>{editingIndex != null && editingIndex == 5 ? "This will not be displayed to the public" :"."}</p>
                            {editingIndex != null && editingIndex == 5 &&
                            <>
                                <div className='mt-4 space-y-2'>
                                    <input className='w-full border-gray-200 border py-3 px-2 focus:border-black outline-none' placeholder='Instagram handle'/>
                                </div>
                                <div className='flex mt-6'>
                                    <div className='rounded-md bg-black px-6 py-3 flex justify-center items-center cursor-pointer outline-none'>
                                        <p className='text-white font-semibold'>Done</p>
                                    </div>
                                </div>
                            </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}