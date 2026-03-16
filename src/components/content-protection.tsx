"use client"

import { useEffect } from "react"

/**
 * Content Protection
 * Deters casual copying of intellectual property (images, text).
 * This is a deterrent only — determined users can always bypass client-side protection.
 * For true protection, watermarking and server-side controls are needed.
 */
export function ContentProtection() {
  useEffect(() => {
    // Disable right-click context menu on images
    function handleContextMenu(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (
        target.tagName === "IMG" ||
        target.closest("[data-protected]")
      ) {
        e.preventDefault()
      }
    }

    // Disable drag on images
    function handleDragStart(e: DragEvent) {
      const target = e.target as HTMLElement
      if (target.tagName === "IMG") {
        e.preventDefault()
      }
    }

    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("dragstart", handleDragStart)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("dragstart", handleDragStart)
    }
  }, [])

  return null
}
