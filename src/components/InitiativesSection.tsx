'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Initiative {
  id: string
  title: string
  description: string
  image: string | null
  createdAt: string
}

export default function InitiativesSection() {
  const [initiatives, setInitiatives] = useState<Initiative[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInitiatives = async () => {
      try {
        const response = await fetch('/api/initiatives')
        if (!response.ok) {
          throw new Error('فشل في جلب المبادرات')
        }
        const data = await response.json()
        setInitiatives(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching initiatives:', error)
        setError('حدث خطأ أثناء جلب المبادرات')
      } finally {
        setLoading(false)
      }
    }

    fetchInitiatives()
  }, [])

  if (loading) {
    return (
      <section id="initiatives" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-2xl text-gray-600">جاري التحميل...</div>
        </div>
      </section>
    )
  }

  // if (error) {
  //   return (
  //     <section id="initiatives" className="py-20 bg-gray-50">
  //       <div className="max-w-7xl mx-auto px-4 text-center">
  //         <div className="text-2xl text-red-600">{error}</div>
  //       </div>
  //     </section>
  //   )
  // }

  return (
    <section id="initiatives" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">المبادرات</h2>
          <div className="h-1 w-24 bg-primary mx-auto"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            نطلق مبادرات نوعية تستهدف فئات مختلفة من المجتمع وتسعى لإحداث تأثير إيجابي مستدام
          </p>
        </div>

        {initiatives.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">ليس هناك مبادرات حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {initiatives.map((initiative) => (
              <div key={initiative.id} className="bg-white rounded-lg shadow-lg overflow-hidden group">
                <div className="relative w-56 h-48">
                  <Image
                    src={initiative.image || '/images/placeholder.jpg'}
                    alt={initiative.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{initiative.title}</h3>
                  <p className="text-gray-600 mb-4">{initiative.description}</p>
                  <Link
                    href={`/initiatives/${initiative.id}`}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    المزيد عن المبادرة
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
} 