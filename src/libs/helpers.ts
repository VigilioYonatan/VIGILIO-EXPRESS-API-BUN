import path from "node:path";

export function pathUploads() {
    return path.resolve(import.meta.dir, "..", "..", "public", "images");
}
