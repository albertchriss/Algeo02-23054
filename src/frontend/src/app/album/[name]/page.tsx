import { AlbumView } from '@/components/album/AlbumView'
import Image from 'next/image'
import React from 'react'

const Album = ({params: { name }}: {params: { name: string }}) => {

  return (
    <div className='w-full flex-col items-center'>
        <div className="w-full flex items-center justify-center py-12">
            <Image src={`http://localhost:8000/uploads/dataset/${name}`} alt={name} width={1000} height={1000} className='size-[200px] rounded-2xl object-cover' />
        </div>
        <AlbumView name={name} />
    </div>
  )
}

export default Album