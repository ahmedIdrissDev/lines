import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
const authorized = [
    {
      email:'YassineBerred@tgcc.teams',
      name:'Yassine Berred',
      role:'Admin'
    } ,
        {
      email:'kbidaAbedelmjid@tgcc.teams',
      name:'kbida Abedelmjid',
      role:'Chef-de-Chantier'
    }
]
export const authOptions = {
  providers: [
    CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "email", type: "text", placeholder: "kbida@tgcc.teams" },
    },
    async authorize(credentials, req) {
       const  userEmail = credentials?.email as string
       const user = authorized.find(({email})=> email=== userEmail)
      if (user) {
        // Any object returned will be saved in `user` property of the JWT
        return user
      } else {
        // If you return null then an error will be displayed advising the user to check their details.
        return null

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


