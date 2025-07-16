using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;

namespace backend.Controllers;

/// <summary>
/// Controller for managing blog posts and related operations
/// </summary>
[ApiController]
[Route("[controller]")]
[Produces("application/json")]
public class BlogPostsController : ControllerBase
{
    private readonly IBlogService _blogService;
    private readonly ILogger<BlogPostsController> _logger;

    public BlogPostsController(IBlogService blogService, ILogger<BlogPostsController> logger)
    {
        _blogService = blogService;
        _logger = logger;
    }

    /// <summary>
    /// Gets all blog posts with their metadata and content
    /// </summary>
    /// <returns>A collection of blog posts</returns>
    /// <response code="200">Returns the list of blog posts</response>
    /// <response code="500">If there was an internal server error</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<BlogPost>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<BlogPost>>> GetBlogPosts()
    {
        try
        {
            _logger.LogInformation("Retrieving all blog posts");
            var blogPosts = await _blogService.GetBlogPostsAsync();

            _logger.LogInformation("Successfully retrieved {Count} blog posts", blogPosts.Count());
            return Ok(blogPosts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving blog posts");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "An error occurred while retrieving blog posts" });
        }
    }

    /// <summary>
    /// Gets a specific blog post by its slug
    /// </summary>
    /// <param name="slug">The URL-friendly slug of the blog post</param>
    /// <returns>The blog post with the specified slug</returns>
    /// <response code="200">Returns the blog post</response>
    /// <response code="404">If the blog post is not found</response>
    /// <response code="500">If there was an internal server error</response>
    [HttpGet("{slug}")]
    [ProducesResponseType(typeof(BlogPost), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<BlogPost>> GetBlogPost(string slug)
    {
        try
        {
            _logger.LogInformation("Retrieving blog post with slug: {Slug}", slug);
            var blogPosts = await _blogService.GetBlogPostsAsync();
            var blogPost = blogPosts.FirstOrDefault(p => p.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase));

            if (blogPost == null)
            {
                _logger.LogWarning("Blog post not found with slug: {Slug}", slug);
                return NotFound(new { message = $"Blog post with slug '{slug}' not found" });
            }

            _logger.LogInformation("Successfully retrieved blog post: {Title}", blogPost.Metadata.Title);
            return Ok(blogPost);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving blog post with slug: {Slug}", slug);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "An error occurred while retrieving the blog post" });
        }
    }
}
