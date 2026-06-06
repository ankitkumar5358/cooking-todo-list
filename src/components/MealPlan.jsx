import React from 'react'
import { Clock, CheckSquare, Sun, CloudSun, Moon } from 'lucide-react'

export default function MealPlan({ meals, checkedSteps, onStepToggle }) {
  if (!meals) return null

  const mealCategories = [
    {
      key: 'breakfast',
      label: 'Breakfast',
      themeClass: 'breakfast-theme',
      icon: <Sun size={18} color="#fbbf24" />
    },
    {
      key: 'lunch',
      label: 'Lunch',
      themeClass: 'lunch-theme',
      icon: <CloudSun size={18} color="#60a5fa" />
    },
    {
      key: 'dinner',
      label: 'Dinner',
      themeClass: 'dinner-theme',
      icon: <Moon size={18} color="#34d399" />
    }
  ]

  return (
    <div className="meals-grid">
      {mealCategories.map((cat) => {
        const meal = meals[cat.key]
        if (!meal) return null

        return (
          <div key={cat.key} className={`glass-card meal-card ${cat.themeClass}`}>
            <div className="meal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {cat.icon}
                <span className="meal-type">{cat.label}</span>
              </div>
              <div className="meal-time">
                <Clock size={12} />
                <span>
                  Prep: {meal.prepTime} | Cook: {meal.cookTime}
                </span>
              </div>
            </div>

            <h3 className="meal-name">{meal.name}</h3>
            <p className="meal-desc">{meal.description}</p>

            <div style={{ marginTop: 'auto' }}>
              <div className="todo-section-title">Cooking To-Do List</div>
              <ul className="todo-list">
                {meal.todoList.map((step, idx) => {
                  const stepId = `${cat.key}-${idx}`
                  const isChecked = !!checkedSteps[stepId]

                  return (
                    <li
                      key={idx}
                      className="todo-item"
                      onClick={() => onStepToggle(cat.key, idx)}
                    >
                      <input
                        type="checkbox"
                        className="todo-checkbox"
                        checked={isChecked}
                        readOnly // Toggle handled by parent onClick
                      />
                      <span className="todo-text">{step}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        )
      })}
    </div>
  )
}
