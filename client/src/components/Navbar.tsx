import { Link, useNavigate } from "react-router-dom";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  HandPlatter,
  Loader2,
  Menu,
  Moon,
  PackageCheck,
  ShoppingCart,
  SquareMenu,
  Sun,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

import { Separator } from "./ui/separator";
import { useUserStore } from "@/store/useUserStore";
import { useCartStore } from "@/store/useCartStore";
import { useThemeStore } from "@/store/useThemeStore";

const Navbar = () => {
  const { user, loading, logout } = useUserStore();
  const { cart } = useCartStore();
  const {setTheme}=useThemeStore();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between h-14 ">
        <Link to="/">
          <h1 className="font-bold md:font-extrabold text-2xl">AshishEats</h1>
        </Link>
        <div className="hidden md:flex justify-between gap-10">
          <div className="hidden md:flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
              <Link to="/">Home</Link>
              <Link to="/profile">Profile</Link>
              <Link to="/order/status">Order</Link>
            </div>
            {user?.admin && (
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger>Dashboard</MenubarTrigger>
                  <MenubarContent className="w-[20px]">
                    <Link to="/admin/restaurant">
                      <MenubarItem>Restaurant</MenubarItem>
                    </Link>
                    <Link to="/admin/menu">
                      <MenubarItem>Menu</MenubarItem>
                    </Link>
                    <Link to="/admin/orders">
                      <MenubarItem>Order</MenubarItem>
                    </Link>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            )}
          </div>
          <div className="hidden md:flex items-center justify-center gap-4">
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={()=>setTheme('light')}>Light</DropdownMenuItem>
                  <DropdownMenuItem onClick={()=>setTheme('dark')}>Dark</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Link to="/cart" className="relative cursor-pointer">
              <ShoppingCart />
              {cart.length > 0 && (
                <Button
                  size={"icon"}
                  className="absolute h-4 w-4 text-xs rounded-full -inset-y-3 left-4 bg-red-500"
                >
                  {cart.length}
                </Button>
              )}
            </Link>
            <div>
              <Avatar>
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <Button
                onClick={logout}
                disabled={loading}
                className="bg-[#D19254] hover:bg-[#d18c47]"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" />
                    <span>Please wait</span>
                  </div>
                ) : (
                  "Logout"
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="md:hidden lg:hidden ">
          <MobileNavbar />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = () => {
  const {setTheme}=useThemeStore();
  const { user, logout, loading } = useUserStore();
  const {cart}=useCartStore();
  const navigate=useNavigate();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size={"icon"}
          className="rounded-full bg-gray-200 text-black hover:bg-gray-300"
          variant="outline"
        >
          <Menu size={"18"} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col p-4">
        <SheetHeader className="flex flex-row items-center justify-between mt-4">
          <SheetTitle><div className="cursor-pointer font-bold text-xl" onClick={()=>navigate("/")}>AshishEats</div></SheetTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={()=>setTheme('light')}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={()=>setTheme('dark')}>Dark</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SheetHeader>
        <Separator />
        <SheetDescription>
          <Link
            to="/profile"
            className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-200 cursor-pointer hover:text-gray-900 font-medium"
          >
            <User />
            <span>Profile</span>
          </Link>
          <Link
            to="/order/status"
            className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-200 cursor-pointer hover:text-gray-900 font-medium"
          >
            <HandPlatter />
            <span>Order</span>
          </Link>
          <Link
            to="/cart"
            className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-200 cursor-pointer hover:text-gray-900 font-medium"
          >
            <ShoppingCart />
            <span>Cart({cart.length})</span>
          </Link>
          {user?.admin && (
            <>
              <Link
                to="/admin/menu"
                className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-200 cursor-pointer hover:text-gray-900 font-medium"
              >
                <SquareMenu />
                <span>Menu</span>
              </Link>
              <Link
                to="/admin/restaurant"
                className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-200 cursor-pointer hover:text-gray-900 font-medium"
              >
                <UtensilsCrossed />
                <span>Restaurant</span>
              </Link>
              <Link
                to="/admin/orders"
                className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-200 cursor-pointer hover:text-gray-900 font-medium"
              >
                <PackageCheck />
                <span>Restaurant Orders</span>
              </Link>
            </>
          )}
        </SheetDescription>
        <SheetFooter>
          <div className="flex flex-row items-center gap-2">
            <Avatar>
              <AvatarImage src={user?.profilePicture}/>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className="font-bold">Ashish Mernstack</h1>
          </div>
          <SheetClose asChild>
            {}
            <Button
              onClick={logout}
              type="submit"
              className="bg-[#D19254] hover:bg-[#d18c47] w-full"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" />
                  <span>Please wait</span>
                </div>
              ) : (
                "Logout"
              )}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
