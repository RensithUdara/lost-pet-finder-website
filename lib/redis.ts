import { Redis } from "@upstash/redis"

// Create a more resilient Redis client with retries and timeouts
let redisClient: Redis | null = null

function createRedisClient() {
  try {
    // Check which environment variables are available
    const kvUrl = process.env.KV_URL || ""
    const redisUrl = process.env.REDIS_URL || ""
    const kvRestApiUrl = process.env.KV_REST_API_URL || ""

    const token = process.env.KV_REST_API_TOKEN || process.env.KV_REST_API_READ_ONLY_TOKEN || ""

    // Log available environment variables for debugging (without exposing sensitive data)
    console.log("Redis environment variables available:", {
      hasKvRestApiUrl: !!kvRestApiUrl,
      hasKvUrl: !!kvUrl,
      hasRedisUrl: !!redisUrl,
      hasKvRestApiToken: !!process.env.KV_REST_API_TOKEN,
      hasKvRestApiReadOnlyToken: !!process.env.KV_REST_API_READ_ONLY_TOKEN,
    })

    // Determine which URL to use
    let url = ""

    // First, try KV_REST_API_URL which is the correct format for Upstash REST API
    if (kvRestApiUrl && kvRestApiUrl.startsWith("https://")) {
      url = kvRestApiUrl
      console.log("Using KV_REST_API_URL for Redis connection")
    }
    // Then try KV_URL, but check if it needs conversion
    else if (kvUrl) {
      if (kvUrl.startsWith("https://")) {
        url = kvUrl
        console.log("Using KV_URL for Redis connection")
      } else if (kvUrl.startsWith("rediss://")) {
        // Convert rediss:// URL to https:// format
        // Extract the host from the rediss:// URL
        const match = kvUrl.match(/rediss:\/\/.*@(.*):/)
        if (match && match[1]) {
          const host = match[1]
          url = `https://${host}.upstash.io/`
          console.log("Converted rediss:// URL to https:// format")
        }
      }
    }
    // Finally try REDIS_URL with the same conversion if needed
    else if (redisUrl) {
      if (redisUrl.startsWith("https://")) {
        url = redisUrl
        console.log("Using REDIS_URL for Redis connection")
      } else if (redisUrl.startsWith("rediss://")) {
        // Convert rediss:// URL to https:// format
        const match = redisUrl.match(/rediss:\/\/.*@(.*):/)
        if (match && match[1]) {
          const host = match[1]
          url = `https://${host}.upstash.io/`
          console.log("Converted rediss:// URL to https:// format")
        }
      }
    }

    // If we couldn't determine a valid URL, use mock client
    if (!url || !url.startsWith("https://")) {
      console.warn("No valid Redis URL found. Using mock Redis client.")
      return createMockRedisClient()
    }

    // If no token is available, use mock client
    if (!token) {
      console.warn("No Redis token found. Using mock Redis client.")
      return createMockRedisClient()
    }

    console.log("Initializing Redis client with URL:", url.substring(0, 20) + "...")

    // Create the Redis client with the URL and token
    return new Redis({
      url,
      token,
      retry: {
        retries: 3,
        backoff: (retryCount) => Math.min(Math.exp(retryCount) * 50, 1000),
      },
    })
  } catch (error) {
    console.error("Error creating Redis client:", error)
    return createMockRedisClient()
  }
}

// Create a mock Redis client for fallback
function createMockRedisClient() {
  console.log("Using mock Redis client")

  // In-memory storage
  const storage = new Map<string, any>()
  const lists = new Map<string, string[]>()

  return {
    get: async (key: string) => {
      console.log(`[MOCK] Getting key: ${key}`)
      return storage.get(key) || null
    },
    set: async (key: string, value: any) => {
      console.log(`[MOCK] Setting key: ${key}`)
      storage.set(key, value)
      return "OK"
    },
    del: async (key: string) => {
      console.log(`[MOCK] Deleting key: ${key}`)
      storage.delete(key)
      return 1
    },
    lpush: async (key: string, ...values: any[]) => {
      console.log(`[MOCK] Pushing to list: ${key}`)
      if (!lists.has(key)) {
        lists.set(key, [])
      }
      const list = lists.get(key)!
      list.unshift(...values)
      return list.length
    },
    lrange: async (key: string, start: number, end: number) => {
      console.log(`[MOCK] Getting range from list: ${key}`)
      const list = lists.get(key) || []
      if (end === -1) end = list.length - 1
      return list.slice(start, end + 1)
    },
    llen: async (key: string) => {
      console.log(`[MOCK] Getting list length: ${key}`)
      return lists.get(key)?.length || 0
    },
    lrem: async (key: string, count: number, value: any) => {
      console.log(`[MOCK] Removing from list: ${key}`)
      if (!lists.has(key)) return 0

      const list = lists.get(key)!
      const initialLength = list.length

      if (count === 0) {
        // Remove all occurrences
        const newList = list.filter((item) => item !== value)
        lists.set(key, newList)
        return initialLength - newList.length
      } else {
        // Not implementing count > 0 or count < 0 for simplicity
        return 0
      }
    },
    ping: async () => {
      return "PONG"
    },
  } as unknown as Redis
}

// Get or create the Redis client
export default function getRedisClient() {
  if (!redisClient) {
    redisClient = createRedisClient()

    // Test the connection
    redisClient
      .ping()
      .then(() => {
        console.log("Redis connection successful")
      })
      .catch((error) => {
        console.error("Redis connection error:", error)
        // If connection fails, replace with mock client
        redisClient = createMockRedisClient()
      })
  }
  return redisClient
}
