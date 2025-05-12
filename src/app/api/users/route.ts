import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextAuth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET /api/users - Get all users
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // التحقق من تسجيل الدخول وصلاحيات المدير
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: 'غير مصرح لك بالوصول إلى هذه البيانات' },
    //     { status: 403 }
    //   )
    // }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        affiliation: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب بيانات المستخدمين' },
      { status: 500 }
    )
  }
}

// POST /api/users - Create a new user
export async function POST(request: Request) {
  try {
    // const session = await getServerSession(authOptions)
    
    // التحقق من تسجيل الدخول وصلاحيات المدير
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: 'غير مصرح لك بإنشاء مستخدمين جدد' },
    //     { status: 403 }
    //   )
    // }

    const body = await request.json()
    const { name, email, password, role, affiliation, phoneNumber } = body

    // التحقق من البيانات المطلوبة
    if (!name || !email || !password || !role || !phoneNumber) {
      return NextResponse.json(
        { error: 'جميع الحقول المطلوبة يجب ملؤها' },
        { status: 400 }
      )
    }

    // التحقق من عدم وجود البريد الإلكتروني مسبقاً
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      )
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10)

    // إنشاء المستخدم
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        affiliation: affiliation || null,
        phoneNumber,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        affiliation: true,
        createdAt: true,
        phoneNumber: true,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء المستخدم' },
      { status: 500 }
    )
  }
}
