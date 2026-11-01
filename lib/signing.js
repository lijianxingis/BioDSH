/**
 * Ed25519 signing for exported bundles.
 *
 * A signature here proves possession of one private key. It does not prove who owns
 * that key: there is no certificate authority and no verified institutional identity.
 * Every surface that reports a signature must say so, which is why `selfSigned` is
 * carried in the key description rather than left to the caller to remember.
 */
import { createHash, generateKeyPairSync, sign as edSign, verify as edVerify } from 'node:crypto'

export function generateSigningKey() {
  const { publicKey, privateKey } = generateKeyPairSync('ed25519')
  const publicPem = publicKey.export({ type: 'spki', format: 'pem' }).toString()
  const privatePem = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString()
  return Object.freeze({
    publicKey: publicPem,
    privateKey: privatePem,
    keyId: keyIdOf(publicPem),
    algorithm: 'ed25519',
    selfSigned: true,
  })
}

export function keyIdOf(publicKeyPem) {
  return createHash('sha256').update(publicKeyPem).digest('hex')
}

export function shortKeyId(keyId) {
  return typeof keyId === 'string' ? keyId.slice(0, 8) : ''
}

export function parseShortKeyId(input) {
  return typeof input === 'string' && /^[a-f0-9]{8}$/.test(input) ? input : undefined
}

export function describeKey(material) {
  return Object.freeze({
    keyId: material.keyId ?? keyIdOf(material.publicKey),
    algorithm: material.algorithm ?? 'ed25519',
    selfSigned: true,
    note: 'Self-signed: no certificate authority, no verified institutional identity, no trusted timestamp.',
  })
}

export function signDigest(digest, privateKeyPem) {
  if (typeof digest !== 'string' || !/^[a-f0-9]{64}$/.test(digest)) throw new TypeError('digest must be a sha256 hex string')
  const signature = edSign(null, Buffer.from(digest, 'utf8'), privateKeyPem)
  return Object.freeze({ algorithm: 'ed25519', value: signature.toString('base64'), digest })
}

export function verifySignature(signature, publicKeyPem) {
  if (!signature || typeof signature.value !== 'string' || typeof signature.digest !== 'string') return 'absent'
  try {
    const ok = edVerify(null, Buffer.from(signature.digest, 'utf8'), publicKeyPem, Buffer.from(signature.value, 'base64'))
    return ok ? 'valid' : 'invalid'
  } catch { return 'invalid' }
}
