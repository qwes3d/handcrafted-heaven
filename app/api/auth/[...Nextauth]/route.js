// app/api/auth/[...nextauth]/route.js
import { handlers } from "@/lib/authconfig";
export const { GET, POST } = handlers;
