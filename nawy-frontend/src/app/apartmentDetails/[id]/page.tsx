'use client'

import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Apartment {
  _id: string
  unitNumber: string
  unitName: string
  project: string
  price: number
  description: string
  status: 'available' | 'sold' | 'reserved' | string
  images: string[]
  __v?: number
}

export default function ApartmentDetails() {
  const params = useParams<{ id: string }>()
  const [apartment, setApartment] = useState<Apartment | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const getApartmentDetails = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api/apartment';

    try {
      setLoading(true)
      const res = await axios.get<{ result: Apartment }>(
        `${baseUrl}/${params.id}`
      )
      setApartment(res.data.result)
      if (res.data.result.images?.length > 0) {
        setSelectedImage(res.data.result.images[0])
      }

    } catch (err) {
      console.error(err)
      setError('Failed to load apartment details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getApartmentDetails()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!apartment) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Apartment not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
     
        <div className="md:w-1/2">
       
          <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden aspect-video">
            {selectedImage ? (
      

                        <img
              src={selectedImage}
              alt={`Slide `}
              className="w-full h-full object-cover"
            />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                No Image Available
              </div>
            )}
          </div>
          
          {apartment.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {apartment.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`border-2 rounded overflow-hidden transition-all ${
                    selectedImage === image ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <div className="aspect-square relative">
                  <img
              src={image}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover"
            />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{apartment.unitName}</h1>
          <p className="text-gray-600 mb-2">Unit Number: {apartment.unitNumber}</p>
          <p className="text-gray-600 mb-2">Project: {apartment.project}</p>
          
          <div className="my-6">
            Price: 
            <span className=" mx-2 text-2xl font-bold text-blue-600">
              {apartment.price.toLocaleString()}
            </span>
          </div>

          <div className="mb-6">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                apartment.status === 'available'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {apartment.status.charAt(0).toUpperCase() + apartment.status.slice(1)}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{apartment.description}</p>
          </div>

      
        </div>
      </div>
    </div>
  )
}