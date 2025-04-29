import React from "react";

const Footer = () => {
  return (
    <footer style={{
      textAlign: "center",
      padding: "1rem",
      fontSize: "14px",
      color: "#555",
      borderTop: "1px solid #eee",
      marginTop: "auto"
    }}>
      © {new Date().getFullYear()} Made by <strong>@anshuljaiswal</strong>
    </footer>
  );
};

export default Footer;
