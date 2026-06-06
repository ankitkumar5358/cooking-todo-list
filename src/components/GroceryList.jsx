import React, { useState } from 'react'
import { ShoppingCart, CheckSquare, Square, Trash2, Search } from 'lucide-react'
export default function GroceryList({
  groceryList,
  checkedIngredients,
  onIngredientToggle,
  activeSubstitutions,
  substitutions
}) {
  const [searchQuery, setSearchQuery] = useState('')
  if (!groceryList || groceryList.length === 0) return null
  // Helper to map substitution lookup
  const subMap = {}
  if (substitutions) {
    substitutions.forEach((sub) => {
      subMap[sub.original.toLowerCase()] = sub
    })
  }
  // Pre-process items with active substitutions applied
  const processedItems = groceryList.map((item) => {
    const lowerItemName = item.item.toLowerCase()
    let displayItemName = item.item
    let displayCost = item.estimatedCost
    let isSubbed = false
    let originalName = ''
    const matchedOriginal = Object.keys(subMap).find(
      (orig) => lowerItemName.includes(orig) || orig.includes(lowerItemName)
    )
    if (matchedOriginal && activeSubstitutions[subMap[matchedOriginal].original]) {
      const sub = subMap[matchedOriginal]
      originalName = item.item
      displayItemName = sub.substituted
      displayCost = Math.max(1, item.estimatedCost + sub.costDifference)
      isSubbed = true
    }
    return {
      id: item.item,
      originalName,
      displayName: displayItemName,
      quantity: item.quantity,
      cost: displayCost,
      isSubbed,
      category: item.category || 'Other'
    }
  })
  // Filter items by search query
  const filteredItems = processedItems.filter(item => 
    item.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )
  // Group items by category
  const categories = {}
  filteredItems.forEach((item) => {
    if (!categories[item.category]) {
      categories[item.category] = []
    }
    categories[item.category].push(item)
  })
  // Calculate stats
  const totalItems = processedItems.length
  const checkedItemsCount = processedItems.filter(item => checkedIngredients[item.id]).length
  const completionPercent = totalItems > 0 ? Math.round((checkedItemsCount / totalItems) * 100) : 0
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-title" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShoppingCart size={22} color="#3b82f6" />
          <h2>Grocery Shopping List</h2>
        </div>
        <span style={{ fontSize: '0.8rem', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '0.25rem 0.5rem', borderRadius: '50px', fontWeight: 'bold' }}>
          {checkedItemsCount}/{totalItems} Items
        </span>
      </div>
      {/* Progress Bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
          <span>Shopping Progress</span>
          <span>{completionPercent}% Complete</span>
        </div>
        <div style={{ width: '100%', height: '6px', background: 'var(--bg-secondary)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
          <div 
            style={{ 
              width: `${completionPercent}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-emerald))', 
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
            }}
          ></div>
        </div>
      </div>
      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '11px' }} />
        <input
          type="text"
          placeholder="Search items or categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--border-radius-sm)',
            padding: '0.5rem 0.5rem 0.5rem 2rem',
            fontSize: '0.825rem',
            color: '#ffffff'
          }}
        />
      </div>
      {/* Categories List */}
      <div style={{ flex: 1, maxHeight: '350px', overflowY: 'auto', paddingRight: '0.25rem' }}>
        {Object.keys(categories).length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2rem' }}>
            No items match your search.
          </p>
        ) : (
          Object.keys(categories).map((catName) => (
            <div key={catName} className="grocery-category">
              <h4 className="grocery-category-title">{catName}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {categories[catName].map((item) => {
                  const isChecked = !!checkedIngredients[item.id]
                  return (
                    <div key={item.id} className="grocery-item-row" style={{ opacity: isChecked ? 0.7 : 1 }}>
                      <label
                        className="grocery-item-left"
                        style={{ cursor: 'pointer', flex: 1 }}
                        onClick={() => onIngredientToggle(item.id)}
                      >
                        <input
                          type="checkbox"
                          className="todo-checkbox"
                          checked={isChecked}
                          readOnly
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
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}