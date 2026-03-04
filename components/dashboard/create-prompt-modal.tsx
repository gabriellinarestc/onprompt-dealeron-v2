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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!promptText.trim()) return

    setIsSubmitting(true)
    try {
      onSubmit?.(promptText.trim())
      setPromptText("")
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setPromptText("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[480px]">
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
            onClick={handleCancel}
            disabled={isSubmitting}
            className="border-border text-foreground hover:bg-accent"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!promptText.trim() || isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? "Creating..." : "Create Prompt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
