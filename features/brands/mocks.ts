import type { BrandsData } from "./types"

export const mockRealistic: BrandsData = {
  items: [
    { id: "1", name: "DealerOn" },
    { id: "2", name: "Dealer Inspire" },
  ],
}

export const mockEmpty: BrandsData = {
  items: [],
}

export const mockError = {
  title: "Failed to load brands",
  message: "We couldn't retrieve your brand data. Please check your connection and try again.",
  code: "ERR_BRANDS_FETCH",
}
