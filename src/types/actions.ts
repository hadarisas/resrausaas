export type ActionResult<T = undefined> =
  | { success: true; message?: string; url?: string; data?: T }
  | { success: false; error: string }
