/* eslint-disable @typescript-eslint/no-non-null-assertion */
interface ResizeOptions {
  width?: number;
  height?: number;
  quality: number;
}

const loadImg = (
  img: HTMLImageElement,
  src: string
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    img.src = src;

    if (img.complete) {
      resolve(img);
    } else {
      img.onload = () => resolve(img);
    }

    img.onerror = reject;
  });
};

export const resizeImg = async (
  imageFile: File,
  options: ResizeOptions
): Promise<Blob> => {
  const src = URL.createObjectURL(imageFile);
  const img = await loadImg(document.createElement('img'), src);

  if (!options.width && !options.height) {
    options.width = img.width;
    options.height = img.height;
  }

  if (options.width && !options.height) {
    options.height = img.height * (options.width / img.width);
  } else if (options.height && !options.width) {
    options.width = img.width * (options.height / img.height);
  }

  if (options.width! >= img.width && options.height! >= img.height) {
    return imageFile;
  }

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');

    canvas.width = options.width as number;
    canvas.height = options.height as number;

    const ctx = canvas.getContext('2d');

    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob: Blob | null) => {
        if (!blob) {
          reject(new Error('Desculpe não foi possível redimensionar a imagem'));
          return;
        }
        resolve(blob);
      },
      imageFile.type,
      options.quality
    );
  });
};
