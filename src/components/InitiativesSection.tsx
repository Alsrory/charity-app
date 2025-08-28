'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import api from '@/lib/api'
import Pagination from './Pagination'
import { ArrowRight } from 'lucide-react'


interface Initiative {
  id: string
  title: string
  description: string
  status: string
  photo_url: string | null
  start_date: string
  
}

const ITEMS_PER_PAGE = 3
const AUTO_INTERVAL = 4000 //  4 seconds to change between pages in pagination


export default function InitiativesSection() {
  const [initiatives, setInitiatives] = useState<Initiative[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const safeInitiatives = Array.isArray(initiatives) ? initiatives : []
  const totalPages = Math.ceil(safeInitiatives.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentInitiatives = safeInitiatives.slice(startIndex, endIndex)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const fetchInitiatives = async () => {
      try {
        setLoading(true)        // Start loading
        setError(null)          // Reset any previous error
    
        const response = await api.get('/initiatives')  // Send GET request to the server
        const initiatives = response.data 
        console.log('API Response:', initiatives.data)
        setInitiatives(Array.isArray(initiatives.data) ? initiatives.data : [])
      } catch (error) {
        console.error('Error fetching initiatives:', error)
        setError('حدث خطأ أثناء جلب المبادرات')
      } finally {
        setLoading(false)
      }
    }

    fetchInitiatives() // Fetch initiatives when the component mounts
  }, [])
  useEffect(() => { // Auto-scroll to the next page every 4 seconds
    if (totalPages > 1) {
      timerRef.current = setTimeout(() => {
        setCurrentPage((prev) => (prev === totalPages ? 1 : prev + 1))
      }, AUTO_INTERVAL)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [currentPage, totalPages])

  const handlePageChange = (page: number) => { // Handle page change
    setCurrentPage(page) // Set the current page
    if (timerRef.current) clearTimeout(timerRef.current) // Clear the timeout
    const element = document.getElementById('projects') // Get the projects element
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => { // Reset the page to 1 if the current page is greater than the total pages
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1) // Set the current page to 1
    }
  }, [totalPages, currentPage]) // Run this effect when the total pages or current page changes

  if (loading) { // Show loading spinner if the initiatives are still loading
    return (
      <section id="initiatives" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">المبادرات</h2>
            <div className="h-1 w-24 bg-primary mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              نطلق مبادرات نوعية تستهدف فئات مختلفة من المجتمع وتسعى لإحداث تأثير إيجابي مستدام
            </p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    )
  }

    if (error) {  // Show error message if there is an error
        return (
          <section id="initiatives" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <div className="text-2xl text-red-600">{error}</div>
            </div>
          </section>
        )
      }

      return (
        <section id="initiatives" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">المبادرات</h2>
              <div className="h-1 w-24 bg-primary mx-auto"></div>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                نطلق مبادرات نوعية تستهدف فئات مختلفة من المجتمع وتسعى لإحداث تأثير إيجابي مستدام
              </p>
            </div>
    
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentInitiatives.map((initiative: Initiative) => (
                <div key={initiative.id} className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-48">
                  <Image // Show the initiative image
                    src={initiative.photo_url || '/images/image.png'}
                    alt={initiative.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/image.png';
                    }}
                  />
    
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        initiative.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : initiative.status === 'ongoing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {initiative.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-primary transition-colors">
                      {initiative.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {initiative.description}
                    </p>
                    <Link
                      href={`/initiatives/${initiative.id}`}
                      className="text-primary hover:text-primary/80 font-medium inline-flex items-center group/link"
                    >تفاصيل المبادرة
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
    
            {totalPages > 1 && ( // Show the pagination if there are more than 1 page
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
    
            <div className="text-center mt-10"> {/* Show the link to all projects */}
              <Link
                href="/projects"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium"
              >
                عرض جميع المبادرات 
              </Link>
            </div>
          </div>
        </section>
      )
} 