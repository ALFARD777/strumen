import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { useAuthStore } from "@/components/store/auth";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;

  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: number, email: string): string {
  const secret = process.env.JWT_SECRET || "fallback-secret";

  return jwt.sign({ userId, email }, secret, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    const secret = process.env.JWT_SECRET || "fallback-secret";

    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}

// biome-ignore lint/suspicious/noExplicitAny: <no explanation>
export function saveSession(token: string, user: any) {
  if (typeof window !== "undefined") {
    const { login } = useAuthStore.getState();

    login(token, user);
  }
}

export async function getSession() {
  if (typeof window !== "undefined") {
    const { token, user, isLoggedIn } = useAuthStore.getState();

    if (token && user && isLoggedIn) {
      try {
        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const { setUser } = useAuthStore.getState();

          setUser(data.user);

          return {
            token,
            user: data.user,
            isValid: true,
          };
        } else {
          clearSession();

          return null;
        }
      } catch {
        const decoded = verifyToken(token);

        if (decoded) {
          return {
            token,
            user,
            isValid: true,
          };
        }
        clearSession();

        return null;
      }
    }
  }

  return null;
}

export function clearSession() {
  if (typeof window !== "undefined") {
    const { logout } = useAuthStore.getState();

    logout();
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();

  return session?.isValid || false;
}
