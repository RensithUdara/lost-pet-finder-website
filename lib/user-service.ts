import { v4 as uuidv4 } from "uuid"
import redis from "./redis"
import { hash, compare } from "bcryptjs"

export interface User {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: number
}

const USER_KEY_PREFIX = "user:"
const USER_EMAIL_KEY_PREFIX = "user_email:"
const USERS_KEY = "users"

export async function createUser(userData: { name: string; email: string; password: string }): Promise<
  Omit<User, "passwordHash">
> {
  // Check if user with email already exists
  const existingUser = await getUserByEmail(userData.email)
  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  const id = uuidv4()
  const createdAt = Date.now()
  const passwordHash = await hash(userData.password, 10)

  const user: User = {
    id,
    name: userData.name,
    email: userData.email,
    passwordHash,
    createdAt,
  }

  // Store the user in Redis
  await redis.set(`${USER_KEY_PREFIX}${id}`, JSON.stringify(user))

  // Create an email index for lookup
  await redis.set(`${USER_EMAIL_KEY_PREFIX}${userData.email}`, id)

  // Add to users list
  await redis.lpush(USERS_KEY, id)

  // Return user without password hash
  const { passwordHash: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function getUserById(id: string): Promise<Omit<User, "passwordHash"> | null> {
  const userData = await redis.get(`${USER_KEY_PREFIX}${id}`)

  if (!userData) return null

  const user = JSON.parse(userData as string) as User
  const { passwordHash: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const userId = await redis.get(`${USER_EMAIL_KEY_PREFIX}${email}`)

  if (!userId) return null

  const userData = await redis.get(`${USER_KEY_PREFIX}${userId}`)
  return userData ? JSON.parse(userData as string) : null
}

export async function validateUserCredentials(
  email: string,
  password: string,
): Promise<Omit<User, "passwordHash"> | null> {
  const user = await getUserByEmail(email)

  if (!user) return null

  const isPasswordValid = await compare(password, user.passwordHash)

  if (!isPasswordValid) return null

  const { passwordHash: _, ...userWithoutPassword } = user
  return userWithoutPassword
}
