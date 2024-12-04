import { AlbumList } from '@/components/album/AlbumList'
import React from 'react'

const AlbumPage = () => {
  return (
    <div className='py-10 px-20 flex flex-col space-y-8'>
        <h1 className='text-5xl font-bold'>
            Albums
        </h1>
        <AlbumList />
    </div>
  )
}

export default AlbumPage