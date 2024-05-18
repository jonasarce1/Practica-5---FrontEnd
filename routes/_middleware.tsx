import { FreshContext, Handlers } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";

export const handler = async(req: Request, ctx: FreshContext) => {
    if (ctx.route === "/projects") {
        const cookies = getCookies(req.headers);
        const projectsCookie = cookies.projects;
  
        if (!projectsCookie) {
          return new Response("", {
            status: 302,
            headers: {
              location: "/noProjects"
            }
          });
        }
  
        try {
          const projects = JSON.parse(projectsCookie);
          if (!projects || projects.length === 0) {
            return new Response("", {
              status: 302,
              headers: {
                location: "/noProjects"
              }
            });
          }
        } catch (error) {
          // Si hay un error al parsear, redirige a /noProjects
          return new Response("", {
            status: 302,
            headers: {
              location: "/noProjects"
            }
          });
        }
      }
  
      const resp = await ctx.next(); // Continua
      return resp;
}