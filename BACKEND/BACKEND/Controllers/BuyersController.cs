using BACKEND.Data;
using BACKEND.Data.DTOs.Buyers;
using BACKEND.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BuyersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BuyersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // GET ALL BUYERS
        // GET: api/Buyers
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> GetAllBuyers()
        {
            var buyers = await _context.Buyers
                .Select(x => new BuyerDto
                {
                    Id = x.Id,
                    PartyName = x.PartyName,
                    Gstin = x.Gstin,
                    Mobile = x.Mobile,
                    Email = x.Email,
                    BillingAddress = x.BillingAddress,
                    State = x.State,
                    City = x.City,
                    IsActive = x.IsActive
                })
                .ToListAsync();

            return Ok(buyers);
        }

        // ==========================================
        // GET BUYER BY ID
        // GET: api/Buyers/1
        // ==========================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBuyerById(int id)
        {
            var buyer = await _context.Buyers
                .Where(x => x.Id == id)
                .Select(x => new BuyerDto
                {
                    Id = x.Id,
                    PartyName = x.PartyName,
                    Gstin = x.Gstin,
                    Mobile = x.Mobile,
                    Email = x.Email,
                    BillingAddress = x.BillingAddress,
                    State = x.State,
                    City = x.City,
                    IsActive = x.IsActive
                })
                .FirstOrDefaultAsync();

            if (buyer == null)
            {
                return NotFound("Buyer not found.");
            }

            return Ok(buyer);
        }

        // ==========================================
        // CREATE BUYER
        // POST: api/Buyers
        // ==========================================
        [HttpPost]
        public async Task<IActionResult> CreateBuyer(CreateBuyerDto dto)
        {
            var buyer = new Buyer
            {
                PartyName = dto.PartyName,
                Gstin = dto.Gstin,
                Mobile = dto.Mobile,
                Email = dto.Email,
                BillingAddress = dto.BillingAddress,
                State = dto.State,
                City = dto.City,
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            _context.Buyers.Add(buyer);

            await _context.SaveChangesAsync();

            return Ok(buyer);
        }

        // ==========================================
        // UPDATE BUYER
        // PUT: api/Buyers/1
        // ==========================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBuyer(
            int id,
            UpdateBuyerDto dto)
        {
            var existingBuyer = await _context.Buyers.FindAsync(id);

            if (existingBuyer == null)
            {
                return NotFound("Buyer not found.");
            }

            existingBuyer.PartyName = dto.PartyName;
            existingBuyer.Gstin = dto.Gstin;
            existingBuyer.Mobile = dto.Mobile;
            existingBuyer.Email = dto.Email;
            existingBuyer.BillingAddress = dto.BillingAddress;
            existingBuyer.State = dto.State;
            existingBuyer.City = dto.City;
            existingBuyer.IsActive = dto.IsActive;
            existingBuyer.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok("Buyer updated successfully.");
        }

        // ==========================================
        // DELETE BUYER (SOFT DELETE)
        // DELETE: api/Buyers/1
        // ==========================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBuyer(int id)
        {
            var buyer = await _context.Buyers.FindAsync(id);

            if (buyer == null)
            {
                return NotFound("Buyer not found.");
            }

            buyer.IsActive = false;
            buyer.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok("Buyer deactivated successfully.");
        }
    }
}