import * as Validator from "class-validator";

export class EditMovieInCartDto {
    movieId: number;
    
    @Validator.IsNotEmpty()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 0
    })
    quantity: number;
}