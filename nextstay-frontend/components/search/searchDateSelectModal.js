import Modal from '@mui/material/Modal';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { usePathname, useRouter } from 'next/navigation';

//Icon
import CloseIcon from '@mui/icons-material/Close';


export default function SearchDateSelectModal(params){

    function handleDateSelectConfirmation(){
        params.closeDateSelectionModal()
    }

    return (
        <Modal open={params.dateSelectionModal} disableAutoFocus className="px-5 flex flex-col items-center justify-center">
            <div className='w-full bg-white rounded-md'>
                <div className='px-5 py-6 justify-between items-center flex flex-row  border-b border-gray-200'>
                    <CloseIcon onClick={params.closeDateSelectionModal} className='text-md'/>
                    <p className='font-semibold'>Select dates</p>
                    <CloseIcon className='text-md opacity-0'/>
                </div>
                <div className='w-full justify-center items-center flex pt-4'>
                    <DateRange

                        minDate={new Date()}
                        rangeColors={['#000000']}
                        ranges={[params.dateRange]}
                        calendarFocus="backwards"
                        onChange={(e)=> 
                            params.setDateRange({
                                startDate: e.selection.startDate,
                                endDate: e.selection.endDate,
                                key: e.selection.key
                            })
                        }
                    />
                </div>
                <div className='px-5 py-4 justify-between items-center flex flex-row border-t border-gray-200'>
                    <div className='flx flex-col'>
                        <p className='font-semibold'>Selected</p>
                        <p className='text-gray-500 text-sm'>{new Date(params.dateRange.startDate).toLocaleDateString('en-us',{month:'short', day:'numeric'})} - {new Date(params.dateRange.endDate).toLocaleDateString('en-us',{month:'short', day:'numeric'})}</p>
                    </div>
                    <div className='flex flex-col'>
                        <div onClick={() => handleDateSelectConfirmation()} className='py-3 px-4 rounded-md bg-black w-min'>
                            <p className='font-sm text-white truncate cursor-pointer'>Done</p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}