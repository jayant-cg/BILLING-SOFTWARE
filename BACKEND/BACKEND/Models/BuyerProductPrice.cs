using System;
using System.Collections.Generic;

namespace BACKEND.Models;

public partial class BuyerProductPrice
{
    public int Id { get; set; }

    public int BuyerId { get; set; }

    public int ProductId { get; set; }

    public decimal Rate { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int? UpdatedBy { get; set; }

    public virtual Buyer Buyer { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
