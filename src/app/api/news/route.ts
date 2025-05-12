import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(news)
  } catch (error) {
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الأخبار' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const image = formData.get('image') as File | null

    let imageUrl = null
    if (image) {
      // TODO: Implement image upload to storage service
      imageUrl = `/uploads/${image.name}`
    }

    const news = await prisma.news.create({
      data: {
        title,
        content,
        image: imageUrl,
      },
    })

    return NextResponse.json(news)
  } catch (error) {
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الخبر' },
      { status: 500 }
    )
  }
} 