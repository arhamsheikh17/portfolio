declare namespace Cloudflare {
  interface Env {
    RESEND_API_KEY?: string;
    CONTACT_FROM_EMAIL?: string;
    ADMIN_ALLOWED_EMAIL?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
