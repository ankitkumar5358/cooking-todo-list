import React from 'react'
import { Calculator, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react'

export default function BudgetFeasibility({ budgetLimit, actualCost, analysis }) {
  if (!analysis) return null

  // Calculate percentage of budget used
  const percentUsed = Math.min(150, (actualCost / budgetLimit) * 100)
  
  // Status states
  let status = 'feasible'
  let alertClass = 'alert-feasible'
  let statusText = 'Under Budget (Feasible)'
  let statusIcon = <CheckCircle size={18} color="#10b981" />

  if (actualCost > budgetLimit) {
    status = 'over'
    alertClass = 'alert-over'
    statusText = 'Over Budget'
    statusIcon = <AlertTriangle size={18} color="#f43f5e" />
  } else if (percentUsed >= 85) {
    status = 'warning'
    alertClass = 'alert-feasible' // Keep safe background but warning color
    statusText = 'Near Budget Limit'
    statusIcon = <AlertTriangle size={18} color="#f59e0b" />
  }

  return (
    <div className="glass-card" style={{ height: '100%' }}>
      <div className="card-title">
        <Calculator size={22} color="#10b981" />
        <h2>Budget Feasibility</h2>
      </div>

      <div className="budget-meter-container">
        <div className="budget-stats-row">
          <div className="stat-box">
            <span className="stat-label">Daily Limit</span>
            <span className="stat-value value-total">₹{budgetLimit.toFixed(0)}</span>
          </div>
          <div className="stat-box" style={{ alignItems: 'flex-end' }}>
            <span className="stat-label">Estimated Cost</span>
            <span className={`stat-value value-actual ${status}`}>
              ₹{actualCost.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Custom Progress Bar */}
        <div className="feasibility-bar-track">
          <div
            className={`feasibility-bar-fill ${status}`}
            style={{ width: `${percentUsed}%` }}
          ></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>0%</span>
          <span>50%</span>
          <span>100% (Limit)</span>
        </div>
      </div>

      <div className={`budget-alert ${alertClass}`} style={{ marginBottom: '1.5rem' }}>
        <div style={{ marginTop: '0.15rem' }}>{statusIcon}</div>
        <div>
          <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{statusText}</strong>
          {analysis.feedback || `Your meal plan is estimated to cost ₹${actualCost.toFixed(0)} out of your ₹${budgetLimit.toFixed(0)} budget.`}
        </div>
      </div>

      {analysis.savingTips && analysis.savingTips.length > 0 && (
        <div className="saving-tips-container">
          <div className="tips-title">
            <Lightbulb size={14} color="#f59e0b" />
            <span>AI Cost-Saving Recommendations</span>
          </div>
          <ul className="tips-list">
            {analysis.savingTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
