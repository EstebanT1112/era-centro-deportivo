"use client"

import Link from "next/link"
import { ChevronDownIcon, LogOutIcon, UserRoundIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockAdminUser } from "@/config/admin-navigation"

function AdminUserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" className="h-10 gap-2 px-2" aria-label="Abrir menú de usuario" />}
      >
        <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">AD</span>
        <span className="hidden min-w-0 text-left sm:flex sm:flex-col">
          <span className="max-w-36 truncate text-sm font-medium leading-tight">{mockAdminUser.name}</span>
          <span className="max-w-36 truncate text-xs font-normal text-muted-foreground">{mockAdminUser.role}</span>
        </span>
        <ChevronDownIcon aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <span className="flex flex-col gap-0.5">
              <span className="text-sm text-foreground">{mockAdminUser.name}</span>
              <span className="truncate font-normal">{mockAdminUser.email}</span>
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            <UserRoundIcon aria-hidden="true" />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/admin/login" />}>
            <LogOutIcon aria-hidden="true" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { AdminUserMenu }
