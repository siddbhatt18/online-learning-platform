import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white shadow-inner py-6 mt-auto">
      <div className="container mx-auto px-6 text-center text-secondary">
        © {new Date().getFullYear()} LearnSphere. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;