import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return new Response('Missing URL parameter', { status: 400 });
  }

  try {
    console.log('Proxying audio from:', url);
    
    // Fetch the audio file from Shelby
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Shelby fetch failed:', response.status);
      return new Response('Failed to fetch audio', { status: response.status });
    }

    // Get the audio data
    const audioBuffer = await response.arrayBuffer();
    
    // Return with proper headers
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    console.error('Proxy error:', error);
    return new Response(`Proxy error: ${error.message}`, { status: 500 });
  }
}