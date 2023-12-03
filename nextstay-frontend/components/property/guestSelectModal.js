"use client"
import Modal from '@mui/material/Modal';

//Icons
import CloseIcon from '@mui/icons-material/Close';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export default function GuestSelectModal(params){

    function handleNumberOfGuestsClick(op) {
        if(op == "-" && params.numberOfGuests >= 2){
            params.setNumberOfGuests(params.numberOfGuests - 1)
        }
        else if (op == "+"){
            params.setNumberOfGuests(params.numberOfGuests + 1)
        }
    }
    return(
        <Modal open={params.guestSelectModal} disableAutoFocus className="px-5 flex flex-col items-center justify-center">
            <div className='w-full md:w-2/5 bg-white rounded-md'>
                <div className='px-5 py-6 justify-between items-center flex flex-row  border-b border-gray-200'>
                    <CloseIcon onClick={params.closeGuestSelectModal} className='text-md cursor-pointer'/>
                    <p className='font-semibold'>Edit guests</p>
                    <CloseIcon className='text-md opacity-0'/>
                </div>

                <div className='w-full justify-center flex flex-col py-8 space-y-8 px-5'>
                    <div className='flex flex-row justify-between items-center w-full'>
                        <p className='font-semibold'>Number of guests</p>
                        <div className='flex flex-row space-x-4 items-center'>
                            <RemoveCircleIcon onClick={()=> handleNumberOfGuestsClick("-")} className='text-3xl cursor-pointer' />
                            <p className='text-center w-6'>{params.numberOfGuests}</p>
                            <AddCircleIcon onClick={()=> handleNumberOfGuestsClick("+")}  className='text-3xl cursor-pointer' />
                        </div>
                    </div>
                    <div className='w-full'>
                        <p className='text-gray-500 text-xs'>Please indicate the number of guests who will be staying in the sublet during any of the entire sublease period</p>
                    </div>
                </div>

                <div className='px-5 py-4 justify-between items-center flex flex-row border-t border-gray-200'>
                    <div className='flx flex-col'>
                        <p className='font-semibold'>Selected</p>
                        <p className='text-gray-500 text-sm'>{params.numberOfGuests} guest</p>
                    </div>
                    <div className='flex flex-col'>
                        <div onClick={params.closeGuestSelectModal} className='py-3 px-4 rounded-md bg-black w-min'>
                            <p className='font-sm text-white truncate cursor-pointer'>Done</p>
                        </div>
                    </div>
                </div>
            </div>
                    
        </Modal>
    )
}