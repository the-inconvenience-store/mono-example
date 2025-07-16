using System.ComponentModel.DataAnnotations;

namespace backend.Models;

/// <summary>
/// Represents metadata for a blog post extracted from MDX frontmatter
/// </summary>
public class PostMetadata
{
    /// <summary>
    /// The title of the blog post
    /// </summary>
    [Required]
    public required string Title { get; set; }

    /// <summary>
    /// The publication date of the blog post in ISO format
    /// </summary>
    [Required]
    public required string PublishedAt { get; set; }

    /// <summary>
    /// A brief summary of the blog post content
    /// </summary>
    [Required]
    public required string Summary { get; set; }

    /// <summary>
    /// Optional image URL for the blog post
    /// </summary>
    public string? Image { get; set; }
}

/// <summary>
/// Represents a complete blog post with metadata, content, and slug
/// </summary>
public class BlogPost
{
    /// <summary>
    /// The metadata extracted from the MDX frontmatter
    /// </summary>
    [Required]
    public required PostMetadata Metadata { get; set; }

    /// <summary>
    /// The URL-friendly slug derived from the filename
    /// </summary>
    [Required]
    public required string Slug { get; set; }

    /// <summary>
    /// The main content of the blog post (MDX content without frontmatter)
    /// </summary>
    [Required]
    public required string Content { get; set; }
}
