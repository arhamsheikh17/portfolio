declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    MEDIA?: KVNamespace;
    BUCKET?: R2Bucket;
  }
}
