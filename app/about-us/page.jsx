// app/about-us/page.jsx

import Link from "next/link";
import FloatingContact from "@/ui/floatingcontact";

export default function AboutUs() {
  const founders = [
    { name: "Anyalechi Chidiebere", role: "lead project", whatsapp: "+233556522861" },
    { name: "George", role: "team member", whatsapp: "+2348065104250" },
    { name: "Onyekachim Miracle", role: "team member", whatsapp: "+2347043830600" },
    { name: "Akpan Micheal", role: "team member", whatsapp: "+23470397313987" },
    { name: "David Whitten", role: "team member", whatsapp: "+18327778399" },
  ];

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* About Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-indigo-700 mb-4">About Handcraft Heaven</h1>
        <p className="text-gray-700 text-lg">
          Handcraft Heaven connects artisans to lovers of handmade products. Our mission is to bring authenticity, creativity, and care to every piece we offer.
        </p>
      </section>

      {/* Founders Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Meet the Pioneers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {founders.map((f, i) => (
            <div key={i} className="p-6 bg-white shadow-lg rounded-xl text-center hover:shadow-xl transition">
              <h3 className="text-xl font-bold text-indigo-600">{f.name}</h3>
              <p className="text-gray-600 mb-2">{f.role}</p>
              <a
                href={`https://wa.me/${f.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 font-medium hover:underline"
              >
                WhatsApp
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Map Section */}
      <section className="mb-16">
  <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">Our Location</h2>
  <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.9139764675474!2d-0.1910555250146714!3d5.579734094400875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9a61b3e29cc9%3A0x807dc2012dc1bae1!2sThe%20Flagstaff%20House%2C%20Accra!5e0!3m2!1sen!2sgh!4v1764950568302!5m2!1sen!2sgh"
      className="w-full h-full border-0"
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</section>

      <FloatingContact />
    </main>
  );
}
