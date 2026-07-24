namespace BACKEND.Data.DTOs.Invoices
{
    public class UpdateInvoiceDto
    {
        public string? Status { get; set; }

        public decimal Subtotal { get; set; }

        public decimal GstAmount { get; set; }

        public decimal TotalAmount { get; set; }
    }
}