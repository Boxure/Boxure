// import * as React from "react"
import React, { useState, useEffect } from 'react';
import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    fetch('http://localhost:5000/api/user/me', { credentials: "include" })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setLoggedIn(!!data.user))
      .catch(() => setLoggedIn(false));
  }, []);



  return (
    <div className="flex flex-row items-center justify-between p-2">
      <h1 className="text-2xl font-bold">Boxure</h1>
      <NavigationMenu className="w-full mr-2">
        <NavigationMenuList className="gap-1 items-end">
          <NavigationMenuItem>
            <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/market" className={navigationMenuTriggerStyle()}>
              Marketplace
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/login" className={navigationMenuTriggerStyle()}>
              Login
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/register" className={navigationMenuTriggerStyle()}>
              Register
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            {loggedIn ? (
              <NavigationMenuLink href="/logout" className={navigationMenuTriggerStyle()}>
                Logout
              </NavigationMenuLink>
            ) : null}
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/shopping-bag" className={navigationMenuTriggerStyle()}>
              <img src="/icons/shopping-cart.svg" alt="Shopping Bag" className="h-6 w-6" />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src="" alt="User Avatar" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            {/*Not  implemented yet, because profile href does not exist */}
            {/* <NavigationMenuLink href="/profile" className={navigationMenuTriggerStyle()}>
              Profile
            </NavigationMenuLink> */}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
