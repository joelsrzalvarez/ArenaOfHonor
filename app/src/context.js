import { createContext, useContext as useReactContext } from 'react'

export const Context = createContext()

export const useContext = () => useReactContext(Context)