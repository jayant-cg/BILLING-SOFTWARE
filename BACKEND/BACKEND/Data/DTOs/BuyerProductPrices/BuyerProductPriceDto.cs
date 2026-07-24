namespace BACKEND.Data.DTOs.BuyerProductPrices
{
    public class BuyerProductPriceDto
    {
        public int Id { get; set; }

        public int BuyerId { get; set; }

        public string BuyerName { get; set; } = string.Empty;

        public int ProductId { get; set; }

        public string ProductName { get; set; } = string.Empty;

        public decimal Rate { get; set; }
    }
}