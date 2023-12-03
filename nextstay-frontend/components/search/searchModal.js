"use client"
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import NavAction from '../nav/navAction';
import Fade from '@mui/material/Fade';

//Icons
import CloseIcon from '@mui/icons-material/Close';

//Constants
import { POPULARLOCATIONS } from '@/constants/sharedUtils';
import BottomBar from '../nav/bottomBar';

export default function SearchModal(prop){
    const searchModal = prop.active

    function handleModalClose(){
        prop.closeModal()
    }

    function handleSearchClick(){
        //prop.searchProperties()
        prop.closeModal()
    }

    function handleClearSearchClick(){
        
        prop.setLocation("")
        prop.setDateRange({startDate: null, endDate:  null, key:"selection"})
        
    }
    return(
        <Modal open={searchModal}>
            <div className="w-full h-full bg-gray-100 relative">
                <div className='px-5'>
                    <div className="w-full py-5 items-center justify-start flex flex-row">
                        <div onClick={() => handleModalClose()} className="flex rounded-full bg-white border border-gray-200 items-center justify-center w-8 h-8">
                            <CloseIcon className='text-md'/>
                        </div>
                    </div>
                    <div className='w-full px-4 rounded-lg border border-gray-3200 py-4 bg-white shadow-sm'>
                        <p className='text-xl font-semibold text-gray-700'>Where to?</p>
                        <div onClick={prop.openSearchLocationModal} className="mt-4 bg-gray-100 border border-gray-200 rounded-md block w-full p-4">
                            {prop.location != "" ?
                            <p className='text-sm text-black line-clamp-1'>{prop.location.main_text}, {prop.location.secondary_text}</p>
                            :
                            <p className='text-sm text-gray-400'>Search location ...</p>
                            }
                        </div>
                        <p className='mt-4 font-semibold text-gray-700'>Popular locations:</p>
                        <div className='flex flex-row mt-4 space-x-4 overflow-auto w-full'>
                            {POPULARLOCATIONS.map((place) => (
                                <div key={place.name} className='border border-gray-300 rounded-md bg-white px-2 py-2'>
                                    <p className='text-xs text-gray-700 truncate'>{place.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='mt-4 w-full px-4 rounded-lg border border-gray-3200 py-4 bg-white shadow-sm flex flex-row justify-between items-center'>
                        <p className='text-gray-700' >When</p>
                        <p onClick={()=> prop.openDateSelectionModal()} className='text-gray-700 font-semibold text-sm'>
                            {prop.dateRange.startDate == null || prop.dateRange.endDate == null ?
                            "Add dates"
                            :
                            new Date(prop.dateRange.startDate).toLocaleDateString('en-us',{month:'short', day:'numeric'}) + `${"  -  "}` + new Date(prop.dateRange.endDate).toLocaleDateString('en-us',{month:'short', day:'numeric'})
                            }    
                        </p>
                    </div>
                </div>
                <BottomBar closeSearchModal={() => handleSearchClick()} clearSearch={()=>handleClearSearchClick()}/>
            </div>
        </Modal>
          
    )
}