"use client"

import { BrandsView } from "./BrandsView"
import { mockRealistic } from "./mocks"

export function BrandsShell() {
  return (
    <BrandsView
      state="ready"
      data={mockRealistic}
      onRetry={() => {}}
    />
  )
}
