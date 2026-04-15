import { NextRequest, NextResponse } from 'next/server';
import { uploadToShelby } from '@/lib/shelby/client';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const file = formData.get('file') as File;
    
    if (!title || !file) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate blob name
    const timestamp = Date.now();
    const blobName = `podcasts/${title.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.mp3`;

    console.log('Server: Starting Shelby upload...', blobName);

    // Upload to Shelby
    const result = await uploadToShelby(file, blobName);

    console.log('Server: Upload successful!', result);

    // Create episode object
    const episode = {
      id: timestamp.toString(),
      title,
      description: description || '',
      price: parseFloat(price) || 0.01,
      audioUrl: result.url,
      uploadDate: new Date().toISOString(),
      listens: 0,
      earnings: 0,
      cid: result.cid,
      size: result.size,
    };

    // Return episode data
    return NextResponse.json({
      success: true,
      episode: episode,
      cid: result.cid,
      url: result.url,
      size: result.size,
    });

  } catch (error: any) {
    console.error('Server: Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}