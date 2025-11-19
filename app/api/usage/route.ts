import { NextRequest, NextResponse } from 'next/server'
import { getUsageSummary } from '@/lib/usage-tracking'
import { getAuthenticatedUser } from '@/lib/auth-helpers'

/**
 * GET /api/usage - Check current API usage status
 *
 * Returns summary of Anthropic API usage including:
 * - Total cost
 * - Total requests
 * - Remaining budget
 * - Whether limit is exceeded
 *
 * Note: This is sensitive information, so it requires authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    const summary = await getUsageSummary()

    if (!summary) {
      return NextResponse.json(
        { error: 'Failed to fetch usage summary' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ...summary,
      limit: 10.0,
      percentageUsed: ((summary.totalCost / 10.0) * 100).toFixed(2) + '%'
    })
  } catch (error) {
    console.error('Error fetching usage summary:', error)
    return NextResponse.json(
      { error: 'Failed to fetch usage summary' },
      { status: 500 }
    )
  }
}
