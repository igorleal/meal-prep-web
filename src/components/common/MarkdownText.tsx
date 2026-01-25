interface MarkdownTextProps {
  children: string
  className?: string
}

function escapeHtml(text: string): string {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (char) => escapeMap[char])
}

function parseMarkdown(text: string): string {
  let result = escapeHtml(text)
  // Bold: **text** -> <strong>text</strong>
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
  // Italic: *text* -> <em>text</em> (but not ** which is bold)
  result = result.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em class="italic">$1</em>')
  return result
}

export function MarkdownText({ children, className }: MarkdownTextProps) {
  const html = parseMarkdown(children)
  return <p className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
