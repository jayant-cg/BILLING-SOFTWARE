namespace BACKEND.Data.DTOs.InvoiceItems
{
    public class CreateInvoiceItemDto
    {
        public int InvoiceId { get; set; }

        public int ProductId { get; set; }

        public int Qty { get; set; }

        public decimal Rate { get; set; }

        public decimal GstRate { get; set; }
    }
}