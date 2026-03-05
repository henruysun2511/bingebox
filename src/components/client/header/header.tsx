"use client";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Shadcn Components
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLogout } from "@/queries/useAuthQuery";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

const menuItems = [
  {
    title: "Lịch chiếu",
    href: "/showtime",
    children: [
      { title: "Theo phim", href: "/showtime/movie" },
      { title: "Theo rạp", href: "/showtime/cinema" },
    ]
  },
  { title: "Tin tức", href: "/blog" },
  { title: "Giá vé", href: "/price" },
  { title: "Diễn viên", href: "/actor" },
  { title: "Bàn luận điện ảnh", href: "/comment" },
  { title: "Về chúng tôi", href: "/aboutUs" },
];

export default function Header({ logo }: { logo: string }) {
  const router = useRouter();

  //Lấy thông tin user và trạng thái từ store
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  //Sử dụng hook logout từ react-query
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.push("/");
      router.refresh();
      toast.success("Đã đăng xuất");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Tránh lỗi Hydration mismatch: chỉ render phần login/logout sau khi store đã rehydrate
  const renderAuthButtons = (isMobile = false) => {
    if (!isHydrated) return null;

    const containerClass = isMobile ? "flex flex-col gap-3 pt-4 border-t border-white/20" : "flex items-center gap-3";
    const buttonClass = isMobile ? "w-full rounded-full" : "rounded-full px-6 transition-all hover:scale-105";

    if (user) {
      return (
        <div className={containerClass}>
          <Button asChild className={`${buttonClass} bg-gradient-to-r from-[#5de0e6] to-[#004aad] cursor-pointer`}>
            <Link href="/profile">Xin chào, {user.username}</Link>
          </Button>
          <Button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className={`${buttonClass} bg-gradient-to-r from-[#ff5757] to-[#8c52ff] cursor-pointer`}
          >
            {logoutMutation.isPending ? "Đang thoát..." : "Đăng xuất"}
          </Button>
        </div>
      );
    }

    return (
      <div className={containerClass}>
        <Button asChild className={`${buttonClass} bg-gradient-to-r from-[#5de0e6] to-[#004aad] hover:from-[#ff5757] hover:to-[#8c52ff] cursor-pointer`}>
          <Link href="/auth/login">Đăng nhập</Link>
        </Button>
        <Button asChild className={`${buttonClass} bg-gradient-to-r from-[#ff5757] to-[#8c52ff] hover:from-[#5de0e6] hover:to-[#004aad] cursor-pointer`}>
          <Link href="/auth/register">Đăng ký</Link>
        </Button>
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 w-full !z-[20] bg-blue shadow-[0_3px_3px_rgba(0,0,0,0.1)] px-4 md:px-[50px]">
      <div className="flex items-center justify-between h-20 max-w-7xl mx-auto">

        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src={logo || "https://henruysun2511.github.io/BingeBox_Project/assets/images/bingebox_logo.png"}
            alt="BingeBox Logo"
            className="w-auto h-16 md:h-20"
          />
          <p className="text-white font-bold leading-tight uppercase tracking-wider text-sm md:text-base">
            BINGEBOX <br /> CINEMA
          </p>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:block">
          <NavigationMenuList>
            {menuItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                {item.children ? (
                  <>
                    <NavigationMenuTrigger className="bg-transparent text-white hover:bg-blue-700 h-20 px-4 rounded-none">
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-blue border-none">
                      <ul className="grid w-[200px] gap-2 p-4">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={child.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-700 hover:text-white text-white"
                              >
                                {child.title}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className="group inline-flex h-20 w-max items-center justify-center bg-transparent px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:bg-blue-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    >
                      {item.title}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop Buttons */}
        <div className="hidden lg:block">
          {renderAuthButtons(false)}
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="text-white p-0 hover:bg-transparent">
                <Menu className="h-8 w-8" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="bg-[#2e4ba6] border-none text-white">
              <SheetHeader>
                <SheetTitle className="text-white text-left">MENU</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                <ul className="flex flex-col gap-2">
                  {menuItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block py-3 px-4 hover:bg-blue-700 rounded-md transition-colors"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                {renderAuthButtons(true)}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}