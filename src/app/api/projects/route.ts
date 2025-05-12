import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(projects)
  } catch (error) {
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المشاريع' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const status = formData.get('status') as string
    const image = formData.get('image') as File | null

    let imageUrl = null
    if (image) {
      // TODO: Implement image upload to storage service
      // For now, we'll just store the file name
      imageUrl = `/uploads/${image.name}`
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        status,
        image: imageUrl,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء المشروع' },
      { status: 500 }
    )
  }
} 