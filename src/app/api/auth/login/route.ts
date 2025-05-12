import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'



export async function POST(req: Request) {
  try {
    const { email, phoneNumber } = await req.json()

    // Validate input
    if (!email || !phoneNumber) {
      return NextResponse.json(
        { message: 'البريد الإلكتروني ورقم الهاتف مطلوبان' },
        { status: 400 }
      )
    }

    // Check if user exists
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phoneNumber }
        ]
      }
    })

    // If user doesn't exist, create a new one
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          phoneNumber,
          name: 'مستخدم جديد', // Default name
          password: '', // Empty password for non-members
          memberType: 'NON_MEMBER',
          role: 'MEMBER'
        }
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        memberType: user.memberType
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    return NextResponse.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        memberType: user.memberType
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    )
  }
} 