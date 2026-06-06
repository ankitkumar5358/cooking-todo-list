import React from 'react'
import { ShoppingCart } from 'lucide-react'

export default function GroceryList({
  groceryList,
  checkedIngredients,
  onIngredientToggle,
  activeSubstitutions,
  substitutions
}) {
  if (!groceryList || groceryList.length === 0) return null

  // Helper to map substitution lookup
  const subMap = {}
  if (substitutions) {
    substitutions.forEach((sub) => {
      subMap[sub.original.toLowerCase()] = sub
    })
  }

  // Group items by category
  const categories = {}
  groceryList.forEach((item) => {
    // Check if this item is substituted
    const lowerItemName = item.item.toLowerCase()
    let displayItemName = item.item
    let displayCost = item.estimatedCost
    let isSubbed = false
    let originalName = ''

    // Match exact or substring for substitution matching
    const matchedOriginal = Object.keys(subMap).find(
      (orig) => lowerItemName.includes(orig) || orig.includes(lowerItemName)
    )

    if (matchedOriginal && activeSubstitutions[subMap[matchedOriginal].original]) {
      const sub = subMap[matchedOriginal]
      originalName = item.item
      displayItemName = sub.substituted
      displayCost = Math.max(0.01, item.estimatedCost + sub.costDifference)
      isSubbed = true
    }

    const cat = item.category || 'Other'
    if (!categories[cat]) categories[cat] = []
    categories[cat].push({
      id: item.item, // Use original item name as identifier for checked state
      originalName,
      displayName: displayItemName,
      quantity: item.quantity,
      cost: displayCost,
      isSubbed
    })
  })

  return (
    <div className="glass-card">
      <div className="card-title">
        <ShoppingCart size={22} color="#3b82f6" />
        <h2>Grocery Shopping List</h2>
      </div>

      <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem' }}>
        {Object.keys(categories).map((catName) => (
          <div key={catName} className="grocery-category">
            <h4 className="grocery-category-title">{catName}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {categories[catName].map((item, idx) => {
                const isChecked = !!checkedIngredients[item.id]
                return (
                  <div key={idx} className="grocery-item-row">
                    <label
                      className="grocery-item-left"
                      style={{ cursor: 'pointer', flex: 1 }}
                      onClick={() => onIngredientToggle(item.id)}
                    >
                      <input
                        type="checkbox"
                        className="todo-checkbox"
                        checked={isChecked}
                        readOnly // Toggle handled by parent wrapper click
                      />
                      <span className={isChecked ? 'grocery-item-checked' : ''}>
                        {item.isSubbed ? (
                          <>
                            <span className="grocery-original-crossed">{item.originalName}</span>
                            <span>{item.displayName}</span>
                            <span className="substituted-label">Subbed</span>
                          </>
                        ) : (
                          <span>{item.displayName}</span>
                        )}
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                          ({item.quantity})
                        </span>
                      </span>
                    </label>
                    <span className="grocery-cost">₹{item.cost.toFixed(0)}</span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
