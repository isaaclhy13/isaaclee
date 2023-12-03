"use client"

import NavBar from '@/components/navbar'
import Image from 'next/image'
import Link from 'next/link'
import DiscoverPage from './discover/page'
import { useContext, useState, createContext } from 'react'
import { UserContext } from '@/UserContext'
export default function Home() {


  return (
    <div className="flex flex-col pt-4 h-full">
      <DiscoverPage/>
    </div>
  )
}
