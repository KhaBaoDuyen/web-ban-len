"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart, User, Check } from "lucide-react";
import { useEffect, useState } from "react";

import logo from "../../../../public/assets/logo-light.png";
import { HeaderData } from "./header.data";

// COMPONENT
import { Search } from "../../../components/UI/Search";
import { MainDropdown } from "../../../components/UI/MainDropdown/MainDropdown";
import { MobileMenuItem } from "../../../components/UI/Mobile/MobileMenuItem/MobileMenuItem";

export const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
      fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  const filteredNav = HeaderData.filter((item) => {
    const privatePaths = ["/quan-ly-san-pham", "/danh-sach-don-hang"];
    if (!user && privatePaths.includes(item.path)) {
      return false;
    }
    return true;
  });
  return (
    <>

      <header className="bg-primary-500 text-white shadow-xl">
        <div className="mx-auto flex lg:flex-col w-11/12 lg:w-10/12 items-center justify-between py-4">

          <div className="flex lg:hidden rounded-md bg-surface-100 items-center">
            <button
              className="text-primary p-1"
              onClick={() => setOpenMenu(!openMenu)}
            >
              {openMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <Link href="/" className="lg:w-1/12 w-4/12">
            <Image
              src={logo}
              alt="logo"
              priority
              className="w-full h-auto"
            />
          </Link>
          <Search />
          <nav className="hidden w-fit lg:flex my-1">
            <div className="flex mx-auto gap-4">
              {filteredNav.map((group, index) => (
                <MainDropdown
                  key={index}
                  title={group.title}
                  path={group.path}
                  categories={group.categories}
                  brands={group.brands}
                  popularSearches={group.popularSearches}
                />
              ))}
            </div>

            <div className="flex items-center border-l border-white/20 pl-6 ml-2">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-white bg-white/10 px-3 py-1.5 rounded-lg">
                    <User size={18} />
                    <span>{user.username}</span>
                  </div>
                </div>
              ) : (
                <Link
                  href="/dang-nhap"
                  className="flex items-center gap-1 font-bold hover:text-gray-200 text-white"
                >
                  <User size={20} />
                  <span>Đăng nhập</span>
                </Link>
              )}
            </div>
          </nav>

        </div>


        {openMenu && (
          <div className="lg:hidden border-t border-white/20 bg-primary-500 animate-in slide-in-from-top duration-300">
            {filteredNav.map((group, index) => (
              <MobileMenuItem
                key={index}
                title={group.title}
                path={group.path}
                items={group.categories}
                onCloseMenu={() => setOpenMenu(false)}
              />
            ))}

            {user ? (
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 text-white">
                <User size={18} />
                <span>{user.username}</span>
              </div>
            ) : (
              <Link
                href="/dang-nhap"
                className="flex items-center gap-2 px-5 py-3 border-b border-white/10 hover:bg-white/5 text-white"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
};
