namespace BACKEND.Data.DTOs.Invoices
{
    public class GenerateInvoiceDto
    {
        public int BuyerId { get; set; }

        public List<GenerateInvoiceItemDto> Items { get; set; }
            = new();
    }
}