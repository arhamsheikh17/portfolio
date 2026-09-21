import { env } from "cloudflare:workers";

export interface MediaStore {
  put(key: string, bytes: ArrayBuffer, metadata: Record<string, string>): Promise<void>;
  get(key: string): Promise<ArrayBuffer | null>;
  delete(key: string): Promise<void>;
}

export class R2MediaStore implements MediaStore {
  private get binding(): R2Bucket {
    const bucket = (env as Cloudflare.Env).BUCKET;
    if (!bucket) throw new Error("R2 binding BUCKET is not configured.");
    return bucket;
  }
  async put(key: string, bytes: ArrayBuffer, metadata: Record<string, string>) {
    await this.binding.put(key, bytes, {
      httpMetadata: { contentType: metadata.contentType },
      customMetadata: metadata,
    });
  }
  async get(key: string) {
    const object = await this.binding.get(key);
    return object ? object.arrayBuffer() : null;
  }
  async delete(key: string) { await this.binding.delete(key); }
}

export const mediaStore: MediaStore = new R2MediaStore();
