"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Clock } from "lucide-react"

interface CreatePromptModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (prompt: string) => void
}

export function CreatePromptModal({
  open,
  onOpenChange,
  onSubmit,
}: CreatePromptModalProps) {
  const [promptText, setPromptText] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!promptText.trim()) return

    onSubmit?.(promptText.trim())
    setIsSubmitted(true)
  }

  const handleClose = () => {
    setPromptText("")
    setIsSubmitted(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border sm:max-w-[480px]">
        {!isSubmitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-foreground">Create New Prompt</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Add a new prompt to track how AI models respond to it and mention your brand.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 py-4">
              <Label htmlFor="prompt-text" className="text-sm font-medium text-foreground">
                Prompt Text
              </Label>
              <Textarea
                id="prompt-text"
                placeholder="Enter the prompt you want to track..."
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="min-h-[120px] resize-none bg-input-bg border-input-border text-foreground placeholder:text-input-placeholder focus-visible:ring-ring"
              />
              <p className="text-xs text-muted-foreground">
                This prompt will be monitored across all AI models to track your brand visibility.
              </p>
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-border text-foreground hover:bg-accent"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!promptText.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Create Prompt
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-foreground">Prompt Created</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center gap-4 py-6">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
                <Clock className="size-7 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground mb-2">
                  Analyzing your prompt
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[340px]">
                  We are analyzing how AI models respond to this prompt. This process can take up to 24 hours to complete.
                </p>
              </div>
              <div className="w-full rounded-lg bg-muted px-4 py-3 mt-2">
                <p className="text-xs text-muted-foreground mb-1">Your prompt:</p>
                <p className="text-sm text-foreground font-medium line-clamp-2">
                  {promptText}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                onClick={handleClose}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Got it
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
