/**
 * Storage Abstraction Placeholder
 * In Phase 1, we will map this to Supabase Storage.
 */

export interface StorageAdapter {
  uploadFile(bucket: string, path: string, file: File): Promise<string>
  deleteFile(bucket: string, path: string): Promise<void>
  getPublicUrl(bucket: string, path: string): string
}

export const storage: StorageAdapter = {
  uploadFile: async () => {
    throw new Error('Not implemented')
  },
  deleteFile: async () => {
    throw new Error('Not implemented')
  },
  getPublicUrl: () => {
    return ''
  },
}
