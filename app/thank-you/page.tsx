"use client"

import { motion } from "framer-motion"
import { Check, Package, Phone } from "lucide-react"
import Link from "next/link"

export default function ThankYou() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-card rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-border text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Check className="w-10 h-10 text-white" />
        </motion.div>

        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Commande Confirmée !</h1>

        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          Merci pour votre commande ! Notre équipe va vous contacter dans les prochaines heures pour confirmer les
          détails.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-muted/50 rounded-2xl border border-border">
            <Package className="w-8 h-8 text-secondary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Livraison</h3>
            <p className="text-sm text-muted-foreground">Votre commande sera livrée dans 2-5 jours ouvrables</p>
          </div>
          <div className="p-6 bg-muted/50 rounded-2xl border border-border">
            <Phone className="w-8 h-8 text-secondary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Confirmation</h3>
            <p className="text-sm text-muted-foreground">Nous vous appellerons pour confirmer votre commande</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/speedcat"
            className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
          <a
            href="https://wa.me/213794120959"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
          >
            Contacter sur WhatsApp
          </a>
        </div>
      </motion.div>
    </main>
  )
}
