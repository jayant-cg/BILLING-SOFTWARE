using BACKEND.Data;
using BACKEND.Data.DTOs.Products;
using BACKEND.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // GET ALL PRODUCTS
        // GET: api/Products
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _context.Products
                .Include(x => x.Category)
                .Select(x => new ProductDto
                {
                    Id = x.Id,
                    CategoryId = x.CategoryId,
                    CategoryName = x.Category.Name,
                    ModelName = x.ModelName,
                    DefaultPrice = x.DefaultPrice,
                    IsActive = x.IsActive
                })
                .ToListAsync();

            return Ok(products);
        }

        // ==========================================
        // GET PRODUCT BY ID
        // GET: api/Products/1
        // ==========================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _context.Products
                .Include(x => x.Category)
                .Where(x => x.Id == id)
                .Select(x => new ProductDto
                {
                    Id = x.Id,
                    CategoryId = x.CategoryId,
                    CategoryName = x.Category.Name,
                    ModelName = x.ModelName,
                    DefaultPrice = x.DefaultPrice,
                    IsActive = x.IsActive
                })
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound("Product not found.");
            }

            return Ok(product);
        }

        // ==========================================
        // CREATE PRODUCT
        // POST: api/Products
        // ==========================================
        [HttpPost]
        public async Task<IActionResult> CreateProduct(CreateProductDto dto)
        {
            var category = await _context.Categories.FindAsync(dto.CategoryId);

            if (category == null)
            {
                return BadRequest("Category does not exist.");
            }

            var product = new Product
            {
                CategoryId = dto.CategoryId,
                ModelName = dto.ModelName,
                DefaultPrice = dto.DefaultPrice,
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            _context.Products.Add(product);

            await _context.SaveChangesAsync();

            return Ok(product);
        }

        // ==========================================
        // UPDATE PRODUCT
        // PUT: api/Products/1
        // ==========================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(
            int id,
            UpdateProductDto dto)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound("Product not found.");
            }

            product.CategoryId = dto.CategoryId;
            product.ModelName = dto.ModelName;
            product.DefaultPrice = dto.DefaultPrice;
            product.IsActive = dto.IsActive;
            product.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok("Product updated successfully.");
        }

        // ==========================================
        // DELETE PRODUCT
        // DELETE: api/Products/1
        // ==========================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound("Product not found.");
            }

            _context.Products.Remove(product);

            await _context.SaveChangesAsync();

            return Ok("Product deleted successfully.");
        }

        // ==========================================
        // GET PRODUCTS BY CATEGORY
        // GET: api/Products/category/1
        // ==========================================
        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetProductsByCategory(int categoryId)
        {
            var products = await _context.Products
                .Where(x => x.CategoryId == categoryId)
                .Select(x => new ProductDto
                {
                    Id = x.Id,
                    CategoryId = x.CategoryId,
                    CategoryName = x.Category.Name,
                    ModelName = x.ModelName,
                    DefaultPrice = x.DefaultPrice,
                    IsActive = x.IsActive
                })
                .ToListAsync();

            return Ok(products);
        }
    }
}