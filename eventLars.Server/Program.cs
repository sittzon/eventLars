var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddSwaggerGen();

const string WebsiteClientOrigin = "website_client";
builder.Services.AddCors(options =>
{
    options.AddPolicy(WebsiteClientOrigin, policy =>
    {
        var website = builder.Configuration["Endpoints:Website"];
        if (website != null)
        {
            policy.WithOrigins(website).AllowAnyHeader().AllowAnyMethod();
        }
        policy.AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors(WebsiteClientOrigin);
app.MapControllers();
app.Run();
