import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';

// Type for route params
interface RouteParams {
  params: {
    slug: string;
  };
}

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug
 */
export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // Connect to database
    await connectDB();

    // Validate slug parameter
    const { slug } = await params;
    
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { message: 'Invalid slug parameter' },
        { status: 400 }
      );
    }

    // Sanitize slug (only allow alphanumeric and hyphens)
    const sanitizedSlug = slug.trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(sanitizedSlug)) {
      return NextResponse.json(
        { message: 'Slug must contain only letters, numbers, and hyphens' },
        { status: 400 }
      );
    }



    // Query event by slug
    const event = await Event.findOne({ slug: sanitizedSlug }).lean();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }

    // Return event data
    return NextResponse.json(
      {
        message: 'Event retrieved successfully',
        event,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging
    console.error('Error fetching event by slug:', error);

    // Return generic error response
    return NextResponse.json(
      {
        message: 'Failed to fetch event',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
