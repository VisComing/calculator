import { Base, BitWidth } from '@/types';

export function decimalToBase(decimal: number, base: Base): string {
  if (Number.isNaN(decimal)) return '0';
  if (!Number.isFinite(decimal)) return 'Error';

  const num = Math.floor(Math.abs(decimal));

  switch (base) {
    case 2:
      return '0b' + num.toString(2);
    case 8:
      return '0o' + num.toString(8);
    case 16:
      return '0x' + num.toString(16).toUpperCase();
    case 10:
    default:
      return num.toString(10);
  }
}

export function baseToDecimal(value: string, base: Base): number {
  const cleanValue = value.replace(/^(0b|0o|0x)/i, '');

  switch (base) {
    case 2:
      return parseInt(cleanValue, 2);
    case 8:
      return parseInt(cleanValue, 8);
    case 16:
      return parseInt(cleanValue, 16);
    case 10:
    default:
      return parseFloat(cleanValue);
  }
}

export function applyBitWidth(value: number, bitWidth: BitWidth, signed: boolean = true): number {
  const maxValue = Math.pow(2, bitWidth);
  const mask = maxValue - 1;

  let result = value & mask;

  if (signed && result >= maxValue / 2) {
    result -= maxValue;
  }

  return result;
}

export function bitwiseOperation(
  a: number,
  b: number,
  operation: 'AND' | 'OR' | 'XOR' | 'NAND' | 'NOR' | 'NOT',
  bitWidth: BitWidth
): number {
  const mask = Math.pow(2, bitWidth) - 1;

  switch (operation) {
    case 'AND':
      return (a & b) & mask;
    case 'OR':
      return (a | b) & mask;
    case 'XOR':
      return (a ^ b) & mask;
    case 'NAND':
      return ~(a & b) & mask;
    case 'NOR':
      return ~(a | b) & mask;
    case 'NOT':
      return ~a & mask;
    default:
      return 0;
  }
}

export function shiftOperation(
  value: number,
  shift: number,
  direction: 'left' | 'right' | 'unsigned-right',
  bitWidth: BitWidth
): number {
  const mask = Math.pow(2, bitWidth) - 1;

  switch (direction) {
    case 'left':
      return (value << shift) & mask;
    case 'right':
      return value >> shift;
    case 'unsigned-right':
      return (value >>> shift) & mask;
    default:
      return value;
  }
}

export function isValidForBase(char: string, base: Base): boolean {
  const upperChar = char.toUpperCase();

  switch (base) {
    case 2:
      return /[01]/.test(char);
    case 8:
      return /[0-7]/.test(char);
    case 10:
      return /[0-9]/.test(char);
    case 16:
      return /[0-9A-F]/.test(upperChar);
    default:
      return false;
  }
}
