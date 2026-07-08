using Microsoft.EntityFrameworkCore;
using Blueprint.Infrastructure.Data;
using Hangfire;
using Hangfire.InMemory;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

using Blueprint.Core.Interfaces;
using Blueprint.Modules.Repository;
using Blueprint.Api.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// SignalR
builder.Services.AddSignalR();

// DI Registration
// builder.Services.AddDbContext<ApplicationDbContext>(options =>
//     options.UseSqlite("Data Source=blueprint.db"));

builder.Services.AddScoped<INotificationService, Blueprint.Api.Services.NotificationService>();
builder.Services.AddScoped<IRepositoryDbService, Blueprint.Infrastructure.Services.AstraDbService>();
builder.Services.AddScoped<IRepositoryCloneService, RepositoryCloneService>();
builder.Services.AddScoped<IRepositoryAnalysisJob, RepositoryAnalysisJob>();
builder.Services.AddScoped<IParserService, Blueprint.Modules.Parser.ParserService>();
builder.Services.AddScoped<IAiAnalysisService, Blueprint.Modules.Analysis.GeminiAiService>();

// Hangfire (Using InMemory for local dev MVP)
builder.Services.AddHangfire(configuration => configuration
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseInMemoryStorage());
builder.Services.AddHangfireServer();

// Authentication (JWT Placeholder)
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "Blueprint",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "Blueprint",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "super_secret_key_1234567890123456"))
        };
    });
builder.Services.AddAuthorization();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// using (var scope = app.Services.CreateScope())
// {
//     var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
//     db.Database.EnsureCreated();
// }

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.UseHangfireDashboard("/hangfire");

app.MapControllers();
app.MapHub<AnalysisHub>("/hubs/analysis");

app.Run();
