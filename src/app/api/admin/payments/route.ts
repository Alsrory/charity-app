import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextAuth'
import { prisma } from '@/lib/prisma'

// جلب تقرير المدفوعات الشهري
export async function GET(request: Request) {
  try {
    //const session = await getServerSession(authOptions)
    
    // if (!session?.user?.id || session.user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: 'غير مصرح لك بالوصول' },
    //     { status: 401 }
    //   )
    // }

    const { searchParams } = new URL(request.url)
    const month = Number(searchParams.get('month'))
    const year = Number(searchParams.get('year'))

    if (!month || !year) {
      return NextResponse.json(
        { error: 'يجب تحديد الشهر والسنة' },
        { status: 400 }
      )
    }

    // جلب جميع الأعضاء
    const users = await prisma.user.findMany({
      where: { role: 'MEMBER' },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        memberType: true,
        affiliation: true
      }
    })

    // جلب جميع المدفوعات لهذا الشهر
    const payments = await prisma.payment.findMany({
      where: { month, year },
      select: {
        userId: true,
        status: true,
        createdAt: true,
        amount: true,
        method: true
      }
    })

    // دمج البيانات
    const result = users.map(user => {
      const payment = payments.find(p => p.userId === user.id)
      return {
        ...user,
        status: payment?.status ?? 'PENDING',
        paidAt: payment?.createdAt,
        amount: payment?.amount ?? 0,
        method: payment?.method
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب البيانات' },
      { status: 500 }
    )
  }
}

// إضافة دفع جديد
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    console.log(session?.user.id)
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      )
    }

    const { userId, month, year, amount, method = 'CASH' } = await request.json()

    if (!userId || !month || !year || !amount) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }

    // التحقق من عدم وجود دفع سابق لنفس الشهر
    const existingPayment = await prisma.payment.findFirst({
      where: {
        userId,
        month,
        year
      }
    })

    if (existingPayment) {
      return NextResponse.json(
        { error: 'تم تسجيل الدفع مسبقاً لهذا الشهر' },
        { status: 400 }
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
    // إنشاء الدفع الجديد
    const payment = await prisma.payment.create({
      data: {
        userId,
        month,
        year,
        amount,
        method,
        status: 'COMPLETED',
        createdAt: new Date(), 
        addByAdminID:session.user.id,
        receiptNumber: String(lastNumber + 1).padStart(6, '0')
      }
    })

    return NextResponse.json(payment)
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الدفع' },
      { status: 500 }
    )
  }
} 