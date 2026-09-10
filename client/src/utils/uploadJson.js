export const uploadJson = ({ method = "POST", url, headers, body, onProgress }) =>
  new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.open(method, url);
    Object.entries(headers).forEach(([name, value]) => {
      request.setRequestHeader(name, value);
    });

    request.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    request.onload = () => {
      let json = {};
      try {
        json = request.responseText ? JSON.parse(request.responseText) : {};
      } catch (error) {
        reject(new Error("Invalid server response"));
        return;
      }

      resolve({ ok: request.status >= 200 && request.status < 300, json });
    };
    request.onerror = () => reject(new Error("Network request failed"));
    request.onabort = () => reject(new Error("Upload cancelled"));
    request.send(JSON.stringify(body));
  });
