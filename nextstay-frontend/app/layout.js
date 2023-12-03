"use client"
import NavBar from '@/components/navbar'
import { Inter, Open_Sans } from 'next/font/google'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { UserContext } from '@/UserContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const openSans = Open_Sans({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const [showNav, setShowNav] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(()=> {
    handleNavBarDisplay()
  }, [pathname])
  
  function handleNavBarDisplay(){
    if(pathname != "/" && pathname != "/discover" && pathname != "/myStay" && pathname != "/profile" && pathname != "notification"){
      setShowNav(false)
    }
    else{
      setShowNav(true)
    }
  }
  
  return (
    <UserContext.Provider value={{user, setUser}}>
      <html lang="en">
        <title>Nextstay - sublet reimagined</title>
        <meta name="description" content="Nextstay is an online platform that makes subleasing easier, faster and safer." />
        <link rel="icon" href="/logo.png" />
        < meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"/>
        <body className='overflow-y-scroll'>
          {children}

          {showNav &&
            <NavBar/>
          }
        </body>
      </html>
      </UserContext.Provider>
  )
}
