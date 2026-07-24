namespace BACKEND.Data.DTOs.Invoices
{
    public class CreateInvoiceDto
    {
        public int BuyerId { get; set; }

        public decimal Subtotal { get; set; }

        public decimal GstAmount { get; set; }

        public decimal TotalAmount { get; set; }
    }
}