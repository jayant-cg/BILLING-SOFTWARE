using BACKEND.Data;
using BACKEND.Data.DTOs.Invoices;
using BACKEND.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InvoicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ====================================
        // GET ALL INVOICES
        // ====================================
        [HttpGet]
        public async Task<IActionResult> GetInvoices()
        {
            var invoices = await _context.Invoices
                .Include(x => x.Buyer)
                .Select(x => new InvoiceDto
                {
                    Id = x.Id,
                    InvoiceNo = x.InvoiceNo,
                    BuyerId = x.BuyerId,
                    BuyerName = x.Buyer.PartyName,
                    InvoiceDate = x.InvoiceDate,
                    Subtotal = x.Subtotal,
                    GstAmount = x.GstAmount,
                    TotalAmount = x.TotalAmount,
                    Status = x.Status
                })
                .ToListAsync();

            return Ok(invoices);
        }

        // ====================================
        // GET INVOICE BY ID
        // ====================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetInvoice(int id)
        {
            var invoice = await _context.Invoices
                .Include(x => x.Buyer)
                .Where(x => x.Id == id)
                .Select(x => new InvoiceDto
                {
                    Id = x.Id,
                    InvoiceNo = x.InvoiceNo,
                    BuyerId = x.BuyerId,
                    BuyerName = x.Buyer.PartyName,
                    InvoiceDate = x.InvoiceDate,
                    Subtotal = x.Subtotal,
                    GstAmount = x.GstAmount,
                    TotalAmount = x.TotalAmount,
                    Status = x.Status
                })
                .FirstOrDefaultAsync();

            if (invoice == null)
                return NotFound("Invoice not found.");

            return Ok(invoice);
        }

        // ====================================
        // CREATE INVOICE
        // ====================================
        [HttpPost]
        public async Task<IActionResult> CreateInvoice(CreateInvoiceDto dto)
        {
            var invoice = new Invoice
            {
                InvoiceNo = $"INV-{DateTime.Now.Ticks}",
                BuyerId = dto.BuyerId,
                InvoiceDate = DateOnly.FromDateTime(DateTime.Now),
                Subtotal = dto.Subtotal,
                GstAmount = dto.GstAmount,
                TotalAmount = dto.TotalAmount,
                Status = "Draft",
                CreatedAt = DateTime.Now
            };

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            return Ok(invoice);
        }

        // ====================================
        // UPDATE INVOICE
        // ====================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInvoice(int id, UpdateInvoiceDto dto)
        {
            var invoice = await _context.Invoices.FindAsync(id);

            if (invoice == null)
                return NotFound("Invoice not found.");

            invoice.Subtotal = dto.Subtotal;
            invoice.GstAmount = dto.GstAmount;
            invoice.TotalAmount = dto.TotalAmount;
            invoice.Status = dto.Status;
            invoice.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok("Invoice updated successfully.");
        }

        // ====================================
        // DELETE INVOICE
        // ====================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            var invoice = await _context.Invoices.FindAsync(id);

            if (invoice == null)
                return NotFound("Invoice not found.");

            var invoiceItems = await _context.InvoiceItems
                .Where(x => x.InvoiceId == id)
                .ToListAsync();

            _context.InvoiceItems.RemoveRange(invoiceItems);
            _context.Invoices.Remove(invoice);

            await _context.SaveChangesAsync();

            return Ok("Invoice deleted successfully.");
        }

        // ====================================
        // GENERATE INVOICE
        // ====================================
        [HttpPost("generate")]
        public async Task<IActionResult> GenerateInvoice(GenerateInvoiceDto dto)
        {
            decimal subtotal = 0;

            foreach (var item in dto.Items)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    subtotal += product.DefaultPrice * item.Qty;
                }
            }

            decimal gst = subtotal * 0.18m;
            decimal total = subtotal + gst;

            var invoice = new Invoice
            {
                InvoiceNo = $"INV-{DateTime.Now.Ticks}",
                BuyerId = dto.BuyerId,
                InvoiceDate = DateOnly.FromDateTime(DateTime.Now),
                Subtotal = subtotal,
                GstAmount = gst,
                TotalAmount = total,
                Status = "Generated",
                CreatedAt = DateTime.Now
            };

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                invoice.Id,
                invoice.InvoiceNo,
                invoice.Subtotal,
                invoice.GstAmount,
                invoice.TotalAmount
            });
        }

        // ====================================
        // DOWNLOAD PDF
        // ====================================
        [HttpGet("{id}/pdf")]
        public async Task<IActionResult> DownloadPdf(int id)
        {
            var invoice = await _context.Invoices
                .Include(i => i.InvoiceItems)
                .ThenInclude(ii => ii.Product)
                .Include(i => i.Buyer)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (invoice == null)
                return NotFound();

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    // Header with buyer info
                    page.Header().Column(col =>
                    {
                        col.Item().Text($"Invoice #{invoice.InvoiceNo}").FontSize(20).Bold();
                        col.Item().Text($"Buyer: {invoice.Buyer.PartyName}");
                        col.Item().Text($"Date: {invoice.InvoiceDate}");
                    });

                    // Table of items
                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.ConstantColumn(200); // Product
                            columns.ConstantColumn(80);  // Qty
                            columns.ConstantColumn(100); // Price
                        });

                        foreach (var item in invoice.InvoiceItems)
                        {
                            table.Cell().Text(item.Product.ModelName);   // ✅ Product name
                            table.Cell().Text(item.Qty.ToString());      // ✅ Quantity
                            table.Cell().Text($"₹{item.Product.DefaultPrice * item.Qty}"); // ✅ Price
                        }
                    });

                    // Footer with totals
                    page.Footer().Column(col =>
                    {
                        col.Item().Text($"Subtotal: ₹{invoice.Subtotal}");
                        col.Item().Text($"GST (18%): ₹{invoice.GstAmount}");
                        col.Item().Text($"Total: ₹{invoice.TotalAmount}").FontSize(16).Bold();
                    });
                });
            });

            byte[] pdfBytes = document.GeneratePdf();
            return File(pdfBytes, "application/pdf", $"Invoice_{invoice.Id}.pdf");
        }
    }
}
