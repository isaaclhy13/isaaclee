import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function SortMenu(prop){

    function handleSortByClick(name){
        prop.setSortBy(name)
        prop.handleClose()
    }
    return (
        <Menu
        anchorEl={prop.anchorEl}
        open={prop.open}
        onClose={() => prop.handleClose()}
        >
            <div onClick={()=> handleSortByClick("Relevance")} className='px-8 py-2 truncate items-center flex justify-center border-b border-gray-200 '>
                <p className='text-sm font-medium'>Relevance</p>
            </div>
            <div onClick={()=> handleSortByClick("Popularity")} className='px-8 py-3 border-b border-gray-200 items-center flex justify-center'>
                <p className='text-sm font-medium'>Popularity</p>
            </div>
            <div onClick={()=> handleSortByClick("Latest")} className='px-8 py-3 border-b border-gray-200 items-center flex justify-center'>
                <p className='text-sm font-medium'>Latest</p>
            </div>
            <div onClick={()=> handleSortByClick("Price")} className='px-8 py-2 truncate items-center flex justify-center'>
                <p className='text-sm font-medium'>Price (low to high)</p>
            </div>
        </Menu>
    )
}