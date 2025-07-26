'use client'

import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { CSVLink } from 'react-csv'
import { toast } from 'react-hot-toast'
import html2pdf from 'html2pdf.js'
import PaymentModal, { PaymentData } from './PaymentModal'

export default function PaymentsPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [data, setData] = useState<PaymentData[]>([])
  const [loading, setLoading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<PaymentData | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/admin/payments?month=${month}&year=${year}`)
      setData(response.data)
    } catch (error: any) {
      console.error('Error details:', error.response?.data || error.message)
      toast.error(error.response?.data?.error || 'حدث خطأ أثناء جلب البيانات')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [month, year])

  const csvData = data.map(item => ({
    'الاسم': item.name,
    'رقم الهاتف': item.phoneNumber,
    'نوع العضو': item.memberType === 'AFFILIATED' ? 'منتسب' : 'غير منتسب',
    'حالة الدفع': item.status === 'COMPLETED' ? 'مدفوع' : 'غير مدفوع',
    'تاريخ الدفع': item.paidAt ? new Date(item.paidAt).toLocaleDateString('ar-SA') : '-',
    'المبلغ': item.amount,
    'طريقة الدفع': item.method || '-'
  }))

  const printPdf = async () => {
    if (!tableRef.current) return

    const element = tableRef.current
    const opt = {
      margin: 10,
      filename: `دفع_الاشتراكات_${year}_${month}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'landscape' 
      }
    }

    try {
      await html2pdf().set(opt).from(element).save()
      toast.success('تم تصدير الملف بنجاح')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('حدث خطأ أثناء إنشاء ملف PDF')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">دفع الاشتراكات</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex gap-4 mb-6 items-center">
          <div className="flex gap-2">
            <select
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
              className="border rounded p-2"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="border rounded p-2"
            >
              {[2023, 2024, 2025].map(y => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => printPdf()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            تصدير PDF
          </button>
          <CSVLink
            data={csvData}
            filename={`payments-${year}-${month}.csv`}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            تصدير CSV
          </CSVLink>
        </div>

        {loading ? (
          <div className="text-center">جاري التحميل...</div>
        ) : (
          <div ref={tableRef} className="overflow-x-auto rounded-lg shadow-lg">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold">دفع الاشتراكات</h2>
              <p className="text-gray-600">شهر {month} - {year}</p>
            </div>
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="p-3 text-right font-semibold text-sm md:text-base ">الاسم</th>
                  <th className="p-3 text-right font-semibold text-sm md:text-base whitespace-nowrap">رقم الهاتف</th>
                  <th className="p-3 text-right font-semibold text-sm md:text-base whitespace-nowrap">نوع العضو</th>
                  <th className="p-3 text-right font-semibold text-sm md:text-base whitespace-nowrap">حالة الدفع</th>
                  <th className="p-3 text-right font-semibold text-sm md:text-base whitespace-nowrap">تاريخ الدفع</th>
                  <th className="p-3 text-right font-semibold text-sm md:text-base whitespace-nowrap">المبلغ</th>
                  <th className="p-3 text-right font-semibold text-sm md:text-base whitespace-nowrap">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-sm md:text-base">
                      <div className="min-h-[80px] flex items-center justify-center">
                        {user.name}
                      </div>
                    </td>
                    <td className="p-3 text-sm md:text-base whitespace-nowrap">{user.phoneNumber}</td>
                    <td className="p-3 text-sm md:text-base whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs md:text-sm ${
                        user.memberType === 'AFFILIATED' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.memberType === 'AFFILIATED' ? 'منتسب' : 'غير منتسب'}
                      </span>
                    </td>
                    <td className="p-3 text-sm md:text-base whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs md:text-sm ${
                        user.status === 'COMPLETED' 
                          ? 'bg-green-100 text-green-800' 
                          : user.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 'COMPLETED' 
                          ? 'مدفوع' 
                          : user.status === 'PENDING'
                          ? 'قيد الانتظار'
                          : 'فشل'}
                      </span>
                    </td>
                    <td className="p-3 text-sm md:text-base whitespace-nowrap">
                      {user.paidAt ? new Date(user.paidAt).toLocaleDateString('ar-SA') : '-'}
                    </td>
                    <td className="p-3 text-sm md:text-base whitespace-nowrap font-medium">
                      {user.amount ? `${user.amount} ريال` : '-'}
                    </td>
                    <td className="p-3 text-sm md:text-base whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setShowPaymentModal(true)
                        }}
                        className="bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors text-xs md:text-sm"
                      >
                        دفع
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PaymentModal
        show={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false)
          setSelectedUser(null)
        }}
        selectedUser={selectedUser}
        month={month}
        year={year}
        onSuccess={fetchData}
      />
    </div>
  )
} 