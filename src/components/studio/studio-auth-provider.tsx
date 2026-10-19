"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ALL_STUDIO_PERMISSIONS, DEFAULT_STUDIO_USERS, permissionsFor, type StudioPermission, type StudioUser } from "@/lib/studio/auth";

const AUTH_KEY = "tcc-demo-studio-auth-v1";
const USERS_KEY = "tcc-demo-studio-users-v1";

interface StudioAuthContextValue {
  hydrated: boolean;
  user: StudioUser | null;
  users: StudioUser[];
  permissions: StudioPermission[];
  login: (username: string, password: string) => { ok: boolean; message: string };
  logout: () => void;
  has: (permission: StudioPermission) => boolean;
  updateUserPermissions: (userId: string, permissions: StudioPermission[]) => void;
  updateUser: (userId: string, patch: Partial<StudioUser>) => void;
  addUser: (user: StudioUser) => void;
}

const Context = createContext<StudioAuthContextValue | null>(null);

function readUsers() {
  try { const raw = window.localStorage.getItem(USERS_KEY); if (raw) return JSON.parse(raw) as StudioUser[]; } catch {}
  return DEFAULT_STUDIO_USERS;
}

export function StudioAuthProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [users, setUsers] = useState<StudioUser[]>(DEFAULT_STUDIO_USERS);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const nextUsers = readUsers();
    setUsers(nextUsers);
    try { setUserId(window.localStorage.getItem(AUTH_KEY)); } catch {}
    setHydrated(true);
  }, []);

  const user = users.find((item) => item.id === userId && item.active) ?? null;
  const permissions = user ? permissionsFor(user) : [];

  const login = useCallback((username: string, password: string) => {
    const match = users.find((item) => item.active && item.username.toLowerCase() === username.trim().toLowerCase() && item.password === password);
    if (!match) return { ok: false, message: "Username or password is incorrect." };
    setUserId(match.id);
    try { window.localStorage.setItem(AUTH_KEY, match.id); } catch {}
    return { ok: true, message: "Signed in." };
  }, [users]);

  const logout = useCallback(() => { setUserId(null); try { window.localStorage.removeItem(AUTH_KEY); } catch {} }, []);
  const has = useCallback((permission: StudioPermission) => permissions.includes(permission), [permissions]);
  const updateUserPermissions = useCallback((targetId: string, nextPermissions: StudioPermission[]) => {
    setUsers((current) => {
      const next = current.map((item) => item.id === targetId ? { ...item, permissionOverrides: ALL_STUDIO_PERMISSIONS.filter((permission) => nextPermissions.includes(permission)) } : item);
      try { window.localStorage.setItem(USERS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);


  const updateUser = useCallback((targetId: string, patch: Partial<StudioUser>) => {
    setUsers((current) => {
      const next = current.map((item) => item.id === targetId ? { ...item, ...patch } : item);
      try { window.localStorage.setItem(USERS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);
  const addUser = useCallback((nextUser: StudioUser) => {
    setUsers((current) => {
      const next = [...current, nextUser];
      try { window.localStorage.setItem(USERS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const value = useMemo(() => ({ hydrated, user, users, permissions, login, logout, has, updateUserPermissions, updateUser, addUser }), [hydrated, user, users, permissions, login, logout, has, updateUserPermissions, updateUser, addUser]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useStudioAuth() {
  const value = useContext(Context);
  if (!value) throw new Error("useStudioAuth must be used inside StudioAuthProvider");
  return value;
}
