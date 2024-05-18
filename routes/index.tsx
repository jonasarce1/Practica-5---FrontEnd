import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET: async () => {
    const headers = new Headers({
      location: "/films",
    });
    return new Response(null, {
      status: 302,
      headers,
    });
  },
};