namespace BACKEND.Data.DTOs.InvoiceItems
{
    public class UpdateInvoiceItemDto
    {
        public int ProductId { get; set; }

        public int Qty { get; set; }

        public decimal Rate { get; set; }

        public decimal GstRate { get; set; }
    }
}