import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import html2pdf from 'html2pdf.js'
import ReceiptTemplate from './ReceiptTemplate'

export interface PaymentData {
  id: string
  name: string
  phoneNumber: string
  memberType: 'NON_MEMBER' | 'AFFILIATED'
  affiliation: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  paidAt: string | null
  amount: number
  method: string | null
}

interface PaymentModalProps {
  show: boolean
  onClose: () => void
  selectedUser: PaymentData | null
  month: number
  year: number
  onSuccess: () => void
}

export default function PaymentModal({
  show,
  onClose,
  selectedUser,
  month,
  year,
  onSuccess
}: PaymentModalProps) {
  const [paymentAmount, setPaymentAmount] = useState({amount: '', description: ''})
  const [receiptNumber, setReceiptNumber] = useState('')
  const [showReceipt, setShowReceipt] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const receiptRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (show) {
      const generateReceiptNumber = async () => {
        try {
          const response = await axios.get('/api/admin/payments/last-receipt')
          const lastNumber = response.data.lastNumber || 0
          setReceiptNumber(String(lastNumber + 1).padStart(6, '0'))
        } catch (error) {
          console.error('Error generating receipt number:', error)
          setReceiptNumber('000001')
        }
      }
      generateReceiptNumber()
    }
  }, [show])

  const handlePrint = async () => {
    if (!receiptRef.current) return

    const element = receiptRef.current
    const opt = {
      margin: 10,
      filename: `سند_دفع_${receiptNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    }

    try {
      await html2pdf().set(opt).from(element).save()
      setShowReceipt(false)
      onClose()
      setPaymentAmount({amount: '', description: ''})
      onSuccess()
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('حدث خطأ أثناء إنشاء ملف PDF')
    }
  }

  const handleAddPayment = async () => {
    if (!selectedUser) return

    if (!paymentAmount.amount || Number(paymentAmount.amount) <= 0) {
      toast.error('الرجاء إدخال مبلغ صحيح')
      return
    }

    try {
      setIsLoading(true)
      await axios.post('/api/admin/payments', {
        userId: selectedUser.id,
        month,
        year,
        amount: Number(paymentAmount.amount),
        method: 'CASH',
        receiptNumber
      })
      
      toast.success('تم تسجيل الدفع بنجاح')
      setShowReceipt(true)
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'حدث خطأ أثناء تسجيل الدفع')
    } finally {
      setIsLoading(false)
    }
  }

  if (!show || !selectedUser) return null

  if (showReceipt) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-4 mx-6 w-full md:w-fit  overflow-y-auto h-full  mt-10 ">
          <ReceiptTemplate
            ref={receiptRef}
            receiptNumber={receiptNumber}
            selectedUser={selectedUser}
            amount={paymentAmount.amount}
          />
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={() => {
                setShowReceipt(false)
                onClose()
                setPaymentAmount({amount: '', description: ''})
              }}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              إغلاق
            </button>
            <button
              onClick={handlePrint}
              className="bg-primary text-white px-6 py-2 rounded hover:bg-green-600"
            >
              طباعة السند
            </button>
          </div>
        </div>
      </div>
    )
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setPaymentAmount(prev => ({ ...prev, [name]: value }))
    
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[500px]">
        {/* رأس النموذج */}
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <h2 className="text-xl font-bold text-gray-600">Charity Organization</h2>
          <div className="relative w-16 h-16">
            <Image
              src="/logo.png"
              alt="شعار الجمعية"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-bold text-gray-600">جمعية التلاحم الخيرية <br/> تعز-المعافر <br/>الشعوبة-الظهرة </h2>
        </div>

        {/* معلومات العضو */}
        <div className="mb-4 bg-gray-50 p-4 rounded-lg">
          <div className="grid gap-8">
            <div className='flex gap-x-5 px-10'>
              <p className="text-gray-600">الاسم:</p>
              <p className="font-semibold text-center w-full border border-gray-300 p-2 rounded">{selectedUser.name}</p>
            </div>
            <div className='flex gap-x-3 px-10'>
              <p className="text-gray-600">رقم الهاتف:</p>
              <p className="font-semibold border border-gray-300 p-2 rounded flex-1">{selectedUser.phoneNumber}</p>
            </div>
            <div className='flex gap-x-5 px-10'>
              <p className="text-gray-600">نوع العضو:</p>
              <p className="font-semibold border border-gray-300 p-2 rounded flex-1">
                {selectedUser.memberType === 'AFFILIATED' ? 'منتسب' : 'غير منتسب'}
              </p>
            </div>
            <div className='flex gap-x-5 px-10'>
              <p className="text-gray-600">رقم السند:</p>
              <p className="font-semibold border border-gray-300 p-2 rounded flex-1">{receiptNumber}</p>
            </div>
          </div>
        </div>

        {/* حقل المبلغ */}
        <div className=" flex gap-x-6 px-1 mb-4">
          <label className="block text-gray-600 mb-1">المبلغ</label>
          <div className="relative">
            <input
              type="number"
              name="amount"
              value={paymentAmount.amount}
              onChange={handleChange}
              className="w-full border rounded p-2 pl-12 text-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="أدخل المبلغ"
              min="0"
            />
            <span className="absolute left-3 top-2 text-gray-500">ر.ي</span>
          </div>
        </div>
        <div className='flex gap-x-5 px-1 mb-2'>
          <label className="block text-gray-600 ">الوصف:</label>
          <div className="relative">
            <input
              type="text"
              name="description"
              value={paymentAmount.description}
              onChange={handleChange}
            className="w-full border rounded p-2 pl-12 text-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="أدخل الوصف"
            />
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              onClose()
              setPaymentAmount({amount: '', description: ''})
            }}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            إلغاء
          </button>
          <button
            onClick={handleAddPayment}
            disabled={isLoading}
            className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/70 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري الحفظ...
              </>
            ) : (
              'تأكيد الدفع'
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 