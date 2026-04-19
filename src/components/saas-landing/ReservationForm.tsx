'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type ReservationCopy = {
  eyebrow: string
  title: string
  description: string
}

const controlClass =
  'h-11 rounded-xl border-stone-200 bg-white text-stone-900 placeholder:text-stone-500 shadow-sm [color-scheme:light] focus-visible:border-amber-500/50 focus-visible:ring-2 focus-visible:ring-amber-600/20'

const textareaClass =
  'min-h-[100px] resize-none rounded-xl border-stone-200 bg-white text-stone-900 placeholder:text-stone-500 shadow-sm [color-scheme:light] focus-visible:border-amber-500/50 focus-visible:ring-2 focus-visible:ring-amber-600/20'

export function ReservationForm({ copy }: { copy: ReservationCopy }) {
  const [submitted, setSubmitted] = useState(false)
  const reduceMotion = useReducedMotion()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section
      id="reservation"
      className="border-y border-stone-200 bg-stone-100 py-16 md:py-24"
      aria-labelledby="reserve-heading"
    >
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center"
        >
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">{copy.eyebrow}</p>
          <h2 id="reserve-heading" className="mt-3 font-serif text-3xl font-semibold text-stone-900 sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mt-3 font-sans text-stone-600">{copy.description}</p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mt-10 rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm sm:p-8"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 text-center"
              >
                <p className="font-serif text-xl text-stone-900">Thank you — we&apos;ll hold your request.</p>
                <p className="mt-2 font-sans text-sm text-stone-600">
                  Create your restaurant on TableFlow to accept real bookings.
                </p>
                <Button asChild className="mt-6 rounded-full bg-stone-900 hover:bg-stone-800">
                  <Link href="/signup">Create your restaurant</Link>
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-5 text-stone-900"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="guest-name" className="text-stone-700">
                      Name
                    </Label>
                    <Input
                      id="guest-name"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="Alex Morgan"
                      className={controlClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guest-email" className="text-stone-700">
                      Email
                    </Label>
                    <Input
                      id="guest-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={controlClass}
                    />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="guest-date" className="text-stone-700">
                      Date
                    </Label>
                    <Input
                      id="guest-date"
                      name="date"
                      type="date"
                      required
                      className={controlClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guest-party" className="text-stone-700">
                      Party size
                    </Label>
                    <Input
                      id="guest-party"
                      name="party"
                      type="number"
                      min={1}
                      max={20}
                      defaultValue={2}
                      required
                      className={controlClass}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guest-notes" className="text-stone-700">
                    Notes <span className="font-normal text-stone-500">(optional)</span>
                  </Label>
                  <Textarea
                    id="guest-notes"
                    name="notes"
                    rows={3}
                    placeholder="Allergies, occasion, seating preference…"
                    className={textareaClass}
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 w-full rounded-full bg-stone-900 text-base font-semibold hover:bg-stone-800 sm:w-auto sm:px-10"
                >
                  Submit request
                </Button>
                <p className="text-center font-sans text-xs text-stone-500 sm:text-left">
                  Prefer the real product?{' '}
                  <Link href="/signup" className="font-medium text-amber-800 underline-offset-4 hover:underline">
                    Start free on TableFlow
                  </Link>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
