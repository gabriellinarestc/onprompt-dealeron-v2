import type { SettingsData } from "./types"

export const mockRealistic: SettingsData = {
  items: [
    { id: "1", label: "Account" },
    { id: "2", label: "Notifications" },
  ],
}

export const mockEmpty: SettingsData = {
  items: [],
}

export const mockError = {
  title: "Failed to load settings",
  message: "We couldn't retrieve your settings. Please check your connection and try again.",
  code: "ERR_SETTINGS_FETCH",
}
