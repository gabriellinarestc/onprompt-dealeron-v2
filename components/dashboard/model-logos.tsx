// AI model brand logos as React components using static SVG files.

export function ChatGPTLogo({ size = 20 }: { size?: number }) {
  return (
    <img
      src="/models/gpt.svg"
      alt="ChatGPT"
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  )
}

export function ClaudeLogo({ size = 20 }: { size?: number }) {
  return (
    <img
      src="/models/claude.svg"
      alt="Claude"
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  )
}

export function GeminiLogo({ size = 20 }: { size?: number }) {
  return (
    <img
      src="/models/gemini.svg"
      alt="Gemini"
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  )
}

export function PerplexityLogo({ size = 20 }: { size?: number }) {
  return (
    <img
      src="/models/perplexity.svg"
      alt="Perplexity"
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  )
}

export function CopilotLogo({ size = 20 }: { size?: number }) {
  return (
    <img
      src="/models/copilot.svg"
      alt="Copilot"
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  )
}
