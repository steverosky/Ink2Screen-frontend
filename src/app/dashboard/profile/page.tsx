"use client"

import { useEffect, useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sdk } from "@/lib/sdk"
import { useAuthStore } from "@/lib/store"

export default function ProfilePage() {
  const { customer, setCustomer } = useAuthStore()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (customer) {
      setFirstName(customer.first_name ?? "")
      setLastName(customer.last_name ?? "")
      setEmail(customer.email ?? "")
    }
  }, [customer])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess(false)

    try {
      const res = await sdk.store.customer.update({
        first_name: firstName,
        last_name: lastName,
      })

      setCustomer({
        id: res.customer.id,
        email: res.customer.email,
        first_name: res.customer.first_name,
        last_name: res.customer.last_name,
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError("Failed to update profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-heading text-2xl font-bold tracking-tight text-[#e0e0e0]">
          Profile Settings
        </h2>
        <p className="mt-1 text-sm text-[#888]">
          Update your personal information.
        </p>
      </div>

      {/* Profile form */}
      <form
        onSubmit={handleSave}
        className="overflow-hidden rounded-[10px] border border-[#222] bg-[#121212]"
      >
        <div className="border-b border-[#222] px-6 py-4">
          <h3 className="text-sm font-semibold text-[#e0e0e0]">
            Personal Information
          </h3>
        </div>

        <div className="flex flex-col gap-5 px-6 py-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName" className="text-sm text-[#e0e0e0]">
                First Name
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border-[#333] bg-[#0a0a0a] text-[#e0e0e0] focus:border-brand-gold"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="lastName" className="text-sm text-[#e0e0e0]">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border-[#333] bg-[#0a0a0a] text-[#e0e0e0] focus:border-brand-gold"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm text-[#e0e0e0]">
              Email
            </Label>
            <Input
              id="email"
              value={email}
              disabled
              className="border-[#333] bg-[#0a0a0a] text-[#888]"
            />
            <p className="text-xs text-[#666]">
              Email cannot be changed. Contact support for assistance.
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          {success && (
            <p className="flex items-center gap-2 text-sm text-green-400">
              <Check className="h-4 w-4" />
              Profile updated successfully.
            </p>
          )}

          <div>
            <Button
              type="submit"
              disabled={saving}
              className="h-12 bg-brand-gold px-8 text-sm font-bold tracking-widest text-[#050505] hover:bg-brand-gold-dark"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "SAVE CHANGES"
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Account info (read-only) */}
      <div className="overflow-hidden rounded-[10px] border border-[#222] bg-[#121212]">
        <div className="border-b border-[#222] px-6 py-4">
          <h3 className="text-sm font-semibold text-[#e0e0e0]">
            Account Details
          </h3>
        </div>
        <div className="flex flex-col gap-3 px-6 py-6">
          <div className="flex justify-between text-sm">
            <span className="text-[#888]">Customer ID</span>
            <span className="font-mono text-xs text-[#666]">
              {customer?.id}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#888]">Email</span>
            <span className="text-[#e0e0e0]">{customer?.email}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
