import React from 'react'
import { RefreshCw, ArrowRight } from 'lucide-react'

export default function Substitutions({
  substitutions,
  activeSubstitutions,
  onSubstitutionToggle
}) {
  if (!substitutions || substitutions.length === 0) {
    return (
      <div className="glass-card">
        <div className="card-title">
          <RefreshCw size={22} color="#a855f7" />
          <h2>Smart Ingredient Substitutions</h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1.5rem 0' }}>
          No substitutions recommended for this meal plan.
        </p>
      </div>
    )
  }

  return (
    <div className="glass-card">
      <div className="card-title">
        <RefreshCw size={22} color="#a855f7" />
        <h2>Smart Ingredient Substitutions</h2>
      </div>

      <div className="sub-list">
        {substitutions.map((sub, idx) => {
          const isActive = !!activeSubstitutions[sub.original]
          const isSaving = sub.costDifference < 0
          const diffAbs = Math.abs(sub.costDifference)

          return (
            <div key={idx} className="sub-item-card">
              <div className="sub-header-row">
                <div className="sub-titles">
                  <span style={{ color: 'var(--text-secondary)' }}>{sub.original}</span>
                  <ArrowRight size={14} className="sub-arrow" />
                  <span style={{ color: '#ffffff' }}>{sub.substituted}</span>
                </div>
                <label className="switch-control">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => onSubstitutionToggle(sub.original)}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>

              <div className="sub-reason">{sub.reason}</div>

              <div className="sub-cost-impact">
                {sub.costDifference === 0 ? (
                  <span className="cost-neutral">Cost Impact: Neutral</span>
                ) : isSaving ? (
                  <span className="cost-saving">
                    Saves ₹{diffAbs.toFixed(0)}
                  </span>
                ) : (
                  <span className="cost-increase">
                    Adds ₹{diffAbs.toFixed(0)}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
