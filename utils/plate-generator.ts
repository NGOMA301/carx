// Rwandan plate number generator
export const generateRwandanPlateNumber = (): string => {
  // Rwandan plate format: RAB 123A or RCA 456B
  const prefixes = ["RAB", "RCA", "RBA", "RCB", "RAC", "RBC"]
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const numbers = Math.floor(Math.random() * 900) + 100 // 100-999
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)) // A-Z

  return `${prefix} ${numbers}${letter}`
}

// Generate service package number
export const generatePackageNumber = (): string => {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0")
  return `PKG-${year}-${random}`
}

// Generate service record number
export const generateServiceNumber = (): string => {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0")
  return `SRV-${year}-${random}`
}

// Generate payment number
export const generatePaymentNumber = (): string => {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0")
  return `PAY-${year}-${random}`
}
