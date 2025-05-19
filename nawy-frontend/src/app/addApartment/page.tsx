'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react'
import './page.css'
import axios from 'axios'
import { toast } from 'react-toastify'

interface ApartmentData {
  unitName: string
  unitNumber: string
  project: string
  price: number
  description: string
  status: string
  images: File[]
}

export default function AddApartment() {
  const [apartment, setApartment] = useState<ApartmentData>({
    unitName: "",
    unitNumber: "",
    project: "",
    price: 0,
    description: "",
    status: "available", 
    images: []
  })

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setApartment(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setApartment(prev => ({
        ...prev,
        images: Array.from(e.target.files as FileList)
      }))
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    
    const formData = new FormData()
    
    formData.append('unitName', apartment.unitName)
    formData.append('unitNumber', apartment.unitNumber)
    formData.append('project', apartment.project)
    formData.append('price', apartment.price.toString())
    formData.append('description', apartment.description)
    formData.append('status', apartment.status)
    
    apartment.images.forEach((file) => {
      formData.append('images', file)
    })
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api/apartment';

    await axios.post(baseUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      
      toast.success('Apartment added successfully!')
    })
    .catch(err => {
      console.error('Error submitting form:', err)
      toast.error(err?.response?.data?.error || 'An error occurred while submitting the form.')
    })
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4'>
      <div className='max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6'>
        <h1 className='text-2xl font-bold text-gray-800 mb-6 text-center'>Add New Apartment</h1>
        
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label htmlFor="unitName" className='block text-sm font-medium text-gray-700'>Unit Name</label>
            <input 
              onChange={handleChange} 
              name='unitName' 
              id='unitName' 
              type="text" 
              value={apartment.unitName}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              required
            />
          </div>
          
          <div className='space-y-2'>
            <label htmlFor="unitNumber" className='block text-sm font-medium text-gray-700'>Unit Number</label>
            <input 
              onChange={handleChange} 
              name='unitNumber' 
              id='unitNumber' 
              type="text" 
              value={apartment.unitNumber}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              required
            />
          </div>
          
          <div className='space-y-2'>
            <label htmlFor="project" className='block text-sm font-medium text-gray-700'>Project</label>
            <input 
              onChange={handleChange} 
              name='project' 
              id='project' 
              type="text" 
              value={apartment.project}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              required
            />
          </div>
          
          <div className='space-y-2'>
            <label htmlFor="price" className='block text-sm font-medium text-gray-700'>Price</label>
            <input 
              onChange={handleChange} 
              name='price' 
              id='price' 
              type="number" 
              value={apartment.price}
              min="0"
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              required
            />
          </div>
          
          <div className='space-y-2'>
            <label htmlFor="description" className='block text-sm font-medium text-gray-700'>Description</label>
            <textarea
              onChange={handleChange} 
              name='description' 
              id='description'
              value={apartment.description}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              rows={4}
              required
            />
          </div>
          
          <div className='space-y-2'>
            <label htmlFor="status" className='block text-sm font-medium text-gray-700'>Status</label>
            <select 
              onChange={handleChange} 
              name="status" 
              id="status"
              value={apartment.status}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              required
            >
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          
          <div className='space-y-2'>
            <label htmlFor="images" className='block text-sm font-medium text-gray-700'>Images</label>
            <div className='flex items-center justify-center w-full'>
              <label className='flex flex-col w-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50'>
                <div className='flex flex-col items-center justify-center pt-5 pb-6 px-4'>
                  <svg className='w-8 h-8 mb-4 text-gray-500' aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className='mb-2 text-sm text-gray-500'>
                    <span className='font-semibold'>Click to upload</span> or drag and drop
                  </p>
                  <p className='text-xs text-gray-500'>
                    {apartment.images.length > 0 
                      ? `${apartment.images.length} file(s) selected` 
                      : 'PNG, JPG, JPEG (MAX. 10MB each)'}
                  </p>
                </div>
                <input 
                  name='images' 
                  id='images' 
                  type="file" 
                  multiple 
                  onChange={handleFileChange}
                  accept="image/*"
                  className='hidden'
                  required
                />
              </label>
            </div>
          </div>
          
          <button 
            type='submit'
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105'
          >
            Add Apartment
          </button>
        </form>
      </div>
    </div>
  )
}