
import { Link } from "react-router-dom";

export function Footer() {
  const footerLinks = {
    about: [
      { label: "Our Story", href: "/our-story" },
      { label: "Affiliate Program", href: "/affiliate" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Sitemap", href: "/sitemap" },
    ],
    contact: [
      { label: "Email us here", href: "mailto:support@example.com" },
      { label: "Call: +44 0000 0000", href: "tel:+440000000" },
    ],
    whereToBuy: [
      { label: "Store Finder", href: "/store-finder" },
      { label: "Shop Online", href: "/shop" },
    ],
    shoppingHelp: [
      { label: "FAQs", href: "/faqs" },
      { label: "Delivery Information", href: "/delivery" },
      { label: "Click and Collect", href: "/click-and-collect" },
      { label: "Authentication Form", href: "/authentication" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
    socialMedia: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Facebook", href: "https://facebook.com" },
      { label: "Google", href: "https://google.com" },
      { label: "Youtube", href: "https://youtube.com" },
      { label: "TikTok", href: "https://tiktok.com" },
    ],
  };

  const paymentMethods = [
    { name: "Visa", src: "/visa.png" },
    { name: "PayPal", src: "/paypal.png" },
    { name: "Discover", src: "/discover.png" },
    { name: "Stripe", src: "/stripe.png" },
    { name: "Klarna", src: "/klarna.png" },
    { name: "Twinfone", src: "/twinfone.png" },
    { name: "Alipay", src: "/alipay.png" },
    { name: "American Express", src: "/amex.png" },
    { name: "NordDirekt", src: "/norddirekt.png" },
  ];

  return (
    <footer className="bg-white pt-16 pb-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-gray-600 hover:text-black">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              {footerLinks.contact.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-gray-600 hover:text-black">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Where to Buy</h3>
            <ul className="space-y-2">
              {footerLinks.whereToBuy.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-gray-600 hover:text-black">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Shopping Help</h3>
            <ul className="space-y-2">
              {footerLinks.shoppingHelp.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-gray-600 hover:text-black">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Nigelum Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-gray-600 hover:text-black">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Follow us</h3>
            <ul className="space-y-2">
              {footerLinks.socialMedia.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 pt-8 border-t">
          <div className="flex items-center space-x-4">
            <select className="text-sm border rounded-md px-2 py-1">
              <option>UNITED KINGDOM (GBP £)</option>
            </select>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {paymentMethods.map((method) => (
              <img
                key={method.name}
                src={method.src}
                alt={method.name}
                className="h-6 object-contain"
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Copyright © 2019-{new Date().getFullYear()} Nigelum
          </p>
        </div>
      </div>
    </footer>
  );
}
