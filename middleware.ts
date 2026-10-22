import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({ 
  publicRoutes:["/", "/sign-in(.*)", "/sign-up(.*)", "/search(.*)", "/courses(.*)", "/api/courses", "/api/courses/(.*)", "/api/teachers/(.*)", "/api/uploadthing(.*)", "/api/webhook(.*)"]
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
