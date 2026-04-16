import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuth } from "../useAuth";

// Supabase クライアントをモック
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi
        .fn()
        .mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
  })),
}));

describe("useAuth", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("初期状態では未認証", () => {
    const { isAuthenticated } = useAuth();
    expect(isAuthenticated.value).toBe(false);
  });

  it("user が null の場合は未認証", () => {
    const { user, isAuthenticated } = useAuth();
    expect(user.value).toBeNull();
    expect(isAuthenticated.value).toBe(false);
  });
});
