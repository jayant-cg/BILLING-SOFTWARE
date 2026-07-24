namespace BACKEND.Data.DTOs.Products
{
    public class CreateProductDto
    {
        public int CategoryId { get; set; }

        public string ModelName { get; set; } = string.Empty;

        public decimal DefaultPrice { get; set; }
    }
}
namespace BACKEND.Data.DTOs.Products
{
    public class UpdateProductDto
    {
        public int CategoryId { get; set; }

        public string ModelName { get; set; } = string.Empty;

        public decimal DefaultPrice { get; set; }

        public bool IsActive { get; set; }
    }
}