import React from "react";

const Footer = () => (
  <footer className="border-t border-teal-800 bg-teal-900 py-5">
    <div className="mx-auto max-w-7xl px-6 text-center text-sm text-teal-100">
      © <span style={{ fontFamily: "auto" }}> {new Date().getFullYear()} </span>{" "}
      TalentHub. All rights reserved.
    </div>
  </footer>
);

export default Footer;
