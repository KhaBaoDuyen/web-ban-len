"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart, User, Check } from "lucide-react";
import { useState } from "react";

import logo from "../../../../public/assets/logo-light.png";
import { HeaderData } from "./header.data";

// COMPONENT
import { Search } from "../../../components/UI/Search";
import { MainDropdown } from "../../../components/UI/MainDropdown/MainDropdown";
import { MobileMenuItem } from "../../../components/UI/Mobile/MobileMenuItem/MobileMenuItem";

export const Header = () => {
  const cartCount = 3;
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>

      <header className="bg-primary-500 text-white">
        <div className="mx-auto flex w-11/12 lg:w-10/12 items-end justify-between ">

          <div className="flex lg:hidden rounded-md bg-surface-100 items-center">
            <button
              className="text-primary p-1"
              onClick={() => setOpenMenu(!openMenu)}
            >
              {openMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <Link href="/" className="lg:w-2/12 w-4/12">
            <Image
              src={logo}
              alt="logo"
              priority
              className="w-full h-auto"
            />
          </Link>

           <nav className="hidden w-fit  lg:flex  ">
            <div className="flex  mx-auto ">
              {HeaderData.map((group, index) => (
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
            <Link
              href="/login"
              className="hidden lg:flex items-center gap-1 font-bold hover:text-red-400"
            >
              | <User size={20} />
              <span>Đăng nhập</span>
            </Link>
          </nav>
        </div>


        {openMenu && (
          <div className="lg:hidden border-t border-white/20 bg-primary-500 animate-in slide-in-from-top   duration-300">
            {HeaderData.map((group, index) => (
              <MobileMenuItem
                key={index}
                title={group.title}
                path={group.path}
                items={group.categories}
                onCloseMenu={() => setOpenMenu(false)}
              />
            ))}

            <Link
              href="/cart"
              className="flex items-center gap-2 px-5 py-3 border-b border-white/10 hover:bg-white/5"
            >
              Giỏ hàng ({cartCount})
            </Link>

            <Link
              href="/login"
              className="flex items-center gap-2 px-5 py-3 border-b border-white/10 hover:bg-white/5"
            >
              Đăng nhập
            </Link>
          </div>
        )}
      </header>
    </>
  );
};
