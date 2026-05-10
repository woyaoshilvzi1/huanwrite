import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export class TextStorage {
  read(path: string): string {
    if (!existsSync(path)) return "";
    return readFileSync(path, "utf8");
  }

  write(path: string, text: string): void {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text, "utf8");
  }

  writeWithoutEmptyOverwrite(path: string, text: string): void {
    const current = this.read(path);
    if (current.trim() && !text.trim()) {
      throw new Error("empty content cannot overwrite existing text");
    }
    this.write(path, text);
  }
}
