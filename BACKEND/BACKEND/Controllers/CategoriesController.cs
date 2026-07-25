using BACKEND.Data;
using BACKEND.Data.DTOs.Categories;
using BACKEND.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // GET ALL CATEGORIES
        // GET: api/Categories
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _context.Categories
                .Select(x => new CategoryDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description
                })
                .ToListAsync();

            return Ok(categories);
        }

        // ==========================================
        // GET CATEGORY BY ID
        // GET: api/Categories/1
        // ==========================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var category = await _context.Categories
                .Where(x => x.Id == id)
                .Select(x => new CategoryDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description
                })
                .FirstOrDefaultAsync();

            if (category == null)
            {
                return NotFound("Category not found.");
            }

            return Ok(category);
        }

   }
}