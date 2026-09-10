const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read image"));
    reader.readAsDataURL(file);
  });

const loadImage = (dataUrl) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to decode image"));
    image.src = dataUrl;
  });

const dataUrlSize = (dataUrl) =>
  Math.ceil((dataUrl.length - dataUrl.indexOf(",") - 1) * 0.75);

export const compressImage = async (file) => {
  const image = await loadImage(await readFileAsDataUrl(file));
  const maxDimension = 1200;
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  let quality = 0.72;
  let data = canvas.toDataURL("image/jpeg", quality);
  while (dataUrlSize(data) > 100000 && quality > 0.2) {
    quality -= 0.08;
    data = canvas.toDataURL("image/jpeg", quality);
  }

  while (dataUrlSize(data) > 100000 && canvas.width > 320) {
    canvas.width = Math.round(canvas.width * 0.8);
    canvas.height = Math.round(canvas.height * 0.8);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    data = canvas.toDataURL("image/jpeg", 0.55);
  }

  return {
    name: `${file.name.replace(/\.[^/.]+$/, "")}.jpg`,
    type: "image/jpeg",
    size: dataUrlSize(data),
    data,
  };
};
