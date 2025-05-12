import Image from 'next/image'
import Link from 'next/link'

const projects = [
  {
    id: 1,
    title: 'مشروع كفالة الأيتام',
    description: 'مشروع يهدف إلى رعاية الأيتام وتوفير احتياجاتهم الأساسية والتعليمية.',
    image: '/image.png',
    status: 'مكتمل',
  },
  {
    id: 2,
    title: 'مشروع المساعدات الغذائية',
    description: 'توفير سلال غذائية شهرية للأسر المحتاجة في مختلف مناطق المملكة.',
    image: '/image.png',
    status: 'جاري',
  },
  {
    id: 3,
    title: 'مشروع التعليم المستمر',
    description: 'دعم الطلاب المتفوقين من الأسر ذات الدخل المحدود وتوفير المنح الدراسية.',
    image: '/image.png',
    status: 'جاري',
  },
]

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">المشاريع</h2>
          <div className="h-1 w-24 bg-primary mx-auto"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            نعمل على تنفيذ مشاريع متنوعة تهدف إلى تحسين حياة المجتمع وتلبية احتياجاته المختلفة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden group">
              <div className="relative h-48">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    project.status === 'مكتمل' ? 'bg-green-100 text-green-800' : 'bg-primary/10 text-primary'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <Link
                  href={`/projects/${project.id}`}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  تفاصيل المشروع
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/projects"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90"
          >
            عرض جميع المشاريع
          </Link>
        </div>
      </div>
    </section>
  )
} 