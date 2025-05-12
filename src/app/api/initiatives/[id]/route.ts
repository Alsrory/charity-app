import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const initiative = await prisma.initiative.findUnique({
      where: { id: params.id },
    })

    if (!initiative) {
      return NextResponse.json(
        { error: 'المبادرة غير موجودة' },
        { status: 404 }
      )
    }

    return NextResponse.json(initiative)
  } catch (error) {
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المبادرة' },
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
    const image = formData.get('image') as File | null

    let imageUrl = null
    if (image) {
      // TODO: Implement image upload to storage service
      imageUrl = `/uploads/${image.name}`
    }

    const initiative = await prisma.initiative.update({
      where: { id: params.id },
      data: {
        title,
        description,
        ...(imageUrl && { image: imageUrl }),
      },
    })

    return NextResponse.json(initiative)
  } catch (error) {
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث المبادرة' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.initiative.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'تم حذف المبادرة بنجاح' })
  } catch (error) {
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف المبادرة' },
      { status: 500 }
    )
  }
} 