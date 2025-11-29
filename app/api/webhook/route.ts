import { NextRequest, NextResponse } from 'next/server';

// Farcaster Mini App webhook endpoint
// This receives notifications about app events from Farcaster

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Farcaster webhook received:', body);
    
    // Handle different event types
    const { event, data } = body;
    
    switch (event) {
      case 'frame_added':
        // User added this frame to their profile
        console.log('Frame added by user:', data?.fid);
        break;
        
      case 'frame_removed':
        // User removed this frame from their profile  
        console.log('Frame removed by user:', data?.fid);
        break;
        
      case 'notifications_enabled':
        // User enabled notifications for this app
        console.log('Notifications enabled by user:', data?.fid);
        break;
        
      case 'notifications_disabled':
        // User disabled notifications for this app
        console.log('Notifications disabled by user:', data?.fid);
        break;
        
      default:
        console.log('Unknown event type:', event);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: 'farcaster-webhook' });
}

