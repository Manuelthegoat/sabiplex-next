export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-us", {
        style: "currency",
        currency: "NGN",
        currencyDisplay: "narrowSymbol"
    }).format(price)
}