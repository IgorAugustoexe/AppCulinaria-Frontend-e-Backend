import {sha256} from '@noble/hashes/sha2.js';
import {bytesToHex, utf8ToBytes} from '@noble/hashes/utils.js';

// Gera um hash SHA-256 da senha combinada com um salt local.
export function hashPassword(password: string, salt: string) {
  return bytesToHex(sha256(utf8ToBytes(`${salt}:${password}`)));
}
