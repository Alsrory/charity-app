'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import Pagination from './Pagination'

const projects = [
  {
    id: 1,
    title: 'مشروع كفالة الأيتام',
    description: 'مشروع يهدف إلى رعاية الأيتام وتوفير احتياجاتهم الأساسية والتعليمية.',
    image: '/images/p.png',
    status: 'مكتمل',
  },
  {
    id: 2,
    title: 'مشروع المساعدات الغذائية',
    description: 'توفير سلال غذائية شهرية للأسر المحتاجة في مختلف مناطقة.',
    image: '/images/sala-copy.jpg',
    status: 'جاري',
  },
  {
    id: 3,
    title: 'مشروع التعليم المستمر',
    description: 'دعم الطلاب المتفوقين من الأسر ذات الدخل المحدود وتوفير المنح الدراسية.',
    image: '/images/education-support2.jpg',
    status: 'جاري',
  },
  {
    id: 4,
    title: 'مشروع الرعاية الصحية',
    description: 'توفير الرعاية الصحية الأساسية للمحتاجين وتقديم الفحوصات الطبية المجانية.',
    image: '/images/health.jpg',
    status: 'مكتمل',
  },
  {
    id: 5,
    title: 'مشروع بناء المدارس',
    description: 'بناء وتطوير المدارس في المناطق النائية لضمان التعليم للجميع.',
    image: '/images/school.jpg',
    status: 'جاري',
  },
  {
    id: 6,
    title: 'مشروع توزيع المياه',
    description: 'توفير المياه النظيفة للمجتمعات المحتاجة وإنشاء آبار المياه.',
    image: '/images/water.png',
    status: 'مكتمل',
  },
]

const ITEMS_PER_PAGE = 3
const AUTO_INTERVAL = 4000 // 4 ثواني

export default function ProjectsSection() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentProjects = projects.slice(startIndex, endIndex)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // التنقل التلقائي
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setCurrentPage((prev) => (prev === totalPages ? 1 : prev + 1))
    }, AUTO_INTERVAL)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [currentPage, totalPages])

  // عند تغيير الصفحة يدويًا، إعادة ضبط المؤقت
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    if (timerRef.current) clearTimeout(timerRef.current)
    // Scroll to top of projects section
    const element = document.getElementById('projects')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
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
          {currentProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden group">
              <div className="relative h-48">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    project.status === 'مكتمل' ? 'bg-green-100 text-green-800' : 'bg-primary/10 text-primary'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <Link
                  href={`/projects/${project.id}`}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  تفاصيل المشروع
                </Link>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        <div className="text-center mt-10">
          <Link
            href="/projects"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90"
          >
            عرض جميع المشاريع
          </Link>
        </div>
      </div>
    </section>
  )
} 