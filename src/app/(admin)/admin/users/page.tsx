"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { timeAgo } from "@/lib/utils";

type UserRole = "super_admin" | "finance" | "moderator" | "support" | "analyst";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  listings: number;
  bids: number;
  joinedAt: string;
  suspended: boolean;
}

const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "super_admin", label: "Super Admin" },
  { value: "finance", label: "Finance" },
  { value: "moderator", label: "Moderator" },
  { value: "support", label: "Support" },
  { value: "analyst", label: "Analyst" },
];

const roleBadgeVariant = (role: UserRole) => {
  switch (role) {
    case "super_admin":
      return "saffron";
    case "finance":
      return "green";
    case "moderator":
      return "blue";
    case "support":
      return "default";
    case "analyst":
      return "outline";
    default:
      return "default";
  }
};

const roleLabel = (role: UserRole) => {
  return role
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load users");
        return res.json();
      })
      .then((data: { users: UserRecord[] }) => setUsers(data.users))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((user) => {
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  function handleSuspend(id: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, suspended: !u.suspended } : u
      )
    );
  }

  function handleChangeRole(id: string, newRole: UserRole) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#101114]">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage platform users and roles</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-3">
                <div className="animate-pulse h-16 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse h-12 bg-gray-200 rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#101114]">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage platform users and roles</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-red-500">{error}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#101114]">User Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage platform users and roles
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(["super_admin", "finance", "moderator", "support", "analyst"] as const).map(
          (role) => (
            <Card key={role}>
              <CardContent className="p-3 text-center">
                <Badge variant={roleBadgeVariant(role)} className="mb-1">
                  {roleLabel(role)}
                </Badge>
                <p className="text-lg font-bold text-[#101114]">
                  {users.filter((u) => u.role === role).length}
                </p>
              </CardContent>
            </Card>
          )
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-72"
        />
        <Select
          options={ROLE_OPTIONS}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="sm:w-48"
        />
      </div>

      {/* Users table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E6E4DF] bg-[#F8F7F3]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Role
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Listings
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Bids
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Joined
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E4DF]">
                {filtered.map((user) => (
                  <tr
                    key={user.id}
                    className={`transition-colors ${
                      user.suspended ? "opacity-50" : "hover:bg-[#F8F7F3]"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#F8F7F3] flex items-center justify-center text-xs font-semibold text-[#101114] border border-[#E6E4DF]">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-[#101114]">
                              {user.name}
                            </p>
                            {user.suspended && (
                              <Badge variant="error" className="text-[10px]">
                                Suspended
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge variant={roleBadgeVariant(user.role)}>
                        {roleLabel(user.role)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <span className="text-[#101114]">{user.listings}</span>
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <span className="text-[#101114]">{user.bids}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-gray-500">
                        {timeAgo(new Date(user.joinedAt))}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Select
                          options={[
                            { value: "super_admin", label: "Super Admin" },
                            { value: "finance", label: "Finance" },
                            { value: "moderator", label: "Moderator" },
                            { value: "support", label: "Support" },
                            { value: "analyst", label: "Analyst" },
                          ]}
                          value={user.role}
                          onChange={(e) =>
                            handleChangeRole(user.id, e.target.value as UserRole)
                          }
                          className="w-28 h-8 text-xs"
                        />
                        <Button
                          variant={user.suspended ? "outline" : "destructive"}
                          size="sm"
                          className="text-xs h-8"
                          onClick={() => handleSuspend(user.id)}
                        >
                          {user.suspended ? "Unsuspend" : "Suspend"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm text-gray-500">
                  No users match your search.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
