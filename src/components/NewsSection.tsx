import Image from 'next/image'
import Link from 'next/link'

const news = [
  {
    id: 1,
    title: 'إطلاق مبادرة الغذاء للجميع',
    content: 'أطلقت الجمعية مبادرة الغذاء للجميع لتوفير وجبات غذائية للأسر المحتاجة على مدار العام.',
    image: '/images/food.jpg',
    date: '2024-03-15',
  },
  {
    id: 2,
    title: 'افتتاح مركز تعليمي جديد',
    content: 'تم افتتاح مركز تعليمي جديد لدعم الطلاب المتفوقين من الأسر ذات الدخل المحدود.',
    image: '/images/school.jpg',
    date: '2024-03-10',
  },
  {
    id: 3,
    title: 'حملة توعية صحية',
    content: 'نظمت الجمعية حملة توعية صحية شاملة لتعزيز الوعي الصحي في المجتمع.',
    image: '/images/health.jpg',
    date: '2024-03-05',
  },
]

export default function NewsSection() {
  return (
    <section id="news" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">آخر الأخبار</h2>
          <div className="h-1 w-24 bg-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">
                  {new Date(item.date).toLocaleDateString('ar-SA')}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.content}</p>
                <Link
                  href={`/news/${item.id}`}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  اقرأ المزيد
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/news"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90"
          >
            عرض جميع الأخبار
          </Link>
        </div>
      </div>
    </section>
  )
} 