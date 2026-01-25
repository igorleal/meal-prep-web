/**
 * Recipe utilities for formatting backend data
 */

/**
 * Unit mappings from backend ALL CAPS format to user-friendly format
 */
const UNIT_MAP: Record<string, string> = {
  GRAMS: 'g',
  GRAM: 'g',
  KILOGRAMS: 'kg',
  KILOGRAM: 'kg',
  MILLIGRAMS: 'mg',
  MILLIGRAM: 'mg',
  CUPS: 'cups',
  CUP: 'cup',
  TABLESPOONS: 'tbsp',
  TABLESPOON: 'tbsp',
  TEASPOONS: 'tsp',
  TEASPOON: 'tsp',
  OUNCES: 'oz',
  OUNCE: 'oz',
  POUNDS: 'lb',
  POUND: 'lb',
  LITERS: 'L',
  LITER: 'L',
  MILLILITERS: 'ml',
  MILLILITER: 'ml',
  PIECES: 'pcs',
  PIECE: 'pc',
  SLICES: 'slices',
  SLICE: 'slice',
  CLOVES: 'cloves',
  CLOVE: 'clove',
  PINCH: 'pinch',
  DASH: 'dash',
  TO_TASTE: 'to taste',
  UNIT: '',
  UNITS: '',
  WHOLE: '',
}

/**
 * Formats a unit from backend ALL CAPS format to user-friendly format
 * @param unit - The unit string from the backend (e.g., "GRAMS", "TABLESPOONS")
 * @returns The formatted unit string (e.g., "g", "tbsp")
 */
export function formatUnit(unit: string | undefined | null): string {
  if (!unit) return ''

  const upperUnit = unit.toUpperCase().trim()

  // Check for exact match
  if (upperUnit in UNIT_MAP) {
    return UNIT_MAP[upperUnit]
  }

  // Return lowercase version if no mapping found
  return unit.toLowerCase()
}

/**
 * Formats an ingredient with quantity and unit
 * @param quantity - The quantity (e.g., 2, 0.5)
 * @param unit - The unit from backend (e.g., "CUPS")
 * @param name - The ingredient name (e.g., "flour")
 * @returns Formatted string (e.g., "2 cups flour")
 */
export function formatIngredient(
  quantity: number | string | undefined,
  unit: string | undefined | null,
  name: string
): string {
  const formattedUnit = formatUnit(unit)
  const parts: string[] = []

  if (quantity !== undefined && quantity !== null && quantity !== '') {
    parts.push(String(quantity))
  }

  if (formattedUnit) {
    parts.push(formattedUnit)
  }

  parts.push(name)

  return parts.join(' ')
}

/**
 * Regex pattern to match instruction prefixes like:
 * - "1. "
 * - "1) "
 * - "Step 1: "
 * - "Step 1. "
 * - "1 - "
 */
const INSTRUCTION_PREFIX_PATTERN = /^(?:step\s*)?\d+[\.\)\:\-]\s*/i

/**
 * Strips leading numbers/prefixes from recipe instructions
 * @param instruction - The instruction text from the backend
 * @returns The instruction without the leading number prefix
 */
export function stripInstructionPrefix(instruction: string): string {
  if (!instruction) return ''
  return instruction.replace(INSTRUCTION_PREFIX_PATTERN, '').trim()
}

/**
 * Strips leading numbers/prefixes from an array of instructions
 * @param instructions - Array of instruction strings
 * @returns Array of instructions without leading prefixes
 */
export function stripInstructionPrefixes(instructions: string[]): string[] {
  return instructions.map(stripInstructionPrefix)
}
