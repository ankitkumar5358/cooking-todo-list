import React, { useState, useEffect } from 'react'
import { UtensilsCrossed, AlertTriangle, X, Eye, EyeOff, Sparkles } from 'lucide-react'
import SetupForm from './components/SetupForm'
import MealPlan from './components/MealPlan'
import GroceryList from './components/GroceryList'
import Substitutions from './components/Substitutions'
import BudgetFeasibility from './components/BudgetFeasibility'

export default function App() {
  // App state
  const [formData, setFormData] = useState({
    dayDescription: '',
    dietaryPreferences: ['None'],
    budget: 500,
    equipment: ['stove', 'microwave']
  })

  const [apiKey, setApiKey] = useState('')
  const [showApiModal, setShowApiModal] = useState(false)
  const [tempApiKey, setTempApiKey] = useState('')
  const [showKeyVisible, setShowKeyVisible] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [plan, setPlan] = useState(null)

  // Interactive todo states
  const [checkedSteps, setCheckedSteps] = useState({})
  const [checkedIngredients, setCheckedIngredients] = useState({})
  const [activeSubstitutions, setActiveSubstitutions] = useState({})
  const [actualCost, setActualCost] = useState(0)

  // Load API Key from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key')
    if (savedKey) {
      setApiKey(savedKey)
      setTempApiKey(savedKey)
    }
  }, [])

  // Calculate actual cost dynamically when plan or substitutions change
  useEffect(() => {
    if (!plan) return

    const subMap = {}
    plan.substitutions.forEach((sub) => {
      subMap[sub.original.toLowerCase()] = sub
    })

    let total = 0
    plan.groceryList.forEach((item) => {
      const lowerItemName = item.item.toLowerCase()
      const matchedOriginal = Object.keys(subMap).find(
        (orig) => lowerItemName.includes(orig) || orig.includes(lowerItemName)
      )

      if (matchedOriginal && activeSubstitutions[subMap[matchedOriginal].original]) {
        const sub = subMap[matchedOriginal]
        total += Math.max(0.01, item.estimatedCost + sub.costDifference)
      } else {
        total += item.estimatedCost
      }
    })

    setActualCost(total)
  }, [plan, activeSubstitutions])

  // Save API Key
  const handleSaveApiKey = () => {
    localStorage.setItem('gemini_api_key', tempApiKey.trim())
    setApiKey(tempApiKey.trim())
    setShowApiModal(false)
  }

  // Clear API Key
  const handleClearApiKey = () => {
    localStorage.removeItem('gemini_api_key')
    setApiKey('')
    setTempApiKey('')
    setShowApiModal(false)
  }

  // Handle Todo step toggle
  const handleStepToggle = (mealType, idx) => {
    const key = `${mealType}-${idx}`
    setCheckedSteps((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // Handle Grocery item toggle
  const handleIngredientToggle = (itemId) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  // Handle Substitution toggle
  const handleSubstitutionToggle = (originalName) => {
    setActiveSubstitutions((prev) => ({
      ...prev,
      [originalName]: !prev[originalName]
    }))
  }

  // Demo Mode data generator
  const runDemoMode = () => {
    setLoading(true)
    setError(null)
    
    // Simulate API delay
    setTimeout(() => {
      // Mock result structured perfectly around inputs
      const isVegan = formData.dietaryPreferences.includes('Vegan')
      const isVeg = formData.dietaryPreferences.includes('Vegetarian') || isVegan
      
      const mockPlan = {
        daySummary: `Since your day is described as "${formData.dayDescription.substring(0, 45)}...", we have planned a balanced schedule of high-energy meals. This fits your ₹${formData.budget} budget and requires only your selected kitchen equipment.`,
        meals: {
          breakfast: {
            name: isVeg ? 'Maple Pecan Oatmeal' : 'Fluffy Scrambled Eggs & Toast',
            prepTime: '5 mins',
            cookTime: '5 mins',
            description: 'A quick, low-cleanup breakfast designed to start your day efficiently.',
            todoList: [
              isVeg ? 'Boil oats in almond milk' : 'Whisk eggs with a splash of milk',
              isVeg ? 'Stir in maple syrup and cinnamon' : 'Melt butter on skillet, scramble eggs gently',
              'Toast whole grain bread',
              'Assemble on a plate and enjoy immediately'
            ],
            ingredients: [
              isVeg ? '1 cup Rolled Oats' : '3 Fresh Eggs',
              '1 slice Whole Grain Bread',
              isVeg ? '1 cup Almond Milk' : '1 tbsp Butter',
              isVeg ? '2 tbsp Pecans & Maple Syrup' : 'Salt & pepper to taste'
            ]
          },
          lunch: {
            name: isVeg ? 'Avocado & Chickpea Salad Wrap' : 'Smoked Turkey & Cheese Club Wrap',
            prepTime: '10 mins',
            cookTime: '0 mins',
            description: 'No cooking required, perfect for saving time mid-day.',
            todoList: [
              isVeg ? 'Mash chickpeas and avocados together' : 'Slice smoked turkey and cheddar cheese',
              'Lay out whole wheat tortilla wrap',
              'Spread salad greens and tomatoes',
              'Fold wrap tightly and slice in half'
            ],
            ingredients: [
              '1 Whole Wheat Tortilla',
              isVeg ? '1/2 cup Canned Chickpeas' : '4 slices Smoked Turkey',
              isVeg ? '1/2 Avocado' : '2 slices Cheddar Cheese',
              '1 cup Mixed Salad Greens',
              '1 small Tomato'
            ]
          },
          dinner: {
            name: isVeg ? 'Crispy Garlic Tofu & Broccoli Fry' : 'Quick Garlic Chicken & Broccoli Stir-Fry',
            prepTime: '10 mins',
            cookTime: '10 mins',
            description: 'A protein-rich dinner using basic equipment, rich in flavor and fast to make.',
            todoList: [
              isVeg ? 'Press and cube tofu' : 'Cut chicken breast into bite-sized pieces',
              'Chop fresh broccoli florets',
              'Heat cooking oil in skillet/stove',
              isVeg ? 'Sauté tofu until golden, add broccoli' : 'Cook chicken until done, toss in broccoli',
              'Pour in low-sodium soy sauce and minced garlic',
              'Cook for 3 additional minutes and plate'
            ],
            ingredients: [
              isVeg ? '1 block Firm Tofu' : '1 Chicken Breast',
              '1 head Fresh Broccoli',
              '2 cloves Minced Garlic',
              '2 tbsp Soy Sauce & Olive Oil'
            ]
          }
        },
        groceryList: [
          { item: 'Whole Grain Bread', category: 'Pantry', quantity: '1 loaf', estimatedCost: 50 },
          { item: 'Whole Wheat Tortillas', category: 'Pantry', quantity: '1 pack', estimatedCost: 60 },
          { item: 'Mixed Salad Greens', category: 'Produce', quantity: '1 bag', estimatedCost: 80 },
          { item: 'Fresh Broccoli', category: 'Produce', quantity: '1 head', estimatedCost: 40 },
          { item: 'Fresh Tomatoes', category: 'Produce', quantity: '2 count', estimatedCost: 20 },
          { item: 'Fresh Garlic', category: 'Produce', quantity: '1 bulb', estimatedCost: 10 },
          ...(isVeg 
            ? [
                { item: 'Rolled Oats', category: 'Pantry', quantity: '1 bag', estimatedCost: 60 },
                { item: 'Almond Milk', category: 'Refrigerated', quantity: '1 carton', estimatedCost: 70 },
                { item: 'Pecans & Maple Syrup', category: 'Pantry', quantity: '1 set', estimatedCost: 200 },
                { item: 'Canned Chickpeas', category: 'Pantry', quantity: '1 can', estimatedCost: 40 },
                { item: 'Fresh Avocado', category: 'Produce', quantity: '1 count', estimatedCost: 120 },
                { item: 'Firm Tofu', category: 'Refrigerated', quantity: '1 block', estimatedCost: 60 }
              ]
            : [
                { item: 'Fresh Eggs', category: 'Refrigerated', quantity: '1 carton', estimatedCost: 90 },
                { item: 'Unsalted Butter', category: 'Refrigerated', quantity: '1 block', estimatedCost: 60 },
                { item: 'Smoked Turkey slices', category: 'Meat', quantity: '1 pack', estimatedCost: 350 },
                { item: 'Cheddar Cheese slices', category: 'Refrigerated', quantity: '1 pack', estimatedCost: 150 },
                { item: 'Chicken Breast', category: 'Meat', quantity: '1 lb', estimatedCost: 280 }
              ]
          )
        ],
        substitutions: [
          ...(isVeg 
            ? [
                { original: 'Almond Milk', substituted: 'Water', reason: 'Zero-cost milk substitute for oatmeal', costDifference: -70 },
                { original: 'Pecans & Maple Syrup', substituted: 'Brown Sugar', reason: 'Lower budget sweetener alternative', costDifference: -150 }
              ]
            : [
                { original: 'Smoked Turkey slices', substituted: 'Canned Tuna', reason: 'Budget-friendly lean protein alternative', costDifference: -200 },
                { original: 'Chicken Breast', substituted: 'Block Tofu', reason: 'Affordable, long-lasting protein substitute', costDifference: -200 }
              ]
          )
        ],
        budgetAnalysis: {
          totalEstimatedCost: isVeg ? 500 : 990,
          isFeasible: isVeg ? (500 <= formData.budget) : (990 <= formData.budget),
          feedback: isVeg 
            ? `At ₹500, this meal plan is within your ₹${formData.budget} budget. Toggling substitutions can save you even more!`
            : `At ₹990, this exceeds your ₹${formData.budget} budget slightly. Try enabling the turkey/chicken substitutions to make it feasible.`,
          savingTips: [
            'Buy bulk grains and local store vegetables',
            'Substitute meat or specialty milks to reduce total cost significantly',
            'Cook larger batches to save prep energy and ingredient costs'
          ]
        }
      }

      setPlan(mockPlan)
      setCheckedSteps({})
      setCheckedIngredients({})
      setActiveSubstitutions({})
      setLoading(false)
    }, 1500)
  }

  // Generate via Google Gemini API
  const handleGeneratePlan = async () => {
    if (!apiKey) {
      runDemoMode()
      return
    }

    setLoading(true)
    setError(null)
    setPlan(null)

    // Build the request prompt
    const dietText = formData.dietaryPreferences.join(', ')
    const equipText = formData.equipment.join(', ')
    const prompt = `
      You are a professional chef and budget analyst. Generate a structured daily cooking todo list and meal plan for a user based on their day:
      - Day Description/Schedule: "${formData.dayDescription}"
      - Dietary Preferences: ${dietText}
      - Daily Budget Limit: ₹${formData.budget} INR
      - Kitchen Equipment Available: ${equipText}

      Your task is to respond with a JSON object. Ensure all prices are in INR (Indian Rupees) and are realistic for Indian household portions, aiming to fit within the budget.
      The meals must be breakfast, lunch, and dinner. Provide detailed, step-by-step todo items for preparing each meal that match the user's schedule (e.g. fast meals if they are busy).
      Recommend 2-3 smart substitutions to save money or simplify prep, stating the exact difference in cost (negative numbers for savings, positive for increases).
      Provide a budget analysis summarizing the feasibility and giving 3 cost-saving tips.
    `

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: 'OBJECT',
                properties: {
                  daySummary: { type: 'STRING' },
                  meals: {
                    type: 'OBJECT',
                    properties: {
                      breakfast: {
                        type: 'OBJECT',
                        properties: {
                          name: { type: 'STRING' },
                          prepTime: { type: 'STRING' },
                          cookTime: { type: 'STRING' },
                          description: { type: 'STRING' },
                          todoList: { type: 'ARRAY', items: { type: 'STRING' } },
                          ingredients: { type: 'ARRAY', items: { type: 'STRING' } }
                        },
                        required: ['name', 'prepTime', 'cookTime', 'description', 'todoList', 'ingredients']
                      },
                      lunch: {
                        type: 'OBJECT',
                        properties: {
                          name: { type: 'STRING' },
                          prepTime: { type: 'STRING' },
                          cookTime: { type: 'STRING' },
                          description: { type: 'STRING' },
                          todoList: { type: 'ARRAY', items: { type: 'STRING' } },
                          ingredients: { type: 'ARRAY', items: { type: 'STRING' } }
                        },
                        required: ['name', 'prepTime', 'cookTime', 'description', 'todoList', 'ingredients']
                      },
                      dinner: {
                        type: 'OBJECT',
                        properties: {
                          name: { type: 'STRING' },
                          prepTime: { type: 'STRING' },
                          cookTime: { type: 'STRING' },
                          description: { type: 'STRING' },
                          todoList: { type: 'ARRAY', items: { type: 'STRING' } },
                          ingredients: { type: 'ARRAY', items: { type: 'STRING' } }
                        },
                        required: ['name', 'prepTime', 'cookTime', 'description', 'todoList', 'ingredients']
                      }
                    },
                    required: ['breakfast', 'lunch', 'dinner']
                  },
                  groceryList: {
                    type: 'ARRAY',
                    items: {
                      type: 'OBJECT',
                      properties: {
                        item: { type: 'STRING' },
                        category: { type: 'STRING' },
                        quantity: { type: 'STRING' },
                        estimatedCost: { type: 'NUMBER' }
                      },
                      required: ['item', 'category', 'quantity', 'estimatedCost']
                    }
                  },
                  substitutions: {
                    type: 'ARRAY',
                    items: {
                      type: 'OBJECT',
                      properties: {
                        original: { type: 'STRING' },
                        substituted: { type: 'STRING' },
                        reason: { type: 'STRING' },
                        costDifference: { type: 'NUMBER' }
                      },
                      required: ['original', 'substituted', 'reason', 'costDifference']
                    }
                  },
                  budgetAnalysis: {
                    type: 'OBJECT',
                    properties: {
                      totalEstimatedCost: { type: 'NUMBER' },
                      isFeasible: { type: 'BOOLEAN' },
                      feedback: { type: 'STRING' },
                      savingTips: { type: 'ARRAY', items: { type: 'STRING' } }
                    },
                    required: ['totalEstimatedCost', 'isFeasible', 'feedback', 'savingTips']
                  }
                },
                required: ['daySummary', 'meals', 'groceryList', 'substitutions', 'budgetAnalysis']
              }
            }
          })
        }
      )

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error?.message || `API error: ${res.statusText}`)
      }

      const data = await res.json()
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No candidate content received from Gemini.')
      }

      const text = data.candidates[0].content.parts[0].text
      const parsedData = JSON.parse(text)

      setPlan(parsedData)
      setCheckedSteps({})
      setCheckedIngredients({})
      setActiveSubstitutions({})
    } catch (err) {
      console.error(err)
      setError(err.message || 'An unexpected error occurred while communicating with Gemini.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-container">
          <span className="logo-icon">🍳</span>
          <div>
            <h1 className="app-title">Cooking To-Do List</h1>
            <p className="app-subtitle">Structured Meal Planner & Cooking To-Do Lists</p>
          </div>
        </div>
        
        <div className="config-bar">
          <button className="btn-secondary" onClick={() => setShowApiModal(true)}>
            🔧 API Keys
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="main-grid">
        {/* Left Side Setup Panel */}
        <SetupForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleGeneratePlan}
          loading={loading}
          onOpenApiModal={() => setShowApiModal(true)}
          hasApiKey={!!apiKey}
        />

        {/* Right Side Results Dashboard */}
        <div className="dashboard-layout">
          {loading ? (
            <div className="glass-card loading-container">
              <div className="spinner"></div>
              <div className="loading-text">Crafting Your Cooking To-Do List...</div>
              <div className="loading-subtext">Optimizing recipes, grocery costs, and schedule fit</div>
            </div>
          ) : error ? (
            <div className="glass-card" style={{ borderColor: 'var(--accent-rose)', background: 'rgba(244, 63, 94, 0.05)' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <AlertTriangle color="var(--accent-rose)" size={24} />
                <h3 style={{ color: 'var(--accent-rose)' }}>Plan Generation Failed</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                {error}
              </p>
              <button className="btn-secondary" onClick={handleGeneratePlan}>
                Try Again
              </button>
            </div>
          ) : plan ? (
            <>
              {/* Day Summary */}
              <div className="glass-card summary-banner">
                <p className="summary-text">{plan.daySummary}</p>
              </div>

              {/* Breakfast, Lunch, Dinner Plan */}
              <MealPlan
                meals={plan.meals}
                checkedSteps={checkedSteps}
                onStepToggle={handleStepToggle}
              />

              {/* Groceries & Substitutions Grid */}
              <div className="dashboard-bottom-grid">
                <GroceryList
                  groceryList={plan.groceryList}
                  checkedIngredients={checkedIngredients}
                  onIngredientToggle={handleIngredientToggle}
                  activeSubstitutions={activeSubstitutions}
                  substitutions={plan.substitutions}
                />
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <BudgetFeasibility
                    budgetLimit={formData.budget}
                    actualCost={actualCost}
                    analysis={plan.budgetAnalysis}
                  />

                  <Substitutions
                    substitutions={plan.substitutions}
                    activeSubstitutions={activeSubstitutions}
                    onSubstitutionToggle={handleSubstitutionToggle}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="glass-card blank-state">
              <span className="blank-icon">🍽️</span>
              <h3 className="blank-title">Your Cooking To-Do List is Empty</h3>
              <p className="blank-desc">
                Fill in the details about your day on the left panel, configure your budget, and generate your custom schedule-matched cooking plan!
              </p>
              {!apiKey && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Tip: You don't have a Gemini API key set. Pressing Generate will run in <strong>Demo Mode</strong> to showcase the app instantly.
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* API Key Configuration Modal */}
      {showApiModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content">
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🔑 Configure Gemini API Key
              </h3>
              <button
                className="btn-flat"
                style={{ padding: '0.25rem', borderRadius: '50%' }}
                onClick={() => setShowApiModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            
            <p className="modal-desc">
              To generate dynamic real-time meal planning, input your Google Gemini API Key. It is stored locally in your browser's <code>localStorage</code>.
            </p>

            <div className="api-key-input-wrapper">
              <input
                type={showKeyVisible ? 'text' : 'password'}
                className="api-input"
                placeholder="AIzaSy..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
              />
              <button
                type="button"
                className="api-eye-btn"
                onClick={() => setShowKeyVisible(!showKeyVisible)}
              >
                {showKeyVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="modal-buttons">
              {apiKey && (
                <button
                  className="btn-secondary"
                  style={{ marginRight: 'auto', color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.2)' }}
                  onClick={handleClearApiKey}
                >
                  Clear Key
                </button>
              )}
              <button className="btn-flat" onClick={() => setShowApiModal(false)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                style={{ width: 'auto', marginTop: 0, padding: '0.625rem 1.25rem' }}
                onClick={handleSaveApiKey}
                disabled={!tempApiKey.trim()}
              >
                Save Connection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
