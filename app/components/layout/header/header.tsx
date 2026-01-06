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

      <header className=" fixed top-0 left-0 w-full z-50 bg-primary-500 text-white flex flex-col justify-center items-start shadow-xl">
        <div className="mx-auto flex  w-11/12 lg:w-10/12 items-center justify-between lg:py-4">
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

          <div className="flex hidden lg:block items-center border-l border-white/20 pl-6 ml-2">
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
        </div>
        <hr className="h-[0.5px] w-full hidden lg:block bg-gray-200/60" />
        <nav className="hidden w-full mx-auto bg-primary-700    lg:flex my-1">
          <div className="flex lg:w-10/12 mx-auto gap-4">
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

        </nav>


      </header>
      {openMenu && (
        <div className="fixed inset-0 z-[100] w-full h-full bg-primary-600 flex flex-col animate-in fade-in duration-300">

          <div className="flex justify-end p-6">
            <button
              onClick={() => setOpenMenu(false)}
              className="p-3 text-gray-400 hover:text-white transition-all"
            >
              <X size={32} />
            </button>
          </div>

          <div className="flex-1 flex flex-col   overflow-y-auto">
            <div className="w-full max-w-2xl text-center space-y-10 animate-in slide-in-from-bottom-5 duration-500">
              <nav className="flex flex-col gap-8">
                {filteredNav.map((group, index) => (
                  <div key={index} className="group">
                    <MobileMenuItem
                      title={group.title}
                      path={group.path}
                      items={group.categories}
                      onCloseMenu={() => setOpenMenu(false)}
                    />
                  </div>
                ))}
              </nav>

              <div className="flex flex-col items-center gap-6">
                {user ? (
                  <div className="flex items-center gap-3 text-gray-300 text-lg uppercase tracking-widest">
                    <User size={20} />
                    <span>{user.username}</span>
                  </div>
                ) : (
                  <Link
                    href="/dang-nhap"
                    onClick={() => setOpenMenu(false)}
                    className="text-xl text-gray-400 hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Đăng nhập
                  </Link>
                )}
              </div>
            </div>
          </div>

          
        </div>
      )}
    </>
  );
};
