/**
 * Funções utilitárias de máscara para inputs do AgendaPro.
 */

/** Remove tudo que não é dígito */
export function unmaskDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Máscara de telefone brasileiro: (XX) XXXXX-XXXX */
export function maskPhone(value: string): string {
  const digits = unmaskDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/** Máscara de CEP brasileiro: XXXXX-XXX */
export function maskCep(value: string): string {
  const digits = unmaskDigits(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

/** Máscara de estado: uppercase, máximo 2 caracteres */
export function maskState(value: string): string {
  return value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2);
}

/**
 * Máscara de moeda brasileira (R$).
 * Entrada: dígitos puros (ex: "3050" → "30,50")
 * Sempre mantém 2 casas decimais.
 */
export function maskCurrency(value: string): string {
  const digits = unmaskDigits(value);
  if (!digits) return '';
  const numericValue = parseInt(digits, 10);
  const formatted = (numericValue / 100).toFixed(2).replace('.', ',');
  return formatted;
}

/** Converte valor formatado de moeda ("30,50") para number (30.5) */
export function unmaskCurrency(value: string): number {
  const clean = value.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(clean) || 0;
}
