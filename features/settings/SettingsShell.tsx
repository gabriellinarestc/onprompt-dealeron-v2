"use client"

import { SettingsView } from "./SettingsView"
import { mockRealistic } from "./mocks"

export function SettingsShell() {
  return (
    <SettingsView
      state="ready"
      data={mockRealistic}
      onRetry={() => {}}
    />
  )
}
