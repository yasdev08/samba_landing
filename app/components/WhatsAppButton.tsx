"use client"

import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"

export default function WhatsAppButton() {
  const phoneNumber = "213794120959" // Replace with actual WhatsApp business number
  const message = encodeURIComponent("Bonjour, je suis intéressé(e) par la Adidas Samba OG Femme.")

  return (
    <motion.a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#20BA5A] transition-colors"
      aria-label="Contacter sur WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </motion.a>
  )
}
