import CartType from "../../types/CartType";

export default interface ApiOrderDto {
    orderId: number,
    cartId: number,
    createdAt: string,
    status: "paid" | "not paid" | "waiting",
    cart: CartType,
}