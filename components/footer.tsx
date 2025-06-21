import Link from "next/link"
import { Github, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="dark:bg-neutral-950 bg-white/50 border-t text-white py-8 mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold dark:text-gray-300 text-gray-900">CarX</h3>
            <p className="dark:text-gray-300 text-gray-900 text-sm">
              Professional car wash management system with real-time tracking and advanced service management.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 dark:text-gray-300 text-gray-900">
            <h4 className="text-lg font-semibold ">Contact Information</h4>
            <div className="space-y-2 text-sm dark:text-gray-300 text-gray-900">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>nibenjamin2020@gmai.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span><a href="tel:+250780925937">+250 780 925 937</a></span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Kigali, Rwanda</span>
              </div>
            </div>
          </div>

          {/* Developer & Social Links */}
          <div className="space-y-4 ">
            <h4 className="text-lg font-semibold">Developer</h4>
            <p className="dark:text-gray-300 text-gray-900 text-sm">
              Developed by <span className="font-semibold dark:text-white text-gray-900">Ngoma Benjamin</span>
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://github.com/ngoma301"
                target="_blank"
                rel="noopener noreferrer"
                className="dark:text-gray-300 text-gray-900 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://instagram.com/ngoma.301"
                target="_blank"
                rel="noopener noreferrer"
                className="dark:text-gray-300 text-gray-900 hover:text-pink-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/ngoma-benjamin-408483336/"
                target="_blank"
                rel="noopener noreferrer"
                className="dark:text-gray-300 text-gray-900 hover:text-blue-400 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="mailto:nibenjamin2020@gmail.com"
                className="dark:text-gray-300 text-gray-900 hover:text-green-400 transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t dark:border-gray-800 border-neutral-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm dark:text-gray-400 text-gray-800">© {new Date().getFullYear()} CarX. All rights reserved.</p>
            <p className="text-sm dark:text-gray-400 text-gray-800">
              Made with ❤️ by <span className="dark:text-white text-gray-950 font-medium">Ngoma Benjamin</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
