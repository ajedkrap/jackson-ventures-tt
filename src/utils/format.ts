export const formatPrice = (n: number): string => `$${n.toFixed(2)}`

export const formatPriceModifier = (n: number): string => {
  if (n === 0) return ''
  const sign = n > 0 ? '+' : '−'
  return `${sign}$${Math.abs(n).toFixed(2)}`
}
