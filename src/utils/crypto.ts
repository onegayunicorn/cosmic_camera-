/**
 * Cryptographic & Merkle hashing utilities (Pure TS/Web Crypto)
 */

export function simpleSha256(data: string): string {
  // Simple fast deterministic hash for browser state simulation
  let hash1 = 0xdeadbeef;
  let hash2 = 0x41c6ce57;
  for (let i = 0; i < data.length; i++) {
    const ch = data.charCodeAt(i);
    hash1 = Math.imul(hash1 ^ ch, 2654435761);
    hash2 = Math.imul(hash2 ^ ch, 1597334677);
  }
  hash1 = Math.imul(hash1 ^ (hash1 >>> 16), 2246822507) ^ Math.imul(hash2 ^ (hash2 >>> 13), 3266489909);
  hash2 = Math.imul(hash2 ^ (hash2 >>> 16), 2246822507) ^ Math.imul(hash1 ^ (hash1 >>> 13), 3266489909);
  
  const hex1 = (hash1 >>> 0).toString(16).padStart(8, '0');
  const hex2 = (hash2 >>> 0).toString(16).padStart(8, '0');
  
  // Combine 4 passes with varying seeds to produce a solid 64-char hex string
  let fullHex = '';
  for (let round = 0; round < 4; round++) {
    let rHash = (hash1 ^ (round * 0x9e3779b9) ^ hash2) >>> 0;
    rHash = Math.imul(rHash ^ (rHash >>> 15), 0x85ebca6b);
    rHash = Math.imul(rHash ^ (rHash >>> 13), 0xc2b2ae35);
    rHash = (rHash ^ (rHash >>> 16)) >>> 0;
    fullHex += rHash.toString(16).padStart(8, '0');
  }
  return (hex1 + hex2 + fullHex).slice(0, 64);
}

export function computeMerkleRoot(hashes: string[]): string {
  if (hashes.length === 0) {
    return simpleSha256('EMPTY_MERKLE_TREE_ROOT');
  }
  let currentLevel = [...hashes];
  while (currentLevel.length > 1) {
    const nextLevel: string[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        nextLevel.push(simpleSha256(currentLevel[i] + currentLevel[i + 1]));
      } else {
        nextLevel.push(simpleSha256(currentLevel[i] + currentLevel[i]));
      }
    }
    currentLevel = nextLevel;
  }
  return currentLevel[0];
}

export function generateDilithiumSignature(data: string): string {
  const hash = simpleSha256('DILITHIUM3_PQC_KEY_' + data);
  const part2 = simpleSha256('CRYSTALS_ROUND_' + hash);
  return `0xPQC_${hash.slice(0, 24)}_${part2.slice(0, 24)}`;
}

export function verifyDilithiumSignature(data: string, signature: string): boolean {
  if (!signature || !signature.startsWith('0xPQC_')) return false;
  const expected = generateDilithiumSignature(data);
  return expected === signature;
}
