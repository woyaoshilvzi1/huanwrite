export interface EnvironmentReader {
  read(name: string): string | undefined;
}

export class ProcessEnvironmentReader implements EnvironmentReader {
  read(name: string): string | undefined {
    return process.env[name];
  }
}
