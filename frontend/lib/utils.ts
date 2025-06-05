import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeArrayField(value: any): string[] {
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(item => item !== '');
  }
  
  if (typeof value === 'string') {
    if (value === '') {
      return [];
    }
    
    if (value.includes(',')) {
      return value.split(',').map(item => item.trim()).filter(item => item !== '');
    }
    
    if (value.includes('|')) {
      return value.split('|').map(item => item.trim()).filter(item => item !== '');
    }
    
    if (value.includes('\n') || value.includes('\\n')) {
      const normalized = value.replace(/\\n/g, '\n');
      return normalized.split('\n').map(item => item.trim()).filter(item => item !== '');
    }
    
    if (value.match(/\d+\.\s/)) {
      const numberedInstructions = value
        .split(/\d+\.\s/)
        .map(s => s.trim())
        .filter(s => s !== '');
      
      return numberedInstructions.filter((_, i) => 
        i > 0 || numberedInstructions[0].length > 0);
    }

    return [value.trim()];
  }
  
  return [];
}

/**
 * Helper function to check if a field has valid data
 * Used to determine if a field should display "No information available"
 */
export function hasValidData(value: any): boolean {
  if (value === undefined || value === null) return false;
  
  if (typeof value === 'string') {
    // Check if it's a "No information" message
    if (value.trim() === '' || value.toLowerCase().includes('no information')) return false;
    return true;
  }
  
  if (Array.isArray(value)) {
    if (value.length === 0) return false;
    // Check if the first item is a "No information" message
    if (value.length === 1 && typeof value[0] === 'string' && 
        value[0].toLowerCase().includes('no information')) return false;
    return true;
  }
  
  return false;
}
