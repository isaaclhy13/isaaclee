"use client"

import { useState } from "react"


//Icons
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';

export default function ListingImageOptions(params) {
    const [showOption, setShowOption] = useState(false)
    return (
        <div className="flex flex-col items-end space-y-2">
            <div onClick={()=>setShowOption(!showOption)} className="w-8 h-8 rounded-full bg-white border border-gray-200 justify-center items-center flex">
                { showOption ?
                <CloseIcon className="text-md text-gray-600" />
                :
                <MoreHorizIcon className="text-md text-gray-600" />
                }
            </div>
            <div className={`bg-white border border-gray-200 rounded-md bg-white justify-center ${showOption ? 'block' : 'hidden'}`}>
                {params.onPrimaryClick != null &&
                <div onClick={()=> {params.onPrimaryClick(), setShowOption(false)}} className="px-5 py-3 border-b border-gray-400 w-full flex ">
                    <p className="text-sm text-gray-700" >Make Primary</p>
                </div>
                }
                <div onClick={()=> {params.onReplaceClick(), setShowOption(false)}} className="px-5 py-3 border-b border-gray-400 w-full flex justify-center">
                    <p className="text-sm text-gray-700">Replace</p>
                </div>
                <div onClick={()=> {params.onDeleteClick(), setShowOption(false)}} className="px-5 py-3 flex justify-center">
                    <p className="text-sm text-gray-700" >Delete</p>
                </div>
            </div>
        </div>
    )
}