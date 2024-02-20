import HeroCarousel from '@/components/HeroCarousel'
import SearchBar from '@/components/SearchBar'
import Image from 'next/image'
import React from 'react'
import { getAllProducts } from '@/lib/actions'
import Card from '@/components/Card'
const Home = async() => {
  const allProducts = await getAllProducts();
  return (
    <>
    <section className='px-6 border-2 md:px-20 py-24 border-red-500'>
      <div className='flex max-xl:flex-col gap-16'>
        <div className='flex justify-center flex-col'>
            <p className='small-text'>
              Smart Shopping starts here:
            <Image src="/assets/icons/arrow-right.svg" alt='arrow' width={16} height={16} />
            </p>
          
          <h1 className='head-text'>
              Unleash the Power of
              <span className='text-primary'> ShopEasy</span> 
          </h1>

          <p className='mt-6'>
          Powerful, self-serve product and growth analytics to help you convert, engage, and retain more.
          </p>

          <SearchBar/>
        </div>

        <HeroCarousel/>
      </div>
    </section>

    <section className='trending-section '>
        <h2 className='section-text'>Trending</h2>

        <div className='flex flex-wrap gap-x-8 gap-y-16'>
          {allProducts?.map((product)=>(
            <Card key={product._id} product={product}/>

          ))}
          
        </div>
    </section> 
    </>
    
  )
}

export default Home