using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using BACKEND.Data;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("BillingDB"));
});

// ✅ Swagger services
builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddDbContext<AppDbContext>(options =>
//     options.UseSqlServer(builder.Configuration.GetConnectionString("BillingDB")));

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Billing API",
        Version = "v1"
    });
});

var app = builder.Build();

// ✅ Swagger middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Billing API v1");
    });
}

app.UseAuthorization();
app.MapControllers();
app.Run();
