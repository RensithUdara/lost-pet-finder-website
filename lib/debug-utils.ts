/**
 * Debug utilities for the application
 */

export function logDataLoading(component: string, data: any) {
  console.log(`[${component}] Data loaded:`, data ? `${data.length} items` : "No data")
}

export function logError(component: string, error: any) {
  console.error(`[${component}] Error:`, error)
}

export function validateData(component: string, data: any, expectedLength: number) {
  if (!data || data.length === 0) {
    console.error(`[${component}] Data validation failed: No data`)
    return false
  }

  if (data.length < expectedLength) {
    console.warn(
      `[${component}] Data validation warning: Expected at least ${expectedLength} items, got ${data.length}`,
    )
    return false
  }

  console.log(`[${component}] Data validation passed: ${data.length} items`)
  return true
}
