'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface News {
  id: string
  title: string
  content: string
  imageUrl: string | null
  createdAt: string
}

const NewsPage = () => {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news')
      const data = await response.json()
      setNews(data)
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
      try {
        const response = await fetch(`/api/news/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setNews(news.filter(item => item.id !== id))
        }
      } catch (error) {
        console.error('Error deleting news:', error)
      }
    }
  }

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">إدارة الأخبار</h1>
        <Link
          href="/dashboard/news/add"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          إضافة خبر جديد
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="بحث عن خبر..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div className="space-y-6">
        {filteredNews.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/news/${item.id}`}
                    className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90"
                  >
                    تعديل
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    حذف
                  </button>
                </div>
              </div>
              
              {item.imageUrl && (
                <div className="relative h-64 mb-4">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              
              <p className="text-gray-600 mb-4 line-clamp-3">{item.content}</p>
              
              <div className="text-sm text-gray-500">
                تاريخ النشر: {new Date(item.createdAt).toLocaleDateString('ar-SA')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          لا توجد أخبار متاحة
        </div>
      )}
    </div>
  )
}

export default NewsPage 