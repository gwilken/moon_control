import { WINDOW_RESIZE, PUSH_DATA, ADD_INITIAL_DATA, PUSH_AND_SHIFT_DATA, UPDATE_KEY } from './constants'

export const windowResize = (field) => (
    {
      type: WINDOW_RESIZE,
      payload: field
    }
  )
  
  export const addInitialData = (data, key) => (
    {
      type: ADD_INITIAL_DATA,
      payload: data,
      key: key
    }
  )
  
  export const pushData = (data, key) => (
    {
      type: PUSH_DATA,
      payload: data,
      key: key
    }
  )
  
  export const pushAndShiftData = (data, key) => (
    {
      type: PUSH_AND_SHIFT_DATA,
      payload: data,
      key: key
    }
  )

  export const updateKey = (data, key) => (
    {
      type: UPDATE_KEY,
      payload: data,
      key: key
    }
  )