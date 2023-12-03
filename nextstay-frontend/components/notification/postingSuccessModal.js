import Modal from '@mui/material/Modal';
import { useRouter } from 'next/navigation';

//Icon
import CloseIcon from '@mui/icons-material/Close';


export default function PostingSuccessfullModal(prop){
    const router = useRouter()
    

    return(
        <Modal open={prop.PostingSuccessfullModal} onClose={()=>prop.handleClose()} disableAutoFocus className="px-5 flex flex-col items-center justify-center">
            <div className='w-full md:w-1/4 rounded-md h-fit bg-white p-5'>
                {/* <div>
                    <CloseIcon className='text-md'/>
                </div> */}
                <div className='space-y-3'>
                    <div className='space-y-2 relative space-y-3'>
                        <p className='font-medium text-xl'>Sublet successfully posted!</p>
                        <p className='text-slate-500 text-sm' >Thank you for posting your sublet. Our staff will contact you via phone or email to ask for further informaation when guests are intersted in your sublet.</p>
                    </div>

                    <div className='w-full justify-between flex flex-col items-center py-3 space-y-2'>
                        <div className='bg-black p-3 rounded-md cursor-pointer w-full justify-center items-center flex'>
                            <p className='text-white text-sm '>Verify contact information</p>
                        </div>
                        <p className='font-medium text-slate-600 cursor-pointer md:text-sm' >Close</p>
                    </div>
                </div>
            </div>
        </Modal>
    )
}