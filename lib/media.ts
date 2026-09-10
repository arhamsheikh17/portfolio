import { env } from "cloudflare:workers";

export interface MediaStore {
  put(key: string, bytes: ArrayBuffer, metadata: Record<string, string>): Promise<void>;
  get(key: string): Promise<ArrayBuffer | null>;
  delete(key: string): Promise<void>;
}

export class KVMediaStore implements MediaStore {
  private get binding(): KVNamespace {
    const media = (env as Cloudflare.Env).MEDIA;
    if (!media) throw new Error("Workers KV binding MEDIA is not configured.");
    return media;
  }
  async put(key: string, bytes: ArrayBuffer, metadata: Record<string, string>) { await this.binding.put(key, bytes, { metadata }); }
  async get(key: string) { return this.binding.get(key, "arrayBuffer"); }
  async delete(key: string) { await this.binding.delete(key); }
}

export const mediaStore: MediaStore = new KVMediaStore();
