import { Handlers } from "$fresh/server.ts";
import { Film } from "../types.ts";

export const handler:Handlers = {
    GET: async (req: Request) => {
        const data = await fetch("https://filmapi.vercel.app/api/films");
        const films:Film[] = await data.json();
        return new Response(JSON.stringify(films), {
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}