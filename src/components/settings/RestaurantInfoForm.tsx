'use client'
import { useFormState } from 'react-dom'
import { updateRestaurantInfoAction } from '@/lib/actions/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import type { Restaurant } from '@/types/restaurant'
import type { ActionResult } from '@/types/actions'
import { useState } from 'react'

const initialState: ActionResult = { success: false, error: '' }

interface RestaurantInfoFormProps {
  restaurant: Restaurant
}

export default function RestaurantInfoForm({ restaurant }: RestaurantInfoFormProps) {
  const [state, action, isPending] = useFormState(updateRestaurantInfoAction, initialState)
  const [isPublished, setIsPublished] = useState(restaurant.is_published)
  const [slug, setSlug] = useState(restaurant.slug ?? '')

  const siteOrigin =
    typeof window !== 'undefined'
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_SITE_URL ?? '')

  return (
    <form action={action} className="space-y-4">
      {'error' in state && state.error && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}
      {'message' in state && state.message && (
        <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Restaurant name *</Label>
          <Input id="name" name="name" defaultValue={restaurant.name} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cuisineType">Cuisine type</Label>
          <Input id="cuisineType" name="cuisineType" defaultValue={restaurant.cuisine_type ?? ''} placeholder="Italian, Mexican…" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="slug">Public URL slug *</Label>
        <div className="flex items-center rounded-md border border-input bg-muted/40 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <span className="select-none whitespace-nowrap px-3 text-sm text-muted-foreground">
            {siteOrigin}/
          </span>
          <input
            id="slug"
            name="slug"
            value={slug}
            onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-'))}
            className="flex-1 bg-transparent py-2 pr-3 text-sm outline-none"
            placeholder="my-restaurant"
            required
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Your page will be live at{' '}
          <span className="font-medium text-foreground">{siteOrigin}/{slug || '…'}</span>
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={restaurant.description ?? ''} rows={3} placeholder="Tell guests about your restaurant…" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="coverImageUrl">Hero / cover image URL</Label>
        <Input
          id="coverImageUrl"
          name="coverImageUrl"
          type="url"
          defaultValue={restaurant.cover_image_url ?? ''}
          placeholder="https://…"
        />
        <p className="text-xs text-muted-foreground">
          Full-width image at the top of your public page. Use a high-resolution landscape photo (same role as the
          Aurelia seed hero).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" defaultValue={restaurant.address ?? ''} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" defaultValue={restaurant.city ?? ''} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" defaultValue={restaurant.phone ?? ''} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={restaurant.email ?? ''} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="websiteUrl">Website</Label>
          <Input id="websiteUrl" name="websiteUrl" type="url" defaultValue={restaurant.website_url ?? ''} placeholder="https://" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="maxPartySize">Max party size</Label>
          <Input id="maxPartySize" name="maxPartySize" type="number" min={1} max={100} defaultValue={restaurant.max_party_size} />
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-lg border p-4">
        <Switch
          id="isPublished"
          checked={isPublished}
          onCheckedChange={setIsPublished}
          name="isPublished"
          value={isPublished ? 'true' : 'false'}
        />
        <input type="hidden" name="isPublished" value={isPublished ? 'true' : 'false'} />
        <div>
          <Label htmlFor="isPublished" className="cursor-pointer">Published</Label>
          <p className="text-xs text-muted-foreground">
            When published, your restaurant page is visible to the public.
          </p>
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Saving…' : 'Save changes'}
      </Button>
    </form>
  )
}
