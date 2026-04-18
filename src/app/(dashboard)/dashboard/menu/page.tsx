import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getMenuWithCategories } from '@/lib/queries/menu'
import CategoryList from '@/components/menu/CategoryList'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Menu' }

export default async function MenuPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('restaurant_id')
    .eq('id', user.id)
    .single()

  if (!profile?.restaurant_id) redirect('/login')

  const categories = await getMenuWithCategories(supabase, profile.restaurant_id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
      </div>
      <CategoryList categories={categories} />
    </div>
  )
}
