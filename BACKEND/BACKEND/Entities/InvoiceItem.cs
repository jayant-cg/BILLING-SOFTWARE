using System;
using System.Collections.Generic;

namespace BACKEND.Entities;

public partial class InvoiceItem
{
    public int Id { get; set; }

    public int InvoiceId { get; set; }

    public int ProductId { get; set; }

    public int Qty { get; set; }

    public decimal Rate { get; set; }

    public decimal Amount { get; set; }

    public decimal GstRate { get; set; }

    public decimal GstAmount { get; set; }

    public decimal TotalAmount { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public virtual Invoice Invoice { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}