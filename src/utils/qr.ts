const TABLE_QR_PATTERN = /^ipot:\/\/table\/([A-Za-z0-9_-]+)$/

export const parseTableQr = (raw: string): string | null => {
  const match = raw.trim().match(TABLE_QR_PATTERN)
  return match ? match[1] : null
}
