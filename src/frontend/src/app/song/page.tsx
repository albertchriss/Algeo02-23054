import { SongList } from '@/components/song/SongList'
import React from 'react'

const AlbumPage = () => {
  return (
    <div className='p-10 flex flex-col space-y-8'>
        <h1 className='text-5xl font-bold'>
            Songs
        </h1>
        <SongList />
    </div>
  )
}

export default AlbumPage