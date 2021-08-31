export default class MovieType {
    movieId?: number;
    name?: string;
    description?: string;
    genre?: string;
    year? : string;
    rating?: number;
    price?: number;

    moviePrices?: {
        moviePriceId: number;
        price: number;
    }[];
}