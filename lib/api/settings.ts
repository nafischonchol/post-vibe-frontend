import "server-only";

export async function getPublicSettings() {
  return {
    app_name: "Post-Vibe",
    description: "Automated Video Syndication SaaS",
  };
}
