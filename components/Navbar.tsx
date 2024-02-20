'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const navIcons = [
  {src:"/assets/icons/search.svg" , alt:"search" , width:27 , height:27},
  {src:"/assets/icons/black-heart.svg" , alt:"heart" , width:27 , height:27},
  {src:"/assets/icons/user.svg" , alt:"user" , width:27 , height:27},

]

const Navbar = () => {
  return (

    <header className='w-full'>
        <nav className='nav'>
            <Link href="/" className='flex items-center gap-1'>
                <Image src="/assets/icons/logo.svg" width={27} height={27} alt='logo' />
                <p className='nav-logo'>Shop<span className='text-primary'>Easy</span></p>
            </Link>

            <div className='flex items-center gap-3'>
              {navIcons.map((icon)=>(
                <Image key={icon.alt} src={icon.src} alt={icon.alt} width={icon.width} height={icon.height} />
              ))}
            </div>
        </nav>
    </header>

  )
}

export default Navbar