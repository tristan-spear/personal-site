const R2_PUBLIC_URL = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '').replace(/\/$/, '');

export function mediaUrl(value) {
  if (!value || !R2_PUBLIC_URL || !value.startsWith('/assets/')) return value;
  return `${R2_PUBLIC_URL}${value}`;
}
