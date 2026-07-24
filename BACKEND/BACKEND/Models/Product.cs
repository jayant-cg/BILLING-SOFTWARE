using System;
using System.Collections.Generic;

namespace BACKEND.Models;

public partial class Product
{
    public int Id { get; set; }

    public int CategoryId { get; set; }

    public string ModelName { get; set; } = null!;

    public decimal DefaultPrice { get; set; }

    public bool IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public virtual ICollection<BuyerProductPrice> BuyerProductPrices { get; set; } = new List<BuyerProductPrice>();

    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<InvoiceItem> InvoiceItems { get; set; } = new List<InvoiceItem>();
}
