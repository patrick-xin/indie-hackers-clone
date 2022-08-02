import { DefaultSession } from 'next-auth';

// declare module 'next-auth/jwt' {
//   /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
//   interface JWT {
//     /** OpenID ID Token */
//     id?: string;
//     image: string;
//     username: string;
//     email: string;
//     name:string
//   }
// }
declare module 'next-auth' {
  type DefaultSessionUser = NonNullable<DefaultSession['user']>;
  type CalendsoSessionUser = DefaultSessionUser & {
    username: string;
    image: string;
    impersonatedByUID?: number;
    id?: string;
  };
  interface Session {
    user: CalendsoSessionUser;
  }
}
