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
