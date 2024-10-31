export default function sanitizeImageName(name: string) {
  return name.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_");
}
