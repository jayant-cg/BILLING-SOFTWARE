using System;
using System.Collections.Generic;

namespace BACKEND.Entities;

public partial class Invoice
{
    public int Id { get; set; }

    public string InvoiceNo { get; set; } = null!;

    public int BuyerId { get; set; }

    public DateOnly InvoiceDate { get; set; }

    public decimal Subtotal { get; set; }

    public decimal GstAmount { get; set; }

    public decimal TotalAmount { get; set; }

    public string? PdfPath { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public virtual Buyer Buyer { get; set; } = null!;

    public virtual ICollection<InvoiceItem> InvoiceItems { get; set; } = new List<InvoiceItem>();
}