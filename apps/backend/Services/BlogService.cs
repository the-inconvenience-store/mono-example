using System.Text.RegularExpressions;
using backend.Models;

namespace backend.Services;

/// <summary>
/// Service for handling MDX blog post operations
/// </summary>
public interface IBlogService
{
    /// <summary>
    /// Gets all blog posts from the posts directory
    /// </summary>
    /// <returns>A collection of blog posts with metadata and content</returns>
    Task<IEnumerable<BlogPost>> GetBlogPostsAsync();
}

/// <summary>
/// Implementation of blog service for MDX file operations
/// </summary>
public class BlogService : IBlogService
{
    private readonly string _postsDirectory;
    private readonly ILogger<BlogService> _logger;

    public BlogService(ILogger<BlogService> logger, IWebHostEnvironment environment)
    {
        _logger = logger;
        _postsDirectory = Path.Combine(environment.ContentRootPath, "posts");
    }

    /// <summary>
    /// Gets all blog posts from the posts directory
    /// </summary>
    /// <returns>A collection of blog posts with metadata and content</returns>
    public async Task<IEnumerable<BlogPost>> GetBlogPostsAsync()
    {
        try
        {
            var mdxFiles = GetMDXFiles(_postsDirectory);
            var blogPosts = new List<BlogPost>();

            foreach (var file in mdxFiles)
            {
                var filePath = Path.Combine(_postsDirectory, file);
                var blogPost = await ReadMDXFileAsync(filePath);
                if (blogPost != null)
                {
                    blogPosts.Add(blogPost);
                }
            }

            return blogPosts;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving blog posts from directory: {Directory}", _postsDirectory);
            throw;
        }
    }

    private IEnumerable<string> GetMDXFiles(string directory)
    {
        if (!Directory.Exists(directory))
        {
            _logger.LogWarning("Posts directory does not exist: {Directory}", directory);
            return Enumerable.Empty<string>();
        }

        return Directory.GetFiles(directory, "*.mdx")
                        .Select(Path.GetFileName)
                        .Where(name => !string.IsNullOrEmpty(name))
                        .Cast<string>();
    }

    private async Task<BlogPost?> ReadMDXFileAsync(string filePath)
    {
        try
        {
            var rawContent = await File.ReadAllTextAsync(filePath);
            var (metadata, content) = ParseFrontmatter(rawContent);

            if (metadata == null)
            {
                _logger.LogWarning("Could not parse frontmatter for file: {FilePath}", filePath);
                return null;
            }

            var slug = Path.GetFileNameWithoutExtension(filePath);

            return new BlogPost
            {
                Metadata = metadata,
                Slug = slug,
                Content = content
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reading MDX file: {FilePath}", filePath);
            return null;
        }
    }

    private (PostMetadata?, string) ParseFrontmatter(string fileContent)
    {
        var frontmatterRegex = new Regex(@"---\s*([\s\S]*?)\s*---", RegexOptions.Multiline);
        var match = frontmatterRegex.Match(fileContent);

        if (!match.Success)
        {
            _logger.LogWarning("No frontmatter found in content");
            return (null, fileContent);
        }

        var frontMatterBlock = match.Groups[1].Value;
        var content = frontmatterRegex.Replace(fileContent, "").Trim();
        var frontMatterLines = frontMatterBlock.Trim().Split('\n', StringSplitOptions.RemoveEmptyEntries);

        var metadataDict = new Dictionary<string, string>();

        foreach (var line in frontMatterLines)
        {
            var colonIndex = line.IndexOf(": ");
            if (colonIndex == -1) continue;

            var key = line.Substring(0, colonIndex).Trim();
            var value = line.Substring(colonIndex + 2).Trim();

            // Remove quotes if present
            if ((value.StartsWith("'") && value.EndsWith("'")) ||
                (value.StartsWith("\"") && value.EndsWith("\"")))
            {
                value = value.Substring(1, value.Length - 2);
            }

            metadataDict[key] = value;
        }

        // Map to PostMetadata object
        if (!metadataDict.TryGetValue("title", out var title) ||
            !metadataDict.TryGetValue("publishedAt", out var publishedAt) ||
            !metadataDict.TryGetValue("summary", out var summary))
        {
            _logger.LogWarning("Missing required frontmatter fields (title, publishedAt, summary)");
            return (null, content);
        }

        var metadata = new PostMetadata
        {
            Title = title,
            PublishedAt = publishedAt,
            Summary = summary,
            Image = metadataDict.TryGetValue("image", out var image) ? image : null
        };

        return (metadata, content);
    }
}
