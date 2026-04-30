// lib/generate-slug.ts
// Utility to generate unique slugs

export async function generateUniqueSlug(
  name: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  let currentSlug = baseSlug;
  let exists = await checkExists(currentSlug);
  let counter = 1;

  while (exists) {
    // Generate a short random string or use a counter
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    currentSlug = `${baseSlug}-${randomSuffix}`;
    exists = await checkExists(currentSlug);
    counter++;

    // Prevent infinite loop in worst case
    if (counter > 10) {
      currentSlug = `${baseSlug}-${Date.now()}`;
      break;
    }
  }

  return currentSlug;
}
