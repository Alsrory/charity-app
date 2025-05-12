import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'



export async function POST(req: Request) {
  try {
    const { name, phone, email, password } = await req.json()
    console.log(name, phone, email, password)
    // Validate required fields
    if (!name || !phone || !password) {
      return NextResponse.json(
        { error: 'الرجاء إدخال جميع الحقول المطلوبة' },
        { status: 400 }
      )
    }

    // Check if phone number already exists
    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber: phone }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'رقم الهاتف مسجل مسبقاً' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        phoneNumber: phone,
        email: email || '',
        password: hashedPassword,
        role: 'MEMBER',
        memberType: 'NON_MEMBER'
      }
    })

    return NextResponse.json(
      { message: 'تم إنشاء الحساب بنجاح', user },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الحساب' },
      { status: 500 }
    )
  }
} 