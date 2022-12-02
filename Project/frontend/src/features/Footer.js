import React from "react";

const Footer = () => {
  return (
    <div id="footer">
      <div className="footer-element" id="footer-name">
        <p className="copyright">
          Copyright © {new Date().getFullYear()} Faris Durrani, Justin Zandstra,
          Lakshmisree Iyengar, Nemath Ahmed, RenChu Wang, Shuyan Lin
          <br />
          <a href="https://github.com/farisdurrani/sentiment-search">GitHub</a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
