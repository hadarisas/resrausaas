/**
 * Shared wrapper for /platform/* — auth lives in (admin)/layout.tsx only.
 * /platform/login stays outside the (admin) segment so it never skips authentication by mistake.
 */
export default function PlatformRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
