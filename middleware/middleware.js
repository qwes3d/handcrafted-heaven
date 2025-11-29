import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname;

      // SELLER ROUTES
      if (path.startsWith("/seller"))
        return token?.role === "seller" || token?.role === "admin";

      // ADMIN ROUTES
      if (path.startsWith("/admin"))
        return token?.role === "admin";

      // Public pages
      return true;
    },
  },
});

export const config = {
  matcher: ["/seller/:path*", "/admin/:path*"],
};
