import { Account, Ed25519PrivateKey, Network } from "@aptos-labs/ts-sdk";
import { ShelbyNodeClient } from "@shelby-protocol/sdk/node";

// Shelby configuration
const SHELBY_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_SHELBY_API_KEY || '',
  privateKey: process.env.SHELBY_ACCOUNT_PRIVATE_KEY || '',
  network: Network.SHELBYNET,
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
    
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const blobData = new Uint8Array(arrayBuffer);
    
    // Upload to Shelby (1 hour expiration)
    const TIME_TO_LIVE = 60 * 60 * 1_000_000; // 1 hour in microseconds
    
    await client.upload({
      blobData,
      signer: signerAccount,
      blobName,
      expirationMicros: Date.now() * 1000 + TIME_TO_LIVE,
    });
    
    console.log('✅ Uploaded to Shelby:', blobName);
    
    // Return success
    return {
      cid: blobName, // Using blobName as identifier
      url: `https://api.shelbynet.shelby.xyz/shelby/v1/blobs/${signerAccount.accountAddress}/${blobName}`,
      size: file.size,
    };
  } catch (error) {
    console.error('❌ Shelby upload error:', error);
    throw new Error(`Failed to upload to Shelby: ${error}`);
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