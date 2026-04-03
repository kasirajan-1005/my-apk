const IMAGE_MIME_BY_EXTENSION = {
  avif: 'image/avif',
  bmp: 'image/bmp',
  gif: 'image/gif',
  heic: 'image/heic',
  heif: 'image/heif',
  ico: 'image/x-icon',
  jfif: 'image/jpeg',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  tif: 'image/tiff',
  tiff: 'image/tiff',
  webp: 'image/webp'
};

export const IMAGE_FILE_ACCEPT = [
  'image/*',
  '.avif',
  '.bmp',
  '.gif',
  '.heic',
  '.heif',
  '.ico',
  '.jfif',
  '.jpeg',
  '.jpg',
  '.png',
  '.svg',
  '.tif',
  '.tiff',
  '.webp'
].join(',');

function getImageExtension(fileName) {
  const normalizedName = String(fileName || '').trim().toLowerCase();
  const extension = normalizedName.split('.').pop();

  if (!normalizedName.includes('.') || !extension) {
    return '';
  }

  return extension;
}

function normalizeImageFile(file) {
  const fileType = String(file?.type || '').trim().toLowerCase();

  if (fileType.startsWith('image/')) {
    return file;
  }

  const extension = getImageExtension(file?.name);
  const inferredType = IMAGE_MIME_BY_EXTENSION[extension];

  if (!inferredType) {
    throw new Error(
      'Please choose an image file. Supported formats include JPG, PNG, WEBP, GIF, SVG, BMP, TIFF, ICO, AVIF, HEIC, and HEIF.'
    );
  }

  return new File([file], file.name || `upload.${extension}`, {
    type: inferredType,
    lastModified: file.lastModified || Date.now()
  });
}

export function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Please choose an image file.'));
      return;
    }

    if (file.size > 4_000_000) {
      reject(new Error('Please choose an image smaller than 4 MB.'));
      return;
    }

    let normalizedFile;

    try {
      normalizedFile = normalizeImageFile(file);
    } catch (error) {
      reject(error);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Unable to read the selected image.'));
    reader.readAsDataURL(normalizedFile);
  });
}
