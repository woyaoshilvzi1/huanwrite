import { join, relative, resolve } from "node:path";

export type DataFolder =
  | "manuscripts"
  | "candidates"
  | "runs/actions";

export class ProjectPaths {
  constructor(private readonly root: string) {}

  database(): string {
    return join(this.root, ".huanwrite", "huanwrite.sqlite");
  }

  manuscriptBody(id: string): string {
    return this.markdown("manuscripts", id);
  }

  candidateBody(id: string): string {
    return this.markdown("candidates", id);
  }

  actionRunBody(id: string): string {
    return this.markdown("runs/actions", id);
  }

  actionRunTrace(id: string): string {
    return join(this.folder("runs/actions"), `${id}_trace.json`);
  }

  folder(name: DataFolder): string {
    return join(this.root, ".huanwrite", name);
  }

  fromRoot(path: string): string {
    return relative(this.root, path).replaceAll("\\", "/");
  }

  toRooted(relativePath: string): string {
    return resolve(this.root, relativePath);
  }

  private markdown(folder: DataFolder, id: string): string {
    return join(this.folder(folder), `${id}.md`);
  }
}
