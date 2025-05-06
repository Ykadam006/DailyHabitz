import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions"; // ✅ correct import

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions }; // ✅ required exports
 // ✅ required exports
