import Image from 'next/image'

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white to-primary/10 ">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-6 md:mb-6">
          <h2 className="text-3xl font-bold mb-2">عن الجمعية</h2>
          <div className="h-1 w-24 bg-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0 md:gap-y-14 items-center ">
        <div className="relative w-full h-[400px]">
  <Image
    src="/Chartiy_Aldohara.png"
    alt="صورة عن الجمعية"
    width={400} 
    height={400}
    
    className=" mx-auto max-w-[100vh] max-h-[100vh] md:mx-0 object-cover rounded-full shadow-xl "
  />
</div>

           {/* <div className="mb-8 rounded-full bg-primary/10 p-6 inline-block">
              <img 
                src="/image.png" 
                alt="شعار الجمعية" 
                className="h-24 w-24"
              />
            </div> */}

          <div className=" text-center md:text-right space-y-6 pt-14 md:p-0 ">
            <div>
              <h3 className="text-2xl font-bold mb-4">رؤيتنا</h3>
              <p className="text-gray-600">
                أن نكون المؤسسة الخيرية الرائدة في تقديم الخدمات المجتمعية المتميزة، والمساهمة في تحقيق التنمية المستدامة وتعزيز قيم التكافل المجتمعي.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">رسالتنا</h3>
              <p className="text-gray-600">
                جمعيتنا تأسست بهدف خدمة المجتمع وتقديم المساعدة للمحتاجين. نعمل على تنفيذ مشاريع خيرية متنوعة ونسعى دائماً لتوسيع نطاق عملنا ليشمل المزيد من المستفيدين.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">قيمنا</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-gray-600">الشفافية والنزاهة</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-gray-600">التميز في الأداء</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-gray-600">المسؤولية المجتمعية</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-gray-600">الابتكار والإبداع</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-14">
          <div className="bg-primary/5 p-6 rounded-lg text-center">
            <div className="text-4xl font-bold text-primary mb-2">+5000</div>
            <p className="text-gray-600">مستفيد سنوياً</p>
          </div>
          <div className="bg-primary/5 p-6 rounded-lg text-center">
            <div className="text-4xl font-bold text-primary mb-2">+25</div>
            <p className="text-gray-600">مشروع منجز</p>
          </div>
          <div className="bg-primary/5 p-6 rounded-lg text-center">
            <div className="text-4xl font-bold text-primary mb-2">+100</div>
            <p className="text-gray-600">متطوع نشط</p>
          </div>
          <div className="bg-primary/5 p-6 rounded-lg text-center">
            <div className="text-4xl font-bold text-primary mb-2">+1M</div>
            <p className="text-gray-600">ريال تبرعات</p>
          </div>
        </div>
      </div>
    </section>
  )
} 