import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar(){
    return(
        <div className="relative w-10/12 px-4 rounded-full py-2 bg-white shadow-lg border border-gray-200 flex flex-row items-center">
            <div className='text-gray-800'>
                <SearchIcon sx={{fontSize:'1.8rem'}}/>
            </div>
            <div className='flex flex-col ml-2'>
                <p className='font-semibold text-gray-800 text-sm'>Search location</p>
                <p className='font-thin text-sm'>Add dates</p>
            </div>
        </div>
    )
}