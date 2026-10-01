"use client";

import React, { useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { PROMO_CODE_ERROR, promoCodeLabel } from '../../lib/promoCode';

/**
 * The optional promo code box, on both feasibility checkouts.
 *
 * Closed behind a "Have a promo code?" link until someone asks for it. An open,
 * empty code box sends people off to search for a code they do not have, and
 * most people paying here have none.
 *
 * A code that is typed but not recognised blocks payment, with a message, the
 * same way the disclaimer does. Paying with a mistyped code would leave a
 * Founding 20 client off the list without either side knowing.
 */
interface Props {
  value: string;
  onChange: (next: string) => void;
  /** Set once the client has tried to pay with a code we do not accept. */
  showError?: boolean;
  id: string;
}

export const PromoCodeField: React.FC<Props> = ({ value, onChange, showError = false, id }) => {
  const [open, setOpen] = useState(!!value);
  const label = promoCodeLabel(value);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-fl-4 text-xs font-medium text-thistle-black/60 underline underline-offset-2 hover:text-thistle-black transition-colors"
      >
        Have a promo code?
      </button>
    );
  }

  return (
    <div className="mt-fl-4">
      <label htmlFor={id} className="block text-xs font-medium text-thistle-black/70 mb-fl-1">
        Promo code
      </label>
      <input
        id={id}
        name="promoCode"
        type="text"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={showError || undefined}
        aria-describedby={showError ? `${id}-error` : label ? `${id}-ok` : undefined}
        className="w-full sm:w-48 border border-thistle-black/10 rounded-full px-4 py-2.5 text-sm uppercase bg-thistle-white/50 focus:border-thistle-green focus:ring-1 focus:ring-thistle-green/20 outline-none transition-colors placeholder:normal-case placeholder:text-thistle-black/25"
        placeholder="Enter code"
      />
      {label && !showError && (
        <p id={`${id}-ok`} className="flex items-center gap-1.5 text-xs text-thistle-green mt-fl-2">
          <Check size={14} className="flex-shrink-0" />
          {label} code added.
        </p>
      )}
      {showError && (
        <p id={`${id}-error`} role="alert" className="flex items-start gap-1.5 text-xs text-red-700 mt-fl-2">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          {PROMO_CODE_ERROR}
        </p>
      )}
    </div>
  );
};
