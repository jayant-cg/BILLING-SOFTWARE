namespace BACKEND.Data.DTOs.BuyerProductPrices
{
    public class UpdateBuyerProductPriceDto
    {
        public int BuyerId { get; set; }

        public int ProductId { get; set; }

        public decimal Rate { get; set; }
    }
}