import CloseIcon from '@mui/icons-material/Close';

export default function NavAction(prop) {
    return (
        <div className="w-full py-5 items-center justify-start flex flex-row">
            <div onClick={prop.action} className="flex rounded-full bg-white border border-gray-200 items-center justify-center w-8 h-8">
                {prop.icon == "close" ?
                <CloseIcon className='text-md'/>
                :
                <CloseIcon className='text-md'/>
                }
            </div>
        </div>
    )
}