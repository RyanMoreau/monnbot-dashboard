import React from 'react'
import { ThemeToggler } from 'gatsby-plugin-dark-mode'
import emoji from "node-emoji"

export default function Toggle() {
    return (
        <ThemeToggler>
        {({ theme, toggleTheme }) => (
          <label>
            <input
              type="checkbox"
              onChange={e => toggleTheme(e.target.checked ? 'dark' : 'light')}
              checked={theme === 'dark'}
            />
            {emoji.get('bulb')}
          </label>
        )}
      </ThemeToggler>
    )
}