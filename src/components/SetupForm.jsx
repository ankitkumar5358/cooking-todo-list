import React from 'react'
import { Sparkles, Key, CheckCircle2 } from 'lucide-react'

export default function SetupForm({
  formData,
  setFormData,
  onSubmit,
  loading,
  onOpenApiModal,
  hasApiKey
}) {
  const dietaryOptions = [
    'None',
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Keto',
    'Dairy-Free',
    'Low-Carb'
  ]

  const equipmentOptions = [
    { id: 'stove', name: 'Stove/Cooktop' },
    { id: 'oven', name: 'Oven' },
    { id: 'microwave', name: 'Microwave' },
    { id: 'airfryer', name: 'Air Fryer' },
    { id: 'slowcooker', name: 'Slow Cooker' },
    { id: 'blender', name: 'Blender/Processor' }
  ]

  const handleDietToggle = (diet) => {
    let updatedDiets = [...formData.dietaryPreferences]
    if (diet === 'None') {
      updatedDiets = ['None']
    } else {
      updatedDiets = updatedDiets.filter((d) => d !== 'None')
      if (updatedDiets.includes(diet)) {
        updatedDiets = updatedDiets.filter((d) => d !== diet)
        if (updatedDiets.length === 0) updatedDiets = ['None']
      } else {
        updatedDiets.push(diet)
      }
    }
    setFormData({ ...formData, dietaryPreferences: updatedDiets })
  }

  const handleEquipmentToggle = (equipId) => {
    const updatedEquip = formData.equipment.includes(equipId)
      ? formData.equipment.filter((id) => id !== equipId)
      : [...formData.equipment, equipId]
    setFormData({ ...formData, equipment: updatedEquip })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className="glass-card">
      <div className="card-title">
        <Sparkles size={22} color="#8b5cf6" />
        <h2>Plan Your Cooking Day</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Describe Your Day & Schedule</label>
          <textarea
            className="form-textarea"
            placeholder="e.g. I have a packed meeting schedule from 9 AM to 6 PM, then a gym session. Need a quick energizing breakfast, an easy-to-reheat lunch, and a high-protein dinner that takes under 20 minutes."
            value={formData.dayDescription}
            onChange={(e) => setFormData({ ...formData, dayDescription: e.target.value })}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Dietary Preferences</label>
          <div className="badge-grid">
            {dietaryOptions.map((diet) => {
              const isActive = formData.dietaryPreferences.includes(diet)
              return (
                <button
                  key={diet}
                  type="button"
                  className={`diet-badge ${isActive ? 'active' : ''}`}
                  onClick={() => handleDietToggle(diet)}
                  disabled={loading}
                >
                  {diet}
                </button>
              )
            })}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Daily Cooking Budget</label>
          <div className="budget-input-wrapper">
            <div className="slider-container">
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                className="budget-slider"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                disabled={loading}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>₹100</span>
                <span>₹1000</span>
                <span>₹2000</span>
              </div>
            </div>
            <div className="budget-value-box">
              ₹{formData.budget}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Available Kitchen Equipment</label>
          <div className="equipment-grid">
            {equipmentOptions.map((equip) => {
              const isChecked = formData.equipment.includes(equip.id)
              return (
                <label key={equip.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    className="checkbox-custom"
                    checked={isChecked}
                    onChange={() => handleEquipmentToggle(equip.id)}
                    disabled={loading}
                  />
                  <span>{equip.name}</span>
                </label>
              )
            })}
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading || !formData.dayDescription.trim()}
        >
          <Sparkles size={18} />
          {loading ? 'Generating Recipe Todo List...' : 'Generate AI Meal Planner'}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {hasApiKey ? (
            <>
              <CheckCircle2 size={14} color="#10b981" />
              <span>Gemini API Connected</span>
            </>
          ) : (
            <span>Running in Demo Mode</span>
          )}
        </span>
        <button
          type="button"
          className="btn-secondary"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
          onClick={onOpenApiModal}
        >
          <Key size={12} />
          {hasApiKey ? 'Change API Key' : 'Configure API Key'}
        </button>
      </div>
    </div>
  )
}
