import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextAuth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      )
    }

    // جلب آخر رقم سند
    const lastPayment = await prisma.payment.findFirst({
      orderBy: {
        receiptNumber: 'desc'
      },
      select: {
        receiptNumber: true
      }
    })

    const lastNumber = lastPayment?.receiptNumber 
      ? parseInt(lastPayment.receiptNumber)
      : 0

    return NextResponse.json({ lastNumber })
  } catch (error) {
    console.error('Error fetching last receipt number:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب رقم السند' },
      { status: 500 }
    )
  }
} 