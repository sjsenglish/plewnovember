import { createClient } from '@/lib/supabase/server'

// Claude 3.5 Sonnet pricing (as of January 2025)
// Input: $3 per million tokens
// Output: $15 per million tokens
const PRICING = {
  'claude-3-5-sonnet-20241022': {
    input: 3.0 / 1_000_000,  // $ per token
    output: 15.0 / 1_000_000, // $ per token
  },
  'claude-sonnet-4-20250514': {
    input: 3.0 / 1_000_000,
    output: 15.0 / 1_000_000,
  }
}

const USAGE_LIMIT_USD = 10.0

export interface UsageRecord {
  model: string
  input_tokens: number
  output_tokens: number
  cost_usd: number
  endpoint: string
  session_id?: string
}

/**
 * Calculate cost for a Claude API call based on token usage
 */
export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = PRICING[model as keyof typeof PRICING] || PRICING['claude-3-5-sonnet-20241022']
  const cost = (inputTokens * pricing.input) + (outputTokens * pricing.output)
  return Number(cost.toFixed(6))
}

/**
 * Track an API call in the database
 */
export async function trackUsage(record: UsageRecord): Promise<void> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('api_usage')
      .insert({
        model: record.model,
        input_tokens: record.input_tokens,
        output_tokens: record.output_tokens,
        cost_usd: record.cost_usd,
        endpoint: record.endpoint,
        session_id: record.session_id,
      })

    if (error) {
      console.error('Error tracking usage:', error)
      // Don't throw - we don't want to fail the request if tracking fails
    }
  } catch (error) {
    console.error('Error tracking usage:', error)
  }
}

/**
 * Check if the usage limit has been exceeded
 */
export async function isUsageLimitExceeded(): Promise<boolean> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('api_usage')
      .select('cost_usd')

    if (error) {
      console.error('Error checking usage limit:', error)
      return false // Fail open to not block legitimate usage
    }

    const totalCost = data.reduce((sum, record) => sum + Number(record.cost_usd), 0)
    return totalCost >= USAGE_LIMIT_USD
  } catch (error) {
    console.error('Error checking usage limit:', error)
    return false
  }
}

/**
 * Get total usage summary
 */
export async function getUsageSummary(): Promise<{
  totalCost: number
  totalRequests: number
  remainingBudget: number
  limitExceeded: boolean
} | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('api_usage')
      .select('cost_usd')

    if (error) {
      console.error('Error getting usage summary:', error)
      return null
    }

    const totalCost = data.reduce((sum, record) => sum + Number(record.cost_usd), 0)
    const remainingBudget = Math.max(0, USAGE_LIMIT_USD - totalCost)

    return {
      totalCost: Number(totalCost.toFixed(6)),
      totalRequests: data.length,
      remainingBudget: Number(remainingBudget.toFixed(6)),
      limitExceeded: totalCost >= USAGE_LIMIT_USD
    }
  } catch (error) {
    console.error('Error getting usage summary:', error)
    return null
  }
}
