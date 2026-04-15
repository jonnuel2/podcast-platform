import { Account, Ed25519PrivateKey, Network } from "@aptos-labs/ts-sdk";
import { ShelbyNodeClient } from "@shelby-protocol/sdk/node";

// Shelby configuration
const SHELBY_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_SHELBY_API_KEY || '',
  privateKey: process.env.SHELBY_ACCOUNT_PRIVATE_KEY || '',
  network: Network.SHELBYNET as Network.SHELBYNET,
};

// Initialize Shelby client
let shelbyClient: ShelbyNodeClient | null = null;
let signer: Account | null = null;

export function getShelbyClient(): ShelbyNodeClient {
  if (!shelbyClient) {
    if (!SHELBY_CONFIG.apiKey) {
      console.warn('⚠️ Shelby API key not configured. Running in DEMO mode with localStorage.');
      throw new Error('Shelby API key required for real uploads');
    }
    
    shelbyClient = new ShelbyNodeClient({
      network: SHELBY_CONFIG.network,
      apiKey: SHELBY_CONFIG.apiKey,
    });
  }
  
  return shelbyClient;
}

export function getSigner(): Account {
  if (!signer) {
    if (!SHELBY_CONFIG.privateKey) {
      throw new Error('Shelby private key required');
    }
    
    signer = Account.fromPrivateKey({
      privateKey: new Ed25519PrivateKey(SHELBY_CONFIG.privateKey),
    });
  }
  
  return signer;
}

// Upload file to Shelby (REAL implementation)
export async function uploadToShelby(
  file: File,
  blobName: string
): Promise<{
  cid: string;
  url: string;
  size: number;
}> {
  try {
    const client = getShelbyClient();
    const signerAccount = getSigner();
    
    console.log('🔹 Starting upload to Shelby...');
    console.log('🔹 Blob name:', blobName);
    console.log('🔹 Signer address:', signerAccount.accountAddress.toString());
    
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const blobData = new Uint8Array(arrayBuffer);
    
    console.log('🔹 File size:', blobData.length, 'bytes');
    
    // Upload to Shelby (1 hour expiration)
    const TIME_TO_LIVE = 60 * 60 * 1_000_000; // 1 hour in microseconds
    
    const uploadResult = await client.upload({
      blobData,
      signer: signerAccount,
      blobName,
      expirationMicros: Date.now() * 1000 + TIME_TO_LIVE,
    });
    
    console.log('✅ Upload result:', uploadResult);
    console.log('✅ Uploaded to Shelby:', blobName);
    
    // Return success
    return {
      cid: blobName, // Using blobName as identifier
      url: `https://api.shelbynet.shelby.xyz/shelby/v1/blobs/${signerAccount.accountAddress}/${blobName}`,
      size: file.size,
    };
  } catch (error: any) {
    console.error('❌ Shelby upload error (full):', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    // Try to parse if it's a JSON error
    if (error.message && error.message.includes('JSON')) {
      console.error('❌ This is a JSON parsing error - the API returned invalid JSON');
    }
    
    throw new Error(`Failed to upload to Shelby: ${error.message || error}`);
  }
}

// Get URL from blob name
export function getShelbyUrl(blobName: string, accountAddress: string): string {
  return `https://api.shelbynet.shelby.xyz/shelby/v1/blobs/${accountAddress}/${blobName}`;
}

// Check if Shelby is configured
export function isShelbyConfigured(): boolean {
  return !!(SHELBY_CONFIG.apiKey && SHELBY_CONFIG.privateKey);
}

// Delete blob from Shelby (stub for now)
export async function deleteFromShelby(blobName: string): Promise<void> {
  console.warn('⚠️ Delete from Shelby not implemented yet');
  // TODO: Implement blob deletion when Shelby SDK supports it
}