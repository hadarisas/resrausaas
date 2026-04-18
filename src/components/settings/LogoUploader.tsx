'use client'
import { useState, useTransition } from 'react'
import { uploadLogoAction } from '@/lib/actions/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface LogoUploaderProps {
  currentLogoUrl: string | null
  restaurantId: string
}

export default function LogoUploader({ currentLogoUrl, restaurantId }: LogoUploaderProps) {
  const [logoUrl, setLogoUrl] = useState(currentLogoUrl)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setError('')
    startTransition(async () => {
      const result = await uploadLogoAction(restaurantId, formData)
      if (!result.success) {
        setError(result.error)
      } else if (result.url) {
        setLogoUrl(result.url)
      }
    })
  }

  return (
    <div className="space-y-3">
      <Label>Restaurant logo</Label>
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border bg-gray-50">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Logo" className="h-16 w-16 object-cover" />
          ) : (
            <span className="text-2xl text-gray-300">🍽</span>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            name="logo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="w-auto text-sm"
          />
          <Button type="submit" variant="outline" size="sm" disabled={isPending}>
            {isPending ? 'Uploading…' : 'Upload'}
          </Button>
        </form>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
