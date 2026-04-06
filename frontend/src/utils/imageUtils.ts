export const getFullImageUrl = (imageUrl: string | null | undefined): string | null => {
  if (!imageUrl || imageUrl === 'null' || imageUrl === '') return null;

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  const backendBaseUrl = 'http://localhost:8080';

  if (imageUrl.startsWith('/')) {
    return `${backendBaseUrl}${imageUrl}`;
  }

  return `${backendBaseUrl}/${imageUrl}`;
};

//이미지 압축 및 WebP 확장자로 최적화
export const compressAndConvertImage = async (
  file: File,
  maxWidth = 1200,
  quality = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        //WebP 변환
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Blob conversion failed'));
              return;
            }

            const fileName = file.name.split('.').slice(0, -1).join('.') + '.webp';
            const optimizedFile = new File([blob], fileName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(optimizedFile);
          },
          'image/webp',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
