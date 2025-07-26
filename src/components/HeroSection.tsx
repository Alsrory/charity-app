import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <>
     <div className="w-full h-52 relative ">
  <Image
    src="/slid.png"
    alt="آية قرآنية"
    fill
    className=" pt-14 md:pt-20 "
    priority
  />
</div>


      
      <section className="pt-32 pb-20 bg-primary/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative py-2 mx-auto w-44 h-44 rounded-full bg-primary/10 flex items-center justify-center">
              <Image
                src="/Chartiy_Aldohara.png"
                alt="شعار الجمعية"
                width={96}
                height={96}
                className="h-40 w-40  rounded-full object-cover"
              />
            </div>
            <div className="text-center md:text-right">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                جمعية التلاحم الخيرية المجتمعية
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                نسعى لبناء مجتمع متكافل من خلال مبادرات وبرامج تنموية مستدامة تلبي احتياجات المجتمع
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 text-center"
                >
                  انضم إلينا
                </Link>
                <Link
                  href="#about"
                  className="bg-white text-primary border border-primary px-6 py-3 rounded-lg hover:bg-primary/10 text-center"
                >
                  تعرف علينا
                </Link>
              </div>
            </div>
            {/* <div className="">
              <Image
                src="/images/hero-image.jpg"
                alt="صورة الجمعية"
                fill
                className="object-cover rounded-lg shadow-xl"
                priority
              />
            </div> */}
          
          </div>
        </div>
      </section></>
  )
} 