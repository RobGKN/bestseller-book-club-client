// src/components/layout/Footer.jsx

const Footer = () => {
    return (
      <footer className="bg-primary-700 text-white mt-12">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="mb-2 md:mb-0">&copy; {new Date().getFullYear()} BestsellerBookClub. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary-200">About</a>
            <a href="#" className="hover:text-primary-200">Privacy</a>
            <a href="#" className="hover:text-primary-200">Contact</a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;