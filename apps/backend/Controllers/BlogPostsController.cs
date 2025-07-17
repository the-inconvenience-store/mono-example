using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;
using System.ComponentModel.DataAnnotations;

namespace backend.Controllers;

/// <summary>
/// Controller for managing blog posts and related operations
/// </summary>
/// <remarks>
/// This controller provides endpoints for retrieving blog posts that are parsed from MDX files.
/// All blog posts include metadata (title, publication date, summary) and full content.
/// </remarks>
[ApiController]
[Route("[controller]")]
[Produces("application/json")]
[Tags("Blog Posts")]
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
    /// <remarks>
    /// Retrieves a complete list of all available blog posts including their metadata and full content.
    /// Posts are returned with their original publication order and include:
    /// - Metadata (title, publication date, summary, optional image)
    /// - URL-friendly slug
    /// - Full MDX content
    /// 
    /// Sample response:
    /// ```json
    /// [
    ///   {
    ///     "metadata": {
    ///       "title": "Getting Started with React",
    ///       "publishedAt": "2024-01-15",
    ///       "summary": "Learn the basics of React development",
    ///       "image": "react-intro.jpg"
    ///     },
    ///     "slug": "getting-started-with-react",
    ///     "content": "# Getting Started with React\n\nReact is a..."
    ///   }
    /// ]
    /// ```
    /// </remarks>
    /// <returns>A collection of all blog posts with metadata and content</returns>
    /// <response code="200">Returns the list of blog posts successfully</response>
    /// <response code="500">If there was an internal server error retrieving posts</response>
    [HttpGet(Name = "GetAllBlogPosts")]
    [ProducesResponseType(typeof(IEnumerable<BlogPost>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
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
    /// Gets a specific blog post by its URL slug
    /// </summary>
    /// <remarks>
    /// Retrieves a single blog post using its URL-friendly slug identifier.
    /// The slug is derived from the original filename and is used for SEO-friendly URLs.
    /// 
    /// Example slugs:
    /// - "getting-started-with-react"
    /// - "advanced-typescript-patterns"
    /// - "nextjs-best-practices"
    /// 
    /// Sample response:
    /// ```json
    /// {
    ///   "metadata": {
    ///     "title": "Getting Started with React",
    ///     "publishedAt": "2024-01-15",
    ///     "summary": "Learn the basics of React development",
    ///     "image": "react-intro.jpg"
    ///   },
    ///   "slug": "getting-started-with-react",
    ///   "content": "# Getting Started with React\n\nReact is a..."
    /// }
    /// ```
    /// </remarks>
    /// <param name="slug">The URL-friendly slug identifier for the blog post (e.g., "getting-started-with-react")</param>
    /// <returns>The blog post with the specified slug</returns>
    /// <response code="200">Returns the blog post successfully</response>
    /// <response code="404">If no blog post exists with the specified slug</response>
    /// <response code="500">If there was an internal server error retrieving the post</response>
    [HttpGet("{slug}", Name = "GetBlogPostBySlug")]
    [ProducesResponseType(typeof(BlogPost), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<BlogPost>> GetBlogPost(
        [FromRoute]
        [Required]
        [StringLength(100, MinimumLength = 1)]
        [RegularExpression(@"^[a-z0-9]+(?:-[a-z0-9]+)*$",
            ErrorMessage = "Slug must contain only lowercase letters, numbers, and hyphens")]
        string slug)
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
