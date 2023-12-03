"use client"
import {TABS} from '../constants/sharedUtils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function NavBar(){

    const router = useRouter()
    const [path, setPath] = useState("discover")


    function handleTabNavigation(name){
        if(name == "Discover"){
            router.push('/discover', { scroll: false })
        }
        else if(name == "myStay"){
            router.push('/myStay', { scroll: false })
        }
        else if(name == "Notification"){
            router.push('/notification', { scroll: false })
        }
        else if(name == "Profile"){
            router.push('/profile', { scroll: false })
        }
        setPath(name)
    }

    return (
        <div className={`w-screen bg-white text-center fixed bottom-0 flex flex-row justify-between border border-slate-200 py-3 md:hidden`}>
            {TABS.map((tab) => (
                <div key={tab.name} onClick={()=>handleTabNavigation(tab.name)}  className={`flex flex-col items-center justify-center min-w-[25%] active:opacity-100`}>
                    <div  className={`${path.toLocaleLowerCase() == tab.name.toLocaleLowerCase() ? 'text-[#2390FF]' : 'text-gray-400'}`}>
                        {tab.icon}
                    </div>
                    <p className={`text-xs font-medium ${path.toLocaleLowerCase() == tab.name.toLocaleLowerCase() ? 'text-[#2390FF]' : 'text-gray-400'}`}>{tab.name}</p>
                </div>
            ))}
        </div>
    )
}