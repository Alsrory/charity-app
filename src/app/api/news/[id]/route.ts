import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const news = await prisma.news.findUnique({
      where: { id: params.id },
    })

    if (!news) {
      return NextResponse.json(
        { error: 'الخبر غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json(news)
  } catch (error) {
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الخبر' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const news = await prisma.news.update({
      where: { id: params.id },
      data: {
        title,
        content,
        ...(imageUrl && { image: imageUrl }),
      },
    })

    return NextResponse.json(news)
  } catch (error) {
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الخبر' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.news.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'تم حذف الخبر بنجاح' })
  } catch (error) {
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف الخبر' },
      { status: 500 }
    )
  }
} 