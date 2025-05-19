"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import "./Navbar.css";

export default function Navbar() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991) {
        setIsMobileNavOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <nav className="desktopNav">
        <ul>
          <li>
            <Link href="/">Apartments</Link>
          </li>
      
          <li>
            <Link href="/addApartment">Add New</Link>
          </li>
        </ul>
      </nav>

      <button 
        className="iconMobile"
        onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
        aria-label="Toggle menu"
      >
        <i className={`fa-solid ${isMobileNavOpen ? "fa-xmark" : "fa-bars"}`} />
      </button>

      {/* Mobile Nav */}
      <nav className={`mobileNav ${isMobileNavOpen ? "mobileNavShow" : "mobileNavHide"}`}>
        <ul>
          <li>
            <Link href="/" onClick={() => setIsMobileNavOpen(false)}>
              Apartments
            </Link>
          </li>
       
          <li>
            <Link href="/addApartment" onClick={() => setIsMobileNavOpen(false)}>
              Add New
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}