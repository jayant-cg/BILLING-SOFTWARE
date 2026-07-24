namespace BACKEND.Data.DTOs.Products
{
    public class ProductDto
    {
        public int Id { get; set; }

        public int CategoryId { get; set; }

        public string CategoryName { get; set; } = string.Empty;

        public string ModelName { get; set; } = string.Empty;

        public decimal DefaultPrice { get; set; }

        public bool IsActive { get; set; }
    }
}