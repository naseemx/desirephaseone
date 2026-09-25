import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/frames_mob_v3/",
          "/frames_optimized/",
          "/frames_mobv3/",
        ],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "anthropic-ai",
          "ClaudeBot",
          "Claude-Web",
          "Google-Extended",
          "Googlebot-Image",
          "Bytespider",
          "Diffbot",
          "ImagesiftBot",
          "PerplexityBot",
          "Omgilibot",
          "FacebookBot",
          "Scrapy",
        ],
        disallow: [
          "/frames_mob_v3/",
          "/frames_optimized/",
          "/frames_mobv3/",
        ],
      },
    ],
  };
}
