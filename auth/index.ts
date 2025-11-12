import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
export const authOptions = {
  providers: [
    CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "email", type: "text", placeholder: "kbida@tgcc.teams" },
    },
    async authorize(credentials, req) {
       const  email = credentials?.email
       const user = { id: "1", name: "tgcc", email , role:'user'}
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
  
  secret: process.env.NEXTAUTH_SECRET,
  pages:{
    signIn:'/'
  } ,
  
};


