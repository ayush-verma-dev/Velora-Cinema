import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">

        <div>
          <h2 className="logo-font text-2xl text-yellow-400">
            Velora Cinema
          </h2>
          <p className="text-gray-400 mt-2">
            Reserve your perfect movie experience.
          </p>
        </div>

        <div className="flex gap-5 text-xl text-gray-400">
          <FaFacebook className="hover:text-yellow-400 cursor-pointer"/>
          <FaInstagram className="hover:text-yellow-400 cursor-pointer"/>
          <FaXTwitter className="hover:text-yellow-400 cursor-pointer"/>
        </div>

      </div>
    </footer>
  );
}

export default Footer;