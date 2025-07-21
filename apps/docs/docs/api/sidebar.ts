import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api/mono-api",
    },
    {
      type: "category",
      label: "Blog Posts",
      link: {
        type: "doc",
        id: "api/blog-posts",
      },
      items: [
        {
          type: "doc",
          id: "api/get-all-blog-posts",
          label: "Gets all blog posts with their metadata and content",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/get-blog-post-by-slug",
          label: "Gets a specific blog post by its URL slug",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Weather",
      link: {
        type: "doc",
        id: "api/weather",
      },
      items: [
        {
          type: "doc",
          id: "api/get-weather-forecast",
          label: "Gets a 5-day weather forecast with random temperature data",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Schemas",
      items: [
        {
          type: "doc",
          id: "api/schemas/blogpost",
          label: "BlogPost",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/postmetadata",
          label: "PostMetadata",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/problemdetails",
          label: "ProblemDetails",
          className: "schema",
        },
        {
          type: "doc",
          id: "api/schemas/weatherforecast",
          label: "WeatherForecast",
          className: "schema",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
