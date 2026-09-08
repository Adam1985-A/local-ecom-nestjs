export function slugify(text: string): string {
  return text.toString().normalize('NFKD').toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}