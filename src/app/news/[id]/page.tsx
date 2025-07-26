import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

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
    image: '/images/education.jpg',
    date: '2024-03-10',
  },
  {
    id: 3,
    title: 'حملة توعية صحية',
    content: 'نظمت الجمعية حملة توعية صحية شاملة لتعزيز الوعي الصحي في المجتمع.',
    image: '/images/health.jpg',
    date: '2024-03-05',
  },
];

export default function NewsDetail({ params }: { params: { id: string } }) {
  const item = news.find((n) => n.id === Number(params.id));
  if (!item) return notFound();

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <Image src={item.image} alt={item.title} width={800} height={400} className="rounded-lg object-cover w-full h-64" />
        </div>
        <div className="text-sm text-gray-500 mb-2">
          {new Date(item.date).toLocaleDateString('ar-SA')}
        </div>
        <h1 className="text-2xl font-bold mb-4">{item.title}</h1>
        <p className="text-gray-700 mb-8 text-lg leading-relaxed">{item.content}</p>
        <Link href="/news" className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90">عودة للأخبار</Link>
      </div>
    </section>
  );
} 