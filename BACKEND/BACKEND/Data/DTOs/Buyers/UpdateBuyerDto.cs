namespace BACKEND.Data.DTOs.Buyers
{
    public class UpdateBuyerDto
    {
        public string PartyName { get; set; } = string.Empty;
        public string? Gstin { get; set; }
        public string? Mobile { get; set; }
        public string? Email { get; set; }
        public string? BillingAddress { get; set; }
        public string? State { get; set; }
        public string? City { get; set; }
        public bool IsActive { get; set; }
    }
}