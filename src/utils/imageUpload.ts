export async function uploadToPinata(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload image to Pinata');
    }

    const result = await response.json();
    // Creiamo l'URL completo dell'immagine usando l'hash
    const imageUrl = `https://harlequin-informal-hawk-522.mypinata.cloud/ipfs/${result.IpfsHash}`;
    console.log('Image uploaded:', {
      hash: result.IpfsHash,
      url: imageUrl
    });
    return imageUrl;
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    throw error;
  }
}

export async function uploadMetadataJson(
  name: string,
  symbol: string,
  imageUrl: string // URL completo dell'immagine da Pinata
): Promise<string> {
  try {
    // Creiamo il metadata.json secondo lo standard ufficiale di Metaplex
    const metadata = {
      name: name,
      symbol: symbol,
      description: `${name} Token`,
      seller_fee_basis_points: 0,
      image: imageUrl,
      attributes: [
        {
          trait_type: "Type",
          value: "Custom Token"
        }
      ],
      properties: {
        files: [
          {
            uri: imageUrl,
            type: "image/png"
          }
        ],
        category: "image"
      }
    };

    console.log('Creating metadata.json:', metadata);

    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: `${name.toLowerCase()}-metadata.json`
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to upload metadata to Pinata');
    }

    const result = await response.json();
    // Otteniamo l'URL del metadata.json che useremo per creare il token
    const metadataUrl = `https://harlequin-informal-hawk-522.mypinata.cloud/ipfs/${result.IpfsHash}`;
    console.log('Metadata uploaded:', {
      hash: result.IpfsHash,
      url: metadataUrl,
      content: metadata
    });
    return metadataUrl;
  } catch (error) {
    console.error('Error uploading metadata to Pinata:', error);
    throw error;
  }
}
