using BACKEND.Data;
using BACKEND.Data.DTOs.InvoiceItems;
using BACKEND.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceItemsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InvoiceItemsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ======================================
        // GET ALL INVOICE ITEMS
        // GET: api/invoice-items
        // ======================================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _context.InvoiceItems
                .Include(x => x.Product)
                .Select(x => new InvoiceItemDto
                {
                    Id = x.Id,
                    InvoiceId = x.InvoiceId,
                    ProductId = x.ProductId,
                    ProductName = x.Product.ModelName,
                    Qty = x.Qty,
                    Rate = x.Rate,
                    Amount = x.Amount,
                    GstRate = x.GstRate,
                    GstAmount = x.GstAmount,
                    TotalAmount = x.TotalAmount
                })
                .ToListAsync();

            return Ok(items);
        }

        // ======================================
        // GET BY ID
        // GET: api/invoice-items/1
        // ======================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _context.InvoiceItems
                .Include(x => x.Product)
                .Where(x => x.Id == id)
                .Select(x => new InvoiceItemDto
                {
                    Id = x.Id,
                    InvoiceId = x.InvoiceId,
                    ProductId = x.ProductId,
                    ProductName = x.Product.ModelName,
                    Qty = x.Qty,
                    Rate = x.Rate,
                    Amount = x.Amount,
                    GstRate = x.GstRate,
                    GstAmount = x.GstAmount,
                    TotalAmount = x.TotalAmount
                })
                .FirstOrDefaultAsync();

            if (item == null)
            {
                return NotFound("Invoice item not found.");
            }

            return Ok(item);
        }

        // ======================================
        // GET BY INVOICE ID
        // GET: api/invoice-items/invoice/1
        // ======================================
        [HttpGet("invoice/{invoiceId}")]
        public async Task<IActionResult> GetByInvoiceId(int invoiceId)
        {
            var items = await _context.InvoiceItems
                .Include(x => x.Product)
                .Where(x => x.InvoiceId == invoiceId)
                .Select(x => new InvoiceItemDto
                {
                    Id = x.Id,
                    InvoiceId = x.InvoiceId,
                    ProductId = x.ProductId,
                    ProductName = x.Product.ModelName,
                    Qty = x.Qty,
                    Rate = x.Rate,
                    Amount = x.Amount,
                    GstRate = x.GstRate,
                    GstAmount = x.GstAmount,
                    TotalAmount = x.TotalAmount
                })
                .ToListAsync();

            return Ok(items);
        }

        // ======================================
        // CREATE INVOICE ITEM
        // POST: api/invoice-items
        // ======================================
        [HttpPost]
        public async Task<IActionResult> Create(
            CreateInvoiceItemDto dto)
        {
            decimal amount = dto.Qty * dto.Rate;

            decimal gstAmount =
                amount * dto.GstRate / 100;

            decimal totalAmount =
                amount + gstAmount;

            var item = new InvoiceItem
            {
                InvoiceId = dto.InvoiceId,
                ProductId = dto.ProductId,
                Qty = dto.Qty,
                Rate = dto.Rate,
                Amount = amount,
                GstRate = dto.GstRate,
                GstAmount = gstAmount,
                TotalAmount = totalAmount,
                CreatedAt = DateTime.Now
            };

            _context.InvoiceItems.Add(item);

            await _context.SaveChangesAsync();

            return Ok(item);
        }

        // ======================================
        // UPDATE INVOICE ITEM
        // PUT: api/invoice-items/1
        // ======================================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            UpdateInvoiceItemDto dto)
        {
            var item = await _context.InvoiceItems
                .FindAsync(id);

            if (item == null)
            {
                return NotFound("Invoice item not found.");
            }

            decimal amount = dto.Qty * dto.Rate;

            decimal gstAmount =
                amount * dto.GstRate / 100;

            decimal totalAmount =
                amount + gstAmount;

            item.ProductId = dto.ProductId;
            item.Qty = dto.Qty;
            item.Rate = dto.Rate;
            item.Amount = amount;
            item.GstRate = dto.GstRate;
            item.GstAmount = gstAmount;
            item.TotalAmount = totalAmount;
            item.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok("Invoice item updated successfully.");
        }

        // ======================================
        // DELETE INVOICE ITEM
        // DELETE: api/invoice-items/1
        // ======================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.InvoiceItems
                .FindAsync(id);

            if (item == null)
            {
                return NotFound("Invoice item not found.");
            }

            _context.InvoiceItems.Remove(item);

            await _context.SaveChangesAsync();

            return Ok("Invoice item deleted successfully.");
        }
    }
}