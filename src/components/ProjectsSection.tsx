 'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import Pagination from './Pagination'
import api from '@/lib/api'
import { ArrowRight } from 'lucide-react'

const ITEMS_PER_PAGE = 3
const AUTO_INTERVAL = 4000 // 4 ثواني

interface Project {
  id: string
  title: string
  description: string
  photo_url: string | null
  status: string
  start_date: string
  end_date: string
}

export default function ProjectsSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const safeProjects = Array.isArray(projects) ? projects : []
  const totalPages = Math.ceil(safeProjects.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentProjects = safeProjects.slice(startIndex, endIndex)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)


  const fetchProjects = async () => {
    try {
      setLoading(true)        // Start loading
      setError(null)          // Reset any previous error
  
      const response = await api.get('/projects')  // Send GET request to the server
      const projects = response.data               // Extract the response data
     
      console.log('API Response:', response.data)
      // Check if 'data' key exists and is an array
      if (projects && Array.isArray(projects.data)) {
        setProjects(projects.data)                // Set the projects state with the array
      } else {
        setProjects([])                           // If not an array, set an empty array
      }
  
    } catch (error) {
      setError('An error occurred while loading the projects')  // Handle errors
      setProjects([])                                            // Clear project list on error
    } finally {
      setLoading(false)       // Stop loading in all cases
    }
  }
  
  useEffect(() => {
    fetchProjects()   // Fetch projects when the component mounts
  }, [])

  useEffect(() => { // Auto-scroll to the next page every 4 seconds
    if (totalPages > 1) {
      timerRef.current = setTimeout(() => {
        setCurrentPage((prev) => (prev === totalPages ? 1 : prev + 1)) // Increment the page number
      }, AUTO_INTERVAL) // Set the timeout to 4 seconds
    }
    return () => { // Clear the timeout when the component unmounts
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

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">المشاريع</h2>
            <div className="h-1 w-24 bg-primary mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              نعمل على تنفيذ مشاريع متنوعة تهدف إلى تحسين حياة المجتمع وتلبية احتياجاته المختلفة
            </p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">المشاريع</h2>
            <div className="h-1 w-24 bg-primary mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              نعمل على تنفيذ مشاريع متنوعة تهدف إلى تحسين حياة المجتمع وتلبية احتياجاته المختلفة
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchProjects}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (safeProjects.length === 0) {
    return (
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">المشاريع</h2>
            <div className="h-1 w-24 bg-primary mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              نعمل على تنفيذ مشاريع متنوعة تهدف إلى تحسين حياة المجتمع وتلبية احتياجاته المختلفة
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">لا توجد مشاريع متاحة حالياً</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">المشاريع</h2>
          <div className="h-1 w-24 bg-primary mx-auto"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            نعمل على تنفيذ مشاريع متنوعة تهدف إلى تحسين حياة المجتمع وتلبية احتياجاته المختلفة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProjects.map((project: Project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48">
              <Image // Show the project image
                src={project.photo_url || '/images/image.png'}
                alt={project.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/image.png';
                }}
              />

                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    project.status === 'مكتمل'
                      ? 'bg-green-100 text-green-800'
                      : project.status === 'جاري'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {project.description}
                </p>
                <Link
                  href={`/projects/${project.id}`}
                  className="text-primary hover:text-primary/80 font-medium inline-flex items-center group/link"
                >
                  تفاصيل المشروع
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
            عرض جميع المشاريع 
          </Link>
        </div>
      </div>
    </section>
  )
}
