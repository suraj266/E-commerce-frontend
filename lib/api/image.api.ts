/**
 * Image upload binary helper.
 *
 * Uses raw fetch (not apiClient) because we need progress callback support
 * and we're sending multipart binary — apiClient assumes JSON.
 *
 * Two upload modes based on the provider:
 *   - local: multipart POST to our own /media/upload (auth header required)
 *   - s3:    PUT raw bytes to the presigned URL (no auth header)
 */

export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

export interface UploadParams {
  file: File;
  uploadUrl: string;
  method: "POST" | "PUT";
  fields: Record<string, string>;
  provider: string;
  accessToken?: string;
  onProgress?: (p: UploadProgress) => void;
}

export async function uploadImageBytes(params: UploadParams): Promise<void> {
  const { file, uploadUrl, method, fields, provider, accessToken, onProgress } =
    params;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, uploadUrl, true);

    if (provider === "local" && accessToken) {
      xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
      xhr.withCredentials = true;
    } else if (method === "PUT") {
      // S3 PUT — the presigned URL already encodes the auth and content type
      xhr.setRequestHeader("Content-Type", file.type);
    }

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress({
            loaded: e.loaded,
            total: e.total,
            percent: Math.round((e.loaded / e.total) * 100),
          });
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.onabort = () => reject(new Error("Upload aborted"));

    if (method === "POST") {
      const form = new FormData();
      // Cloudinary-style extra fields (signed upload). Order matters — file last.
      for (const [k, v] of Object.entries(fields)) form.append(k, v);
      form.append("file", file);
      xhr.send(form);
    } else {
      // S3 PUT — just send raw bytes
      xhr.send(file);
    }
  });
}
