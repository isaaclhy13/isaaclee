"use client"
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import NavAction from '../nav/navAction';

//Icon
import PlaceIcon from '@mui/icons-material/Place';
import CloseIcon from '@mui/icons-material/Close';


export default function SearchLocationModal(prop){
    const [autocompletes, setAutocompletes] = useState([])
    const searchLocationModal = prop.active

    async function fetchAutocompleteResults(locationInput){
      
        if(locationInput == ""){ return }

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        
        fetch(`https://nextstay-09a1b7efd58f.herokuapp.com/location/autocomplete/${locationInput}`, requestOptions)
        .then(async res => {
            if(res.status == 200){
                let data = await res.json()
                setAutocompletes(data.data)
            }
        })
        .catch(error => console.log('error', error));
    }

    function handleAutocompleteClick(item){
        setAutocompletes([])
        prop.setLocation(item)
        prop.closeModal()
    }

    function handleModalClose(){
        setAutocompletes([])
        prop.closeModal()
    }
    return(
        <Modal open={searchLocationModal}>
            <div className="w-full h-full bg-gray-100 relative px-5">
                <div className="w-full py-5 items-center justify-start flex flex-row">
                    <div onClick={() => handleModalClose()} className="flex rounded-full bg-white border border-gray-200 items-center justify-center w-8 h-8">
                        <CloseIcon className='text-md'/>
                    </div>
                </div>
                <input onChange={(val) => fetchAutocompleteResults(val.target.value)} type="text" className="bg-gray-200 border border-gray-200 rounded-md block w-full px-3 py-4 focus:outline outline-2 outline-black " placeholder='Search location ...'/>

                <div className='flex flex-col'>
                    {
                        autocompletes.map((item, index) => {
                            return(
                                <div onClick={()=>handleAutocompleteClick(item)} key={"autocomplete" + index} className="flex flex-row items-center py-5 space-x-2 border-b border-gray-200">
                                    <PlaceIcon className='text-2xl'/>
                                    <div>
                                        <p className='line-clamp-1 font-medium'>{item.main_text}</p>
                                        <p className='line-clamp-2 text-gray-600'>{item.secondary_text}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>  
            </div>
        </Modal>
    )
}