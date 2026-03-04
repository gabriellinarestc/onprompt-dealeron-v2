// AI model brand logos using CSS mask-image for gradient coloring.
// The SVG file acts as a mask shape, and the div background is the brand gradient.

function GradientLogo({
  src,
  alt,
  gradient,
  size = 20,
}: {
  src: string
  alt: string
  gradient: string
  size?: number
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      style={{
        width: size,
        height: size,
        background: gradient,
        maskImage: `url(${src})`,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
      }}
    />
  )
}

export function ChatGPTLogo({ size = 20 }: { size?: number }) {
  return (
    <GradientLogo
      src="/models/gpt.svg"
      alt="ChatGPT"
      gradient="linear-gradient(135deg, #10a37f 0%, #1a7f5a 100%)"
      size={size}
    />
  )
}

export function ClaudeLogo({ size = 20 }: { size?: number }) {
  return (
    <GradientLogo
      src="/models/claude.svg"
      alt="Claude"
      gradient="linear-gradient(135deg, #d97757 0%, #c4613f 100%)"
      size={size}
    />
  )
}

export function GeminiLogo({ size = 20 }: { size?: number }) {
  return (
    <GradientLogo
      src="/models/gemini.svg"
      alt="Gemini"
      gradient="linear-gradient(135deg, #4285f4 0%, #a259ff 40%, #ea4335 70%, #fbbc04 100%)"
      size={size}
    />
  )
}

export function PerplexityLogo({ size = 20 }: { size?: number }) {
  return (
    <GradientLogo
      src="/models/perplexity.svg"
      alt="Perplexity"
      gradient="linear-gradient(135deg, #20b8cd 0%, #1a8fa0 100%)"
      size={size}
    />
  )
}

export function CopilotLogo({ size = 20 }: { size?: number }) {
  return (
    <GradientLogo
      src="/models/copilot.svg"
      alt="Copilot"
      gradient="linear-gradient(135deg, #0078d4 0%, #005a9e 100%)"
      size={size}
    />
  )
}
