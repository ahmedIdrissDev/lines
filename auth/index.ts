import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import Login from "@/functions";

export const authOptions = {
  providers: [
    CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "email", type: "text", placeholder: "kbida@tgcc.teams" },
      password: { label: "password", type: "password", placeholder: "kbida@tgcc.teams" },

    },
    async authorize(credentials, req) {
       const data ={
           email: credentials?.email as string ,
           password: credentials?.password as string
       }
       const user = await Login(data)
      if (user) {
        return user
      } else {
        // If you return null then an error will be displayed advising the user to check their details.
         throw new Error('user not fount')

        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
      }
    }
    
  }) ,
  
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!
  })
  ],
 callbacks: {
 async jwt({ token, user }) {
    if (user) {
      token.user = user  // save user in token
    }
    return token
  },
  async session({ session, token }) {
    session.user = token.user  // attach token user to session
    return session
  }
} ,

secret: process.env.NEXTAUTH_SECRET,
  pages:{
    signIn:'/'
  } ,
  
};


