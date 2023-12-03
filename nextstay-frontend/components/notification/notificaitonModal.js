import Modal from '@mui/material/Modal';
import { useRouter } from 'next/navigation';

export default function NotificaitonModal(prop){
    const router = useRouter()
    function handleViewRequestClick(){
        router.replace("/profile/myRequests")
    }


    return(
        <Modal open={prop.requestSuccessModal} onClose={()=> prop.handleClose()} disableAutoFocus className="px-5 flex flex-col items-center justify-center">
            <div className='w-full md:w-1/4 rounded-md h-fit bg-white p-4 md:p-6 space-y-12'>
                <div className='space-y-2'>
                    <p className='font-medium text-xl'>Request successfully sent!</p>
                    <p className='text-slate-500 text-sm' >Thank you for your interest in this sublet. We will notify you via email / phone number as soon as possible when the tenant makes a decision.</p>
                </div>
                <div className='w-full justify-between flex flex-row items-center'>
                    <p className='font-medium text-slate-600 cursor-pointer md:text-sm' >What's next?</p>
                    <div onClick={()=> handleViewRequestClick()} className='bg-black p-3 rounded-md cursor-pointer'>
                        <p className='text-white'>View request</p>
                    </div>
                </div>
            </div>
        </Modal>
    )
}