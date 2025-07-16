using System.ComponentModel.DataAnnotations;

namespace backend.Models;

/// <summary>
/// Represents metadata for a blog post extracted from MDX frontmatter
/// </summary>
/// <remarks>
/// Blog post metadata is extracted from the YAML frontmatter section at the top of each MDX file.
/// This metadata provides essential information about the blog post including title, publication date,
/// summary, and optional featured image.
/// </remarks>
/// <example>
/// {
///   "title": "Getting Started with React",
///   "publishedAt": "2024-01-15",
///   "summary": "Learn the fundamentals of React development with this comprehensive guide",
///   "image": "react-fundamentals.jpg"
/// }
/// </example>
public class PostMetadata
{
    /// <summary>
    /// The title of the blog post
    /// </summary>
    /// <remarks>
    /// The main heading that will be displayed as the blog post title.
    /// This should be descriptive and engaging for readers.
    /// </remarks>
    /// <example>Getting Started with React</example>
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public required string Title { get; set; }

    /// <summary>
    /// The publication date of the blog post in ISO format (YYYY-MM-DD)
    /// </summary>
    /// <remarks>
    /// Date when the blog post was originally published.
    /// Used for chronological ordering and display purposes.
    /// </remarks>
    /// <example>2024-01-15</example>
    [Required]
    [RegularExpression(@"^\d{4}-\d{2}-\d{2}$",
        ErrorMessage = "Publication date must be in YYYY-MM-DD format")]
    public required string PublishedAt { get; set; }

    /// <summary>
    /// A brief summary of the blog post content
    /// </summary>
    /// <remarks>
    /// A concise description that gives readers an overview of what the blog post covers.
    /// This is often used in blog post listings and search results.
    /// </remarks>
    /// <example>Learn the fundamentals of React development with this comprehensive guide covering components, props, state, and hooks.</example>
    [Required]
    [StringLength(500, MinimumLength = 10)]
    public required string Summary { get; set; }

    /// <summary>
    /// Optional featured image URL for the blog post
    /// </summary>
    /// <remarks>
    /// URL or path to a featured image that represents the blog post visually.
    /// Can be a relative path to an image in the public folder or an absolute URL.
    /// </remarks>
    /// <example>react-fundamentals.jpg</example>
    [StringLength(500)]
    public string? Image { get; set; }
}

/// <summary>
/// Represents a complete blog post with metadata, content, and slug
/// </summary>
/// <remarks>
/// A blog post combines the extracted metadata from MDX frontmatter with the main content
/// and a URL-friendly slug for web routing. The content includes the full MDX markup
/// which can contain rich formatting, code blocks, and other MDX features.
/// </remarks>
/// <example>
/// {
///   "metadata": {
///     "title": "Getting Started with React",
///     "publishedAt": "2024-01-15",
///     "summary": "Learn the fundamentals of React development",
///     "image": "react-fundamentals.jpg"
///   },
///   "slug": "getting-started-with-react",
///   "content": "# Getting Started with React\n\nReact is a powerful JavaScript library..."
/// }
/// </example>
public class BlogPost
{
    /// <summary>
    /// The metadata extracted from the MDX frontmatter
    /// </summary>
    /// <remarks>
    /// Contains structured information about the blog post including title, publication date,
    /// summary, and optional featured image parsed from the YAML frontmatter.
    /// </remarks>
    [Required]
    public required PostMetadata Metadata { get; set; }

    /// <summary>
    /// The URL-friendly slug derived from the filename
    /// </summary>
    /// <remarks>
    /// A SEO-friendly identifier used in URLs, typically derived from the original filename
    /// with special characters removed and spaces replaced with hyphens.
    /// </remarks>
    /// <example>getting-started-with-react</example>
    [Required]
    [StringLength(100, MinimumLength = 1)]
    [RegularExpression(@"^[a-z0-9]+(?:-[a-z0-9]+)*$",
        ErrorMessage = "Slug must contain only lowercase letters, numbers, and hyphens")]
    public required string Slug { get; set; }

    /// <summary>
    /// The main content of the blog post (MDX content without frontmatter)
    /// </summary>
    /// <remarks>
    /// The full text content of the blog post in MDX format, which includes markdown
    /// with additional features like JSX components. Frontmatter is excluded from this content.
    /// </remarks>
    /// <example># Getting Started with React\n\nReact is a powerful JavaScript library for building user interfaces...</example>
    [Required]
    [MinLength(1)]
    public required string Content { get; set; }
}
