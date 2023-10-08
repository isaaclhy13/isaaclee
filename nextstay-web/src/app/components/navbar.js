"use client"; // This is a client component

import Image from 'next/image'
import LogoSVG from '../../../public/logo.svg'
import { Inter, Open_Sans } from 'next/font/google'

const NAVLINKS = ["Sublet your room"]
export default function NavBar(){

    function handleSubletYourRoomClick(){
        window.scrollTo(0, document.body.scrollHeight);
    }

    return (
        <div style={{flexDirection: 'row', display:'flex', alignItems:'center', boxShadow: "2px 2px 10px 1px rgba(0, 0, 0, 0.1)", width:"100vw", height:'10vh', paddingLeft:'5vw', paddingRight:'5vw', justifyContent: "space-between"}}>
            <Image src={LogoSVG} width={150} height={50}/>
            <div style={{flexDirection:'row', display:'flex'}}>
                {NAVLINKS.map(links => {
                    return (
                        <p onClick={handleSubletYourRoomClick} style={{color:'black', marginLeft:'3vw', cursor: 'pointer'}}>{links}</p>
                    )
                })}
            </div>
        </div>
    )
}