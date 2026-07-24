using System;
using System.Collections.Generic;

namespace BACKEND.Models;

public partial class Buyer
{
    public int Id { get; set; }

    public string PartyName { get; set; } = null!;

    public string? Gstin { get; set; }

    public string? Mobile { get; set; }

    public string? Email { get; set; }

    public string? BillingAddress { get; set; }

    public string? State { get; set; }

    public string? City { get; set; }

    public bool IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public virtual ICollection<BuyerProductPrice> BuyerProductPrices { get; set; } = new List<BuyerProductPrice>();

    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
}
