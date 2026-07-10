export function plainTextFromDocument(content: string): string {
  if (!content) return '';

  try {
    const parsed = JSON.parse(content) as { content?: Array<{ content?: Array<{ text?: string }> }> };
    const lines = parsed.content?.map((block) => block.content?.map((item) => item.text || '').join('') || '').filter(Boolean);
    return lines?.join('\n\n') || content;
  } catch {
    return content;
  }
}

export function initials(name: string): string {
  return name.split(' ').map((part) => part[0]).join('').toUpperCase().slice(0, 2) || 'CF';
}
