export type Film = {
    _id: string,
    brand: string,
    name: string,
    iso: number,
    formatThirtyFive: boolean,
    formatOneTwenty: boolean,
    color: boolean,
    process: string,
    staticImageUrl: string,
    description: string,
    keyFeatures: Feature[]
}

type Feature = {
    _id: string,
    feature: string
}

export type Project = {
    name: string,
    films: string[] //Ids de las peliculas
}