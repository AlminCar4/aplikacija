export default interface ApiMovieDto {
    movieId: number;
    name: string;
    description: string;
    genre: string;
    year: string;
    rating: number;
    moviePrices: {
        moviePriceId: number;
        price: number;
    }[];
}