import React from 'react'
import { Route } from 'react-router-dom'

export default function PrivateRoute ({
  component: Component,
  authenticated,
  ...rest
}) {
  return <Route {...rest} />
}
