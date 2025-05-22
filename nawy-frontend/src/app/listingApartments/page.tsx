"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import SliderImages from "../../Components/SliderImages/SliderImages";
import logo from "../../../public/imgs/download.png";
import Link from "next/link";

interface Apartment {
  _id: string;
  unitNumber: string;
  unitName: string;
  project: string;
  price: number;
  description: string;
  status: "available" | "rented" | "maintenance";
  images: string[];
}

export default function Apartments() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [modal, setModal] = useState(false);
  const [apartmentToDelete, setApartmentToDelete] = useState<string | null>(null);
  const [filterUnitName, setFilterUnitName] = useState("");
  const [filterUnitNumber, setFilterUnitNumber] = useState("");
  const [filterProject, setFilterProject] = useState("");
  const [loading, setLoading] = useState(true); 
  const [initialLoad, setInitialLoad] = useState(true); 

  const getApartments = async (): Promise<void> => {
    setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api/apartment';

    try {
      const response = await axios.get<{ result: Apartment[] }>(
        `${baseUrl}?unitName=${filterUnitName}&unitNumber=${filterUnitNumber}&project=${filterProject}`
      );
      setApartments(response.data.result);
    } catch (err) {
      console.error("Error fetching apartments:", err);
    } finally {
      setLoading(false);
      setInitialLoad(false); 
    }
  };

  const deleteApartment = async (id: string): Promise<void> => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api/apartment';
    try {
      await axios.delete(`${baseUrl}/${id}`);
      setApartments(a => a.filter(apt => apt._id !== id));
      setModal(false);
    } catch (err) {
      console.error("Error deleting apartment:", err);
    }
  };

 

  const clearFilters = () => {
    setFilterUnitName("");
    setFilterUnitNumber("");
    setFilterProject("");
  };

  useEffect(() => {
    getApartments();
  }, [filterUnitName, filterUnitNumber, filterProject]); 


  if (initialLoad) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading apartments...</div>
      </div>
    );
  }

  if (!initialLoad && apartments.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-[30px] text-center">
          There are no apartments
          <br />
          <Link className="text-blue-800 underline" href={'/addApartment'}>
            Add apartment now
          </Link>
        </h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-4 bg-gray-50">
      <div className="container mx-auto px-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Name
              </label>
              <input
                type="text"
                placeholder="Filter by name..."
                value={filterUnitName}
                onChange={e => setFilterUnitName(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Number
              </label>
              <input
                type="text"
                placeholder="Filter by number..."
                value={filterUnitNumber}
                onChange={e => setFilterUnitNumber(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project
              </label>
              <input
                type="text"
                placeholder="Filter by project..."
                value={filterProject}
                onChange={e => setFilterProject(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => getApartments()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>


      {modal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Delete Apartment</h2>
            <p className="mb-4">Are you sure you want to delete this apartment?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => apartmentToDelete && deleteApartment(apartmentToDelete)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="my-3">
        <Image
          src={logo}
          alt="Nawy Logo"
          className="mx-auto block"
          width={150}
          height={75}
          priority
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {apartments.map(apartment => (
            <div
              key={apartment._id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200 "
                style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%' 
  }}
            >
              <div className="bg-gray-100 w-full h-48 overflow-hidden">
                <SliderImages images={apartment.images} />
              </div>


              {/* to navigate to details */}
              <Link
                href={`/apartmentDetails/${apartment._id}`}
                className="flex flex-col justify-between"
              >
                <div className="p-2">
                  <h2 className="text-md font-bold mb-1 text-gray-800">
                    {apartment.unitName}
                  </h2>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p className="flex items-center">
                      <span className="font-medium mr-1">Unit :</span>
                      {apartment.unitNumber}
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium mr-1">Project:</span>
                      {apartment.project}
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium mr-1">Price:</span>
                      {apartment.price.toLocaleString()}
                    </p>
                    <div className="pt-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          apartment.status === 'available'
                            ? 'bg-green-100 text-green-800'
                            : apartment.status === 'rented'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {apartment.status.charAt(0).toUpperCase() + apartment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
{/* to delete the project */}
              <div className="px-2 pb-2">
                <button
                  onClick={e => {
                    e.preventDefault();
                    setApartmentToDelete(apartment._id);
                    setModal(true);
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-xs transition-colors duration-200 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
