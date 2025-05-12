import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المشروع' },
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
    const description = formData.get('description') as string
    const status = formData.get('status') as string
    const image = formData.get('image') as File | null

    let imageUrl = null
    if (image) {
      // TODO: Implement image upload to storage service
      imageUrl = `/uploads/${image.name}`
    }

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        title,
        description,
        status,
        ...(imageUrl && { image: imageUrl }),
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث المشروع' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.project.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'تم حذف المشروع بنجاح' })
  } catch (error) {
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف المشروع' },
      { status: 500 }
    )
  }
} 