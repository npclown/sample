import request from "@/lib/api/request";

export function tinymceImageUploadHandler(blobInfo: any, progress: any): any {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", blobInfo.blob(), blobInfo.filename());

    request
      .post("/api/attachments/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (e) => {
          if (e.total === undefined) return;

          progress((e.loaded / e.total) * 100);
        },
      })
      .then((response) => {
        resolve(response.data.data.url);
      })
      .catch((err) => {
        reject("HTTP Error: " + err.message);
      });
  });
}
