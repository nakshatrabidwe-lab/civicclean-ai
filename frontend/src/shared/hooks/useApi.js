import { useState, useCallback } from 'react'
import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

/**
 * useApi – lightweight hook for triggering API calls.
 *
 * Usage:
 *   const { data, loading, error, execute } = useApi('/reports', 'GET')
 *   useEffect(() => { execute() }, [])
 */
export function useApi(endpoint, method = 'GET') {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const execute = useCallback(async (body = null, params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api({ method, url: endpoint, data: body, params })
      setData(res.data)
      return res.data
    } catch (err) {
      const msg = err.response?.data?.message ?? err.message
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [endpoint, method])

  return { data, loading, error, execute }
}

export default api
