'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SKU } from '@/types'

export default function SKUManager({ skus, brandId }: { skus: SKU[]; brandId: string }) {
  const router = useRouter()
  const supabase = createClient()

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [rewardAmount, setRewardAmount] = useState('0.50')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: insertError } = await supabase.from('skus').insert({
      brand_id: brandId,
      name,
      reward_amount: parseFloat(rewardAmount),
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setName('')
    setRewardAmount('0.50')
    setShowForm(false)
    setLoading(false)
    router.refresh()
  }

  async function toggleSKU(sku: SKU) {
    await supabase.from('skus').update({ is_active: !sku.is_active }).eq('id', sku.id)
    router.refresh()
  }

  async function deleteSKU(id: string) {
    if (!confirm('Delete this SKU?')) return
    await supabase.from('skus').delete().eq('id', id)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {/* SKU table */}
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">SKU Name</th>
              <th className="text-left p-3 font-medium">Reward</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-right p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skus.map(sku => (
              <tr key={sku.id} className="border-t">
                <td className="p-3 font-medium">{sku.name}</td>
                <td className="p-3">${Number(sku.reward_amount).toFixed(2)}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    sku.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {sku.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => toggleSKU(sku)}
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    {sku.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => deleteSKU(sku.id)}
                    className="text-xs text-destructive hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {skus.length === 0 && (
              <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No SKUs yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add SKU form */}
      {showForm ? (
        <form onSubmit={handleAdd} className="rounded-xl border p-4 space-y-4">
          <h3 className="font-semibold">Add New SKU</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="sku-name">SKU Name</Label>
              <Input
                id="sku-name"
                placeholder="Night Phantom Vape"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="reward">Reward Amount ($)</Label>
              <Input
                id="reward"
                type="number"
                step="0.01"
                min="0.01"
                max="10"
                value={rewardAmount}
                onChange={e => setRewardAmount(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" disabled={loading} size="sm">
              {loading ? 'Adding...' : 'Add SKU'}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button onClick={() => setShowForm(true)} variant="outline">
          + Add SKU
        </Button>
      )}
    </div>
  )
}
