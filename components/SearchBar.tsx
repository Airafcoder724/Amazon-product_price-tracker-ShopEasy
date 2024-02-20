'use client'
import { scrapeAndStoreProduct } from '@/lib/actions';
import React, { FormEvent, useState } from 'react'

const SearchBar = () => {
    const [searchPrompt , setSearchPrompt] = useState('');
    const [isLoading , setIsLoading] = useState(false);
  const isValidAmazonProduct =(url : string)=>{
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;

      //check if hostname contains amazon.com 
      if(hostname.includes('amazon.com')
      || (hostname.includes('amazon.'))
      || (hostname.endsWith('amazon'))){
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

    const handleSubmit =async (event:FormEvent<HTMLFormElement>)=>{
      event.preventDefault();

      const isValidLink = isValidAmazonProduct(searchPrompt);

      if(!isValidLink) {
        return alert("please provide a valid amazon link")
      }

      try {
        setIsLoading(true);
        // scrape product
        const product = await scrapeAndStoreProduct(searchPrompt)
      } catch (error) {
        console.log(error)
      }finally{
        setIsLoading(false);
      }
     
    }
  return (
    <form onSubmit={handleSubmit} className='flex flex-wrap gap-4 mt-12'>
        <input 
        value={searchPrompt}
        onChange={(e)=>setSearchPrompt(e.target.value)}
        className='searchbar-input'
        type='text' 
        placeholder='Enter product link' />

        <button type='submit' className='searchbar-btn'>
          {isLoading?'Searching...' : 'Search'}
        </button>
    </form>
  )
}

export default SearchBar