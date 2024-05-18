import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { Film } from "../../types.ts";

type Data = { 
    film?: Film,
    error?: string
}

export const handler:Handlers = {
    GET: async (req:Request, ctx:FreshContext<unknown, Data>) => {
        const films = await fetch("https://filmapi.vercel.app/api/films");

        const response: Film[] = await films.json();

        const film = response.find(film => film._id === ctx.params._id);

        if (!film) {
            return ctx.render({error: "Film not found"});
        }

        return ctx.render({film});
    }
}

const Page =(props : PageProps<Data>) => {
    const { data } = props;

    if(data.error) {
        return (
            <div className="error-container">
                <h1>Error</h1>
                <p>{data.error}</p>
                <a href="/" className="home-button">Home</a>
            </div>
        )
    }

    if(data.film){
        return (
            <div className="film-container">
                <h1>{data.film.name}</h1>
                <img src={data.film.staticImageUrl} alt={data.film.name} className="film-image" />
                <p><strong>Brand:</strong> {data.film.brand}</p>
                <p><strong>ISO:</strong> {data.film.iso}</p>
                <p><strong>Format 35mm:</strong> {data.film.formatThirtyFive ? "Yes" : "No"}</p>
                <p><strong>Format 120:</strong> {data.film.formatOneTwenty ? "Yes" : "No"}</p>
                <p><strong>Color:</strong> {data.film.color ? "Color" : "Black and White"}</p>
                <p><strong>Process:</strong> {data.film.process}</p>
                <p><strong>Description:</strong> {data.film.description}</p>
                <ul>
                    <strong>Key Features:</strong>
                    {data.film.keyFeatures.map(feature => (
                        <li key={feature._id}>{feature.feature}</li>
                    ))}
                </ul>
                <a href="/" className="home-button">Home</a>
            </div>
        )
    }
}

export default Page