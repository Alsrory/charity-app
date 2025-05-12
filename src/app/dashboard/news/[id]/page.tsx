'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface News {
  id: string
  title: string
  content: string
  imageUrl: string | null
}

const EditNews = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const [formData, setFormData] = useState<News>({
    id: '',
    title: '',
    content: '',
    imageUrl: null,
  })
  const [loading, setLoading] = useState(true)
  const [newImage, setNewImage] = useState<File | null>(null)

  useEffect(() => {
    fetchNews()
  }, [params.id])

  const fetchNews = async () => {
    try {
      const response = await fetch(`/api/news/${params.id}`)
      const data = await response.json()
      setFormData(data)
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formDataToSend = new FormData()
    formDataToSend.append('title', formData.title)
    formDataToSend.append('content', formData.content)
    if (newImage) {
      formDataToSend.append('image', newImage)
    }

    try {
      const response = await fetch(`/api/news/${params.id}`, {
        method: 'PUT',
        body: formDataToSend,
      })

      if (response.ok) {
        router.push('/dashboard/news')
      } else {
        console.error('Failed to update news')
      }
    } catch (error) {
      console.error('Error updating news:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0])
    }
  }

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">تعديل الخبر</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            عنوان الخبر
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            محتوى الخبر
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={8}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        {formData.imageUrl && !newImage && (
          <div className="relative h-64">
            <Image
              src={formData.imageUrl}
              alt={formData.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            تغيير صورة الخبر
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            حفظ التغييرات
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditNews 