import SearchIcon from '@mui/icons-material/Search';

export default function BottomBar(prop){

    function handleClearSearchClick(){
        prop.clearSearch()
    }

    return (
        <div className="fixed bottom-0 w-full border border-slate-200 py-4 justify-between px-5 flex flex-row items-center">
            <p onClick={()=> handleClearSearchClick()} className="text-gray-700 underline underline-offset-4 font-medium">Clear search</p>
            <div onClick={() => prop.closeSearchModal()} className="py-2.5 px-5 flex flex-row rounded-md bg-gradient-to-r from-[#2390FF] to-[#174AFE] items-center space-x-1.5 w-28 h-14 justify-center">
                <SearchIcon className='text-white'/>
                <p className="text-white font-semibold ">Search</p>
            </div>
        </div>
    )
}