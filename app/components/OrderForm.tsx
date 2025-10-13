"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Product {
  name: string;
  price: number;
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function OrderForm({ product }: { product: Product }) {
  const router = useRouter();
  const [form, setForm] = useState({
    product: product?.name || "",
    name: "",
    phone: "",
    wilaya: "",
    baladiya: "",
    pointure: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.phone ||
      !form.wilaya ||
      !form.baladiya ||
      !form.pointure
    ) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, product }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        if (typeof window !== "undefined" && typeof window.fbq === "function") {
          window.fbq("track", "Purchase", {
            value: product.price,
            currency: "DZD",
            content_name: product.name,
          });
        }
        setSubmitted(true);
        setTimeout(() => router.push("/thank-you"), 2000);
      } else {
        alert("Erreur lors de l'envoi — réessayez.");
      }
    } catch (err) {
      setIsSubmitting(false);
      alert("Erreur réseau — réessayez.");
      console.error(err);
    }
  };

  const wilayas = [
    "Adrar",
    "Chlef",
    "Laghouat",
    "Oum El Bouaghi",
    "Batna",
    "Béjaïa",
    "Biskra",
    "Béchar",
    "Blida",
    "Bouira",
    "Tamanrasset",
    "Tébessa",
    "Tlemcen",
    "Tiaret",
    "Tizi Ouzou",
    "Alger",
    "Djelfa",
    "Jijel",
    "Sétif",
    "Saïda",
    "Skikda",
    "Sidi Bel Abbès",
    "Annaba",
    "Guelma",
    "Constantine",
    "Médéa",
    "Mostaganem",
    "M'Sila",
    "Mascara",
    "Ouargla",
    "Oran",
    "El Bayadh",
    "Illizi",
    "Bordj Bou Arréridj",
    "Boumerdès",
    "El Tarf",
    "Tindouf",
    "Tissemsilt",
    "El Oued",
    "Khenchela",
    "Souk Ahras",
    "Tipaza",
    "Mila",
    "Aïn Defla",
    "Naâma",
    "Aïn Témouchent",
    "Ghardaïa",
    "Relizane",
    "Timimoun",
    "Bordj Badji Mokhtar",
    "Ouled Djellal",
    "Béni Abbès",
    "In Salah",
    "In Guezzam",
    "Touggourt",
    "Djanet",
    "El M'Ghair",
    "El Meniaa",
  ];

  const sizes = ["36", "37", "38", "39", "40", "41", "42"];

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 sm:p-8 bg-cream rounded-2xl border border-tan/20 text-center shadow-xl"
      >
        <div className="w-16 h-16 bg-tan/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-tan"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="font-serif text-2xl font-bold mb-2">
          Commande Confirmée !
        </h3>
        <p className="text-gray-600">
          Merci pour votre commande. Nous vous contacterons bientôt pour
          confirmer les détails de livraison.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className="p-6 sm:p-8 bg-cream rounded-2xl border border-tan/20 shadow-xl"
    >
      <div className="space-y-4 sm:space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold mb-2">
            Nom complet *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-tan/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-tan transition-all"
            placeholder="Votre nom complet"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold mb-2">
            Numéro de téléphone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            pattern="^0[5-7][0-9]{8}$"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-tan/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-tan transition-all"
            placeholder="0555 12 34 56"
          />
        </div>
        <div>
          <input
            type="text"
            name="honeypot"
            className="hidden"
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor="wilaya" className="block text-sm font-semibold mb-2">
            Wilaya *
          </label>
          <select
            id="wilaya"
            name="wilaya"
            required
            value={form.wilaya}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-tan/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-tan transition-all"
          >
            <option value="">Sélectionnez votre wilaya</option>
            {wilayas.map((wilaya) => (
              <option key={wilaya} value={wilaya}>
                {wilaya}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="baladiya"
            className="block text-sm font-semibold mb-2"
          >
            Adresse complète *
          </label>
          <textarea
            id="baladiya"
            name="baladiya"
            required
            value={form.baladiya}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 bg-white border border-tan/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-tan transition-all resize-none"
            placeholder="Rue, quartier, commune..."
          />
        </div>

        <div>
          <label
            htmlFor="pointure"
            className="block text-sm font-semibold mb-2"
          >
            Pointure *
          </label>
          <select
            id="pointure"
            name="pointure"
            required
            value={form.pointure}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-tan/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-tan transition-all"
          >
            <option value="">Sélectionnez votre pointure</option>
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-8 py-3 sm:py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Envoi en cours...</span>
              </>
            ) : (
              <span>
                Confirmer la commande — <>{product.price}</> DZD
              </span>
            )}
          </button>
          <p className="text-xs text-gray-600 text-center mt-3">
            En commandant, vous acceptez nos conditions de vente. Paiement à la
            livraison.
          </p>
        </div>
      </div>
    </motion.form>
  );
}
