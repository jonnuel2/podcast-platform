import { NextRequest, NextResponse } from 'next/server';
import { uploadToShelby } from '@/lib/shelby/client';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const podcast = formData.get('podcast') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const file = formData.get('file') as File;
    
    if (!title || !podcast || !file) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate blob name
    const timestamp = Date.now();
    const blobName = `podcasts/${title.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.mp3`;

    console.log('Server: Starting Shelby upload...', blobName);
    console.log('Server: File size:', file.size, 'bytes');

    // Upload to Shelby
    const result = await uploadToShelby(file, blobName);

    console.log('Server: Upload successful!', result);

    // Create episode object for Supabase
    const episode = {
      title,
      podcast: podcast || 'Uncategorized',
      creator: 'Anonymous Creator',
      description: description || '',
      price: parseFloat(price) || 0.01,
      audio_url: result.url,
      cid: result.cid,
      size: result.size,
      listens: 0,
      earnings: 0,
    };

    // Save to Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log('💾 Saving to Supabase...');

    const { data, error } = await supabase
      .from('episodes')
      .insert([episode])
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      throw new Error(`Failed to save episode: ${error.message}`);
    }

    console.log('✅ Episode saved to Supabase!', data);

    // Return episode data
    return NextResponse.json({
      success: true,
      episode: data,
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