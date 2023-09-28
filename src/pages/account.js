// src/pages/account.js
import React from "react"
import { login, logout, isAuthenticated, getProfile } from "../utils/auth"

const Home = ({ user }) => {
  return <p>Hi, {user.name ? user.name : "friend"}! Your email is {user.email}</p>
}

const Account = () => {
  if (!isAuthenticated()) {
    login()
    return <p>Redirecting to login...</p>
  }

  const user = getProfile()

  return (
    <>
    <a
        href="#logout"
        onClick={e => {
        logout()
        e.preventDefault()
        }}
    >
        Log Out
    </a>
    <Home user={user} />
    </>
  )
}

export default Account