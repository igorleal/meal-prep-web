/**
 * Recipe utilities for formatting backend data
 */

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
 * Regex pattern to split instructions that may be on the same line.
 * Matches patterns like " 2. ", " 3) ", " Step 4: " etc. in the middle of text.
 * Uses lookbehind to ensure there's content before the number.
 */
const INSTRUCTION_SPLIT_PATTERN = /\s+(?=(?:step\s*)?\d+[\.\)\:\-]\s)/i

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

/**
 * Parses instruction text from the backend into an array of individual steps.
 * Handles both newline-separated instructions and inline numbered instructions.
 * @param instructions - The raw instructions string from the backend
 * @returns Array of instruction steps with prefixes stripped
 */
export function parseInstructions(instructions: string): string[] {
  if (!instructions) return []

  // First split by newlines
  const lines = instructions.split('\n').filter(Boolean)

  // For each line, check if it contains multiple numbered steps inline
  const allSteps: string[] = []
  for (const line of lines) {
    // Split the line by number patterns (e.g., " 2. ", " 3) ")
    const parts = line.split(INSTRUCTION_SPLIT_PATTERN).filter(Boolean)
    allSteps.push(...parts)
  }

  // Strip prefixes and filter empty results
  return allSteps.map(stripInstructionPrefix).filter(Boolean)
}
