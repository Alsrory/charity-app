import { DefaultSession, NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient, UserRole, MemberType } from '@prisma/client'
import { compare } from 'bcryptjs'
import { prisma } from "@/lib/prisma";



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
                email: user.email!,
                name: user.name || 'مستخدم جديد',
                password: null,
                phoneNumber: '',
                memberType: MemberType.NON_MEMBER,
                role: UserRole.MEMBER,
              },
            })
          }
    
          return true
        } catch (error) {
          console.error('Error in signIn callback:', error)
          return false
        }
      }
    
      return true
    },
    
    // signIn: async ({ account }) => {
    //   if (account?.provider === 'google') {
    //     return true // لا داعي لفعل شيء
    //   }
    //   return true
    // },
    
    
    // async jwt({ token, user }) {
    //   if (user&& user.id) {
    //     token.id = user.id
    //     token.role = (user as any).role || UserRole.MEMBER
    //     token.memberType = (user as any).memberType || MemberType.NON_MEMBER
    //   }
    //   return token
    // },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = (user as any).id || (token.id ?? token.sub)
        token.role = (user as any).role || UserRole.MEMBER
        token.memberType = (user as any).memberType || MemberType.NON_MEMBER
      }
      return token
    },
    
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.memberType = token.memberType
      }
      return session
    }
  }
}