import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { use } from "react";

export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt'
    },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      type: 'credentials',
      async authorize(credentials, req) {
        console.log(credentials, 'credentials')
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "email": credentials.email,
            "password": credentials.password
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw
        };

        const res = await fetch('api/user_accounts/login', requestOptions)
        console.log(res, "res")
        const user = await res.json();

        if(user.status === 'true') {
            return user
        }
        else {
          return null
        }
  
      }
    })
  ],
  callbacks: {
    async jwt({ user, account, token, trigger, session }) {
      //   update token if user is returned
      console.log('jwt', user);
      if (user) {
        token.user = user;
        // console.log('token user ' + JSON.stringify(token.user))
      }

      // update the trigger to include patient_id
      if(trigger === 'update') {
        token.user = session.user
      }
      //   return final_token
      return token;
    },
    async session({ session, token, user }) {
      //  update session from token
      console.log('session', session);
      session.user = token.user; // you can add the properties you want instead of overwriting the session.user
      // console.log( 'Session user ' + JSON.stringify(session.user) )
      return session;
    },
  },
  pages: {
    signIn: '/login'
  }
}

export default NextAuth(authOptions)