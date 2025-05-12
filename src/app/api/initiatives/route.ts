import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { authOptions } from '@/lib/nextAuth';
import { getServerSession } from 'next-auth';

// export async function GET() {
//   try {
//     const initiatives = await prisma.initiative.findMany({
//       orderBy: {
//         createdAt: 'desc',
//       },
//     })
    
//     return NextResponse.json(initiatives)
//   } catch (error) {
//     console.error('Error fetching initiatives:', error)
//     return NextResponse.json(
//       { error: 'حدث خطأ أثناء جلب المبادرات' },
//       { status: 500 }
//     )
//   }
// }
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const initiatives = await prisma.initiative.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(initiatives);
  } catch (error) {
    console.error("Error fetching initiatives:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب المبادرات" },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    console.log('Received POST request to /api/initiatives')
    const formData = await request.formData()
    console.log('Form data received:', {
      title: formData.get('title'),
      description: formData.get('description'),
      hasImage: formData.has('image')
    })

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const image = formData.get('image') as File | null

    if (!title || !description) {
      console.error('Missing required fields:', { title, description })
      return NextResponse.json(
        { error: 'العنوان والوصف مطلوبان' },
        { status: 400 }
      )
    }

    let imageUrl = null
    if (image) {
      // TODO: Implement image upload to storage service
      imageUrl = `/uploads/${image.name}`
    }

    console.log('Creating initiative with data:', {
      title,
      description,
      image: imageUrl
    })

    const initiative = await prisma.initiative.create({
      data: {
        title,
        description,
        image: imageUrl,
      },
    })

    console.log('Initiative created successfully:', initiative)
    return NextResponse.json(initiative)
  } catch (error) {
    console.error('Error creating initiative:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء المبادرة' },
      { status: 500 }
    )
  }
} 

// import { NextResponse } from 'next/server';
// import { prisma } from '../../../lib/prisma';
// import formidable from 'formidable'
// import fs from 'fs';
// import path from 'path';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export async function POST(req: Request) {
//   try {
//     const form = formidable({ multiples: false, keepExtensions: true });

//     // تحويل stream إلى request القابل للمعالجة
//     const buffer = await req.arrayBuffer();
//     const formDataBuffer = Buffer.from(buffer);

//     // إنشاء مجلد الرفع إن لم يكن موجودًا
//     const uploadDir = path.join(process.cwd(), 'public/uploads');
//     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

//     const { fields, files }: any = await new Promise((resolve, reject) => {
//       form.parse(
//         { headers: req.headers, buffer: formDataBuffer } as any,
//         (err, fields, files) => {
//           if (err) reject(err);
//           else resolve({ fields, files });
//         }
//       );
//     });

//     const title = fields.title?.[0] || '';
//     const description = fields.description?.[0] || '';
//     const uploadedImage = files.image;

//     let imageUrl = null;

//     if (uploadedImage) {
//       const tempPath = uploadedImage.filepath;
//       const ext = path.extname(uploadedImage.originalFilename);
//       const newFileName = `initiative-${Date.now()}${ext}`;
//       const newPath = path.join(uploadDir, newFileName);

//       fs.renameSync(tempPath, newPath);
//       imageUrl = `/uploads/${newFileName}`;
//     }

//     const initiative = await prisma.initiative.create({
//       data: {
//         title,
//         description,
//         image: imageUrl,
//       },
//     });

//     return NextResponse.json(initiative);
//   } catch (error) {
//     console.error('Error creating initiative:', error);
//     return NextResponse.json(
//       { error: 'حدث خطأ أثناء إنشاء المبادرة' },
//       { status: 500 }
//     );
//   }
// }
