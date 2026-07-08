using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;

namespace Blueprint.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public AuthController(IConfiguration config)
        {
            _config = config;
            _httpClient = new HttpClient();
        }

        [HttpGet("github")]
        public IActionResult GitHubLogin()
        {
            var clientId = _config["GitHub:ClientId"];
            if (string.IsNullOrEmpty(clientId)) return BadRequest("GitHub ClientId is missing.");
            
            var redirectUrl = $"https://github.com/login/oauth/authorize?client_id={clientId}&scope=read:user user:email";
            return Redirect(redirectUrl);
        }

        [HttpGet("callback")]
        public async Task<IActionResult> GitHubCallback([FromQuery] string code)
        {
            var clientId = _config["GitHub:ClientId"];
            var clientSecret = _config["GitHub:ClientSecret"];
            if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret)) return BadRequest("GitHub credentials are missing.");

            // Exchange code for token
            var tokenRequest = new HttpRequestMessage(HttpMethod.Post, $"https://github.com/login/oauth/access_token?client_id={clientId}&client_secret={clientSecret}&code={code}");
            tokenRequest.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            
            var tokenResponse = await _httpClient.SendAsync(tokenRequest);
            if (!tokenResponse.IsSuccessStatusCode) return BadRequest("Failed to exchange code for token.");

            var tokenContent = await tokenResponse.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(tokenContent);
            if (!doc.RootElement.TryGetProperty("access_token", out var accessTokenElement)) return BadRequest("Access token not found in response.");
            
            var githubAccessToken = accessTokenElement.GetString();

            // Get user info
            var userRequest = new HttpRequestMessage(HttpMethod.Get, "https://api.github.com/user");
            userRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", githubAccessToken);
            userRequest.Headers.UserAgent.Add(new ProductInfoHeaderValue("Blueprint", "1.0"));

            var userResponse = await _httpClient.SendAsync(userRequest);
            if (!userResponse.IsSuccessStatusCode) return BadRequest("Failed to get user info.");

            var userContent = await userResponse.Content.ReadAsStringAsync();
            using var userDoc = JsonDocument.Parse(userContent);
            var username = userDoc.RootElement.GetProperty("login").GetString();
            var avatarUrl = userDoc.RootElement.TryGetProperty("avatar_url", out var avatarProp) ? avatarProp.GetString() : "";

            // Generate JWT Token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "super_secret_key_1234567890123456");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, username ?? "unknown"),
                    new Claim(ClaimTypes.Name, username ?? "unknown"),
                    new Claim("avatar_url", avatarUrl ?? "")
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _config["Jwt:Issuer"] ?? "Blueprint",
                Audience = _config["Jwt:Audience"] ?? "Blueprint"
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwt = tokenHandler.WriteToken(token);

            // Redirect back to frontend with token
            var encodedAvatar = Uri.EscapeDataString(avatarUrl ?? "");
            return Redirect($"http://localhost:5173/auth/callback?token={jwt}&user={username}&avatar={encodedAvatar}");
        }
    }
}
