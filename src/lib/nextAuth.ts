import { DefaultSession, NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient, UserRole, MemberType } from '@prisma/client'
import { compare } from 'bcryptjs'
//import { prisma } from "@/lib/prisma";



// Extend the session type to include our custom fields
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole
      memberType: MemberType
      phoneNumber?: string
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
    memberType: MemberType
    phoneNumber?: string
  }
}
const prisma = new PrismaClient()
export const authOptions: NextAuthOptions = {
  debug: true,
  
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        phone: { label: 'رقم الهاتف', type: 'text' },
        password: { label: 'كلمة المرور', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) {
          throw new Error('الرجاء إدخال رقم الهاتف وكلمة المرور')
        }

        const user = await prisma.user.findUnique({
          where: { phoneNumber: credentials.phone }
        })

        if (!user || !user.password) {
          throw new Error('بيانات الدخول غير صحيحة')
        }

        const isValid = await compare(credentials.password, user.password)

        if (!isValid) {
          throw new Error('بيانات الدخول غير صحيحة')
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          memberType: user.memberType
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      httpOptions: {
        timeout: 10000 // 10 ثوانٍ بدلًا من 3.5
      },
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      if (account?.provider === 'google') {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })
    
          if (!existingUser) {
            await prisma.user.create({
              data: {
                name: user.name || 'مستخدم جديد',
                email: user.email!,
                password: null,
                phoneNumber: null,
                memberType: MemberType.NON_MEMBER,
                role: UserRole.MEMBER,
              },
            })
          }
    
          return true
        } catch (error) {
          console.error('Error in signIn callback:', error)
          throw new Error('فشل في تسجيل الدخول بـ Google')

        }
      }
    
      return true
    },
    
  //   // signIn: async ({ account }) => {
  //   //   if (account?.provider === 'google') {
  //   //     return true // لا داعي لفعل شيء
  //   //   }
  //   //   return true
  //   // },
    
    
    // async jwt({ token, user }) {
    //   if (user&& user.id) {
    //     token.id = user.id
    //     token.role = (user as any).role || UserRole.MEMBER
    //     token.memberType = (user as any).memberType || MemberType.NON_MEMBER
    //   }
    //   return token
    // },
    async jwt({ token, user}) {
      if(user){
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! }})
      
      if (dbUser) {
        token.id = (user as any).id 
        token.role = (user as any).role || UserRole.MEMBER
        token.memberType = (user as any).memberType || MemberType.NON_MEMBER
      }}
      return token
    },
    
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.memberType = token.memberType as MemberType
      }
      return session
    },
    redirect({ baseUrl }) {
      return `${baseUrl}/`;
    },

    // }

}
}