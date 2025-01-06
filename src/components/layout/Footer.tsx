import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm">
              CUET Hall Management System provides comprehensive digital solutions 
              for efficient administration of student residences.
            </p>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin size={18} />
                <span className="text-sm">CUET, Chittagong-4331, Bangladesh</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} />
                <span className="text-sm">+880-31-XXXXXXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} />
                <span className="text-sm">hallmanagement@cu.ac.bd</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe size={18} />
                <a href="https://www.cu.ac.bd" className="text-sm hover:text-indigo-400 transition-colors duration-200">
                  www.cuet.ac.bd
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-indigo-400 transition-colors duration-200">
                  Notice Board
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-indigo-400 transition-colors duration-200">
                  Rules & Regulations
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-indigo-400 transition-colors duration-200">
                  Emergency Contacts
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-indigo-400 transition-colors duration-200">
                <Facebook size={24} />
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors duration-200">
                <Twitter size={24} />
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors duration-200">
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © {new Date().getFullYear()} CUET Hall Management System. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <a href="#" className="text-sm hover:text-indigo-400 transition-colors duration-200">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:text-indigo-400 transition-colors duration-200">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:text-indigo-400 transition-colors duration-200">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;