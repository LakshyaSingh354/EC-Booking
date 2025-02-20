// components/Footer.tsx
const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} Epitome Consulting. All Rights Reserved.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  