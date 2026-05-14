export type ProvinceCode =
  | 'AB' | 'BC' | 'MB' | 'NB' | 'NL'
  | 'NS' | 'NT' | 'NU' | 'ON' | 'PE'
  | 'QC' | 'SK' | 'YT'

export const PROVINCE_TAX_RATES: Record<ProvinceCode, {
  rate: number
  label: string
  type: 'GST' | 'HST' | 'GST+PST' | 'GST+QST'
}> = {
  AB: { rate: 0.05,     label: 'GST (5%)',            type: 'GST'     },
  BC: { rate: 0.12,     label: 'GST + PST (12%)',      type: 'GST+PST' },
  MB: { rate: 0.12,     label: 'GST + PST (12%)',      type: 'GST+PST' },
  NB: { rate: 0.15,     label: 'HST (15%)',            type: 'HST'     },
  NL: { rate: 0.15,     label: 'HST (15%)',            type: 'HST'     },
  NS: { rate: 0.15,     label: 'HST (15%)',            type: 'HST'     },
  NT: { rate: 0.05,     label: 'GST (5%)',             type: 'GST'     },
  NU: { rate: 0.05,     label: 'GST (5%)',             type: 'GST'     },
  ON: { rate: 0.13,     label: 'HST (13%)',            type: 'HST'     },
  PE: { rate: 0.15,     label: 'HST (15%)',            type: 'HST'     },
  QC: { rate: 0.14975,  label: 'GST + QST (14.975%)', type: 'GST+QST' },
  SK: { rate: 0.11,     label: 'GST + PST (11%)',      type: 'GST+PST' },
  YT: { rate: 0.05,     label: 'GST (5%)',             type: 'GST'     },
}

export const PROVINCE_NAMES: Record<ProvinceCode, string> = {
  AB: 'Alberta',
  BC: 'British Columbia',
  MB: 'Manitoba',
  NB: 'New Brunswick',
  NL: 'Newfoundland and Labrador',
  NS: 'Nova Scotia',
  NT: 'Northwest Territories',
  NU: 'Nunavut',
  ON: 'Ontario',
  PE: 'Prince Edward Island',
  QC: 'Quebec',
  SK: 'Saskatchewan',
  YT: 'Yukon',
}

// Tax-inclusive: extract tax from price
// Formula: tax = price × rate ÷ (1 + rate)
export function extractTax(priceCAD: number, province: ProvinceCode): {
  taxAmount: number
  taxRate: number
  taxLabel: string
  netAmount: number
} {
  const { rate, label } = PROVINCE_TAX_RATES[province]
  const taxAmount = Math.round((priceCAD * rate / (1 + rate)) * 100) / 100
  const netAmount = priceCAD - taxAmount
  return {
    taxAmount,
    taxRate: rate,
    taxLabel: label,
    netAmount,
  }
}
