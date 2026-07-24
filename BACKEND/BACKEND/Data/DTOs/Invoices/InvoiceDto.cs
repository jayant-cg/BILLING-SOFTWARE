namespace BACKEND.Data.DTOs.Invoices
{
    public class InvoiceDto
    {
        public int Id { get; set; }

        public string InvoiceNo { get; set; } = string.Empty;

        public int BuyerId { get; set; }

        public string BuyerName { get; set; } = string.Empty;

        public DateOnly InvoiceDate { get; set; }

        public decimal Subtotal { get; set; }

        public decimal GstAmount { get; set; }

        public decimal TotalAmount { get; set; }

        public string? Status { get; set; }
    }
}