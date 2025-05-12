import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextAuth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { phone, name } = body

    // التحقق من البيانات المطلوبة
    if (!phone) {
      return NextResponse.json(
        { error: 'رقم الهاتف مطلوب' },
        { status: 400 }
      )
    }

    // التحقق من تنسيق رقم الهاتف
    if (!/^[0-9]{9}$/.test(phone)) {
      return NextResponse.json(
        { error: 'يجب أن يكون رقم الهاتف 9 أرقام' },
        { status: 400 }
      )
    }

    // التحقق من عدم تكرار رقم الهاتف
    const existingUser = await prisma.user.findFirst({
      where: {
        phoneNumber: phone,
        id: { not: session.user.id }
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'رقم الهاتف مستخدم بالفعل' },
        { status: 400 }
      )
    }

    // تحديث بيانات المستخدم
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        phoneNumber: phone,
        name: name || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        affiliation: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error completing profile:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث البيانات' },
      { status: 500 }
    )
  }
} 