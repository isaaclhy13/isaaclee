"use client"

import Modal from '@mui/material/Modal';

//Icon
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

export default function ImageGalleryModal(prop){
    const [images, setImages] = useState(prop.images)
    const [imageIndex, setImageIndex] = useState(0)

    function handleImageNavigation(op){
        if(op == "+"){
            setImageIndex((imageIndex+1) % prop.images.length)
        }
        else if ( op == '-' && imageIndex > 0){
            setImageIndex(imageIndex -1)
        }
    }
    return(
        <Modal onClose={()=>prop.handleClose()} open={prop.imageGalleryModal} disableAutoFocus className="px-5 flex flex-col items-center justify-center"
            slotProps={{
                backdrop: {
                sx: {
                    //Your style here....
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                },
                },
            }}
        >
            <div className='flex flex-col w-full items-center'>
                <div className='w-4/5'>
                    <div className='py-3 w-full flex flex-row justify-center items-center'>
                        
                        <p onClick={()=>prop.handleClose()} className='font-semibold underline text-white cursor-pointer'>Back to sublet</p>
                        
                    </div>
                    <div className='w-full flex flex-row justify-between items-center'>
                        <div onClick={()=> handleImageNavigation("-")} className='rounded-full bg-white p-2 justify-center items-center cursor-pointer'>
                            <ChevronLeftIcon className='text-black'/>
                        </div>
                        <div className='w-4/6 bg-gray-200 h-[60vh]'>
                            <img src={images[imageIndex].url} className='w-full h-full object-cover'/>
                        </div>
                        <div onClick={()=> handleImageNavigation("+")} className='rounded-full bg-white p-2 justify-center items-center cursor-pointer'>
                            <ChevronRightIcon className='text-black'/>
                        </div>
                    </div>
                </div>
                <div className='py-3'>
                    <p className='text-white'>{imageIndex+1} / {prop.images.length}</p>
                </div>
            </div>

         
            
        </Modal>
    )
}