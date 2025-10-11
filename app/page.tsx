"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useState, useEffect } from "react"
import OrderForm from "./components/OrderForm"
import WhatsAppButton from "./components/WhatsAppButton"
import { Check, Shield, Truck, Clock, Star, Package, Award, Users } from "lucide-react"

const images = ["/pic.jpg", "/pic1.jpg", "/pic2.jpg"]

export default function Home() {
  const [current, setCurrent] = useState(0)
  const [countdown, setCountdown] = useState<number>(0)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200])

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % images.length), 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const midnight = new Date()
      midnight.setHours(23, 59, 59, 999)
      const diff = Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000))
      setCountdown(diff)
    }
    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatCountdown = (sec: number) => {
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="font-serif font-bold text-xl sm:text-2xl tracking-tight">Chaussura</div>
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-secondary transition-colors">
              Caractéristiques
            </a>
            <a href="#gallery" className="hover:text-secondary transition-colors">
              Galerie
            </a>
            <a href="#reviews" className="hover:text-secondary transition-colors">
              Avis
            </a>
            <a
              href="#order"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Commander
            </a>
          </nav>
        </div>
      </header>

      <section className="px-4 sm:px-6 py-12 md:py-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-12 mb-12 pb-8 border-b border-border"
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-secondary flex-shrink-0" />
            <span className="font-medium">+500 clientes satisfaites</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-secondary flex-shrink-0" />
            <span className="font-medium">100% Authentique</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-secondary flex-shrink-0" />
            <span className="font-medium">Livraison 2-5 jours</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.div
              style={{ opacity }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full text-xs sm:text-sm font-medium mb-6"
            >
              <Clock className="w-4 h-4 text-secondary flex-shrink-0" />
              <span className="text-secondary font-semibold">
                Offre limitée — Expire dans {formatCountdown(countdown)}
              </span>
            </motion.div>

            <h1 className="font-serif font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-balance mb-6">
              Adidas Samba OG
              <span className="block text-secondary mt-2">Femme</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-light mb-8 text-pretty leading-relaxed">
              L&apos;élégance rétro rencontre le confort moderne. Une icône intemporelle pour votre style quotidien.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-8 p-4 sm:p-6 bg-muted/50 rounded-2xl border border-border">
              <div className="flex items-baseline gap-2 sm:gap-3">
                <span className="text-4xl sm:text-5xl font-bold">5900</span>
                <span className="text-xl sm:text-2xl font-semibold text-muted-foreground">DZD</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg text-muted-foreground line-through">7500 DZD</span>
                <span className="px-3 py-1 bg-secondary text-white rounded-full text-xs sm:text-sm font-bold">
                  Économisez 1600 DZD
                </span>
              </div>
            </div>

            <ul className="space-y-4 mb-10">
              {[
                "Design iconique Adidas Samba",
                "Confort supérieur pour un port quotidien",
                "Livraison rapide 2-5 jours ouvrables",
                "Paiement sécurisé à la livraison",
              ].map((feature, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-foreground font-medium">{feature}</span>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <motion.a
                href="#order"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg text-center hover:bg-primary/90 transition-colors shadow-lg"
              >
                Commander Maintenant
              </motion.a>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">Satisfait ou remboursé</div>
                  <div className="text-xs text-muted-foreground">Garantie 14 jours</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">Livraison 58 wilayas</div>
                  <div className="text-xs text-muted-foreground">Suivi en temps réel</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{ y: heroY }}
            className="relative"
          >
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl bg-card border-4 border-border">
              {images.map((src, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{
                    opacity: i === current ? 1 : 0,
                    scale: i === current ? 1 : 1.1,
                  }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={src || "/placeholder.svg"}
                    alt={`Adidas Samba ${i + 1}`}
                    fill
                    className="object-cover"
                    priority={i === 0}
                  />
                </motion.div>
              ))}

              <div className="absolute top-6 left-6 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <span className="font-bold text-sm">4.9/5</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6 gap-3">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    i === current ? "w-10 bg-secondary" : "w-2.5 bg-border hover:bg-border/60"
                  }`}
                  aria-label={`Voir image ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4 text-balance">Pourquoi choisir la Samba ?</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Une sneaker légendaire qui allie style intemporel et performance exceptionnelle
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Design Intemporel",
                desc: "Un look iconique qui traverse les décennies. La Samba s'adapte à toutes vos tenues, du casual au chic décontracté.",
                icon: "✨",
              },
              {
                title: "Confort Supérieur",
                desc: "Semelle intérieure rembourrée et maintien optimal du pied pour un confort toute la journée, même après des heures de port.",
                icon: "👟",
              },
              {
                title: "Livraison & Support",
                desc: "Livraison rapide dans les 58 wilayas d'Algérie. Notre équipe est disponible 7j/7 pour répondre à vos questions.",
                icon: "🚚",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className="p-8 bg-card rounded-2xl border-2 border-border shadow-sm transition-all"
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="font-serif text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">Galerie Lifestyle</h2>
          <p className="text-lg sm:text-xl text-muted-foreground">Découvrez la Samba dans différents styles</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images
            .concat(images)
            .slice(0, 8)
            .map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-md cursor-pointer border-2 border-transparent hover:border-secondary transition-all"
              >
                <Image src={src || "/placeholder.svg"} alt={`Lifestyle ${i + 1}`} fill className="object-cover" />
              </motion.div>
            ))}
        </div>
      </section>

      <section id="reviews" className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-6">Avis des Clientes</h2>
            <div className="flex items-center justify-center gap-3 text-lg mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-secondary text-secondary" />
                ))}
              </div>
              <span className="font-bold text-2xl">4.9/5</span>
            </div>
            <p className="text-muted-foreground">Basé sur 127 avis vérifiés</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Sara B.",
                location: "Alger",
                text: "Absolument parfaites ! Le confort est incroyable et le style est exactement ce que je cherchais. La livraison a été rapide et le produit correspond parfaitement à la description.",
                rating: 5,
                verified: true,
              },
              {
                name: "Lina K.",
                location: "Oran",
                text: "Je porte mes Samba tous les jours depuis 3 semaines. Elles sont confortables, élégantes et vont avec tout. Excellent rapport qualité-prix !",
                rating: 5,
                verified: true,
              },
              {
                name: "Amira D.",
                location: "Constantine",
                text: "Très satisfaite de mon achat. La qualité est au rendez-vous et le service client a été très réactif pour répondre à mes questions sur les tailles.",
                rating: 5,
                verified: true,
              },
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-6 bg-card rounded-2xl border-2 border-border shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                  {review.verified && (
                    <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full font-medium">
                      Vérifié
                    </span>
                  )}
                </div>
                <p className="text-foreground/90 mb-6 leading-relaxed">&quot;{review.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-lg text-secondary">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{review.name}</div>
                    <div className="text-sm text-muted-foreground">{review.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="order" className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Commander Maintenant</h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6">
              Remplissez le formulaire ci-dessous. Paiement à la livraison.
            </p>
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full text-xs sm:text-sm font-semibold text-secondary">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>Plus que {formatCountdown(countdown)} pour profiter de cette offre</span>
            </div>
          </motion.div>

          <OrderForm />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-3 gap-3 sm:gap-4 mt-12 pt-8 border-t border-border"
          >
            {[
              { icon: Shield, text: "Paiement sécurisé" },
              { icon: Truck, text: "Livraison rapide" },
              { icon: Check, text: "Produit authentique" },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <badge.icon className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">{badge.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="lg:hidden fixed left-0 right-0 bottom-0 p-3 sm:p-4 bg-card/98 backdrop-blur-md border-t-2 border-border z-50 shadow-2xl">
        <a
          href="#order"
          className="flex items-center justify-between bg-primary text-primary-foreground px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-lg hover:bg-primary/90 transition-colors"
        >
          <div>
            <div className="text-xs font-medium opacity-90">Offre limitée</div>
            <div className="text-xl sm:text-2xl font-bold">5900 DZD</div>
          </div>
          <div className="px-4 sm:px-6 py-2 sm:py-3 bg-primary-foreground text-primary rounded-xl font-bold text-sm sm:text-base">
            Commander
          </div>
        </a>
      </div>

      <footer className="bg-card border-t-2 border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="sm:col-span-2">
              <div className="font-serif font-bold text-2xl sm:text-3xl mb-4">Chaussura</div>
              <p className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base">
                Votre destination pour les sneakers authentiques en Algérie. Livraison rapide et paiement sécurisé dans
                les 58 wilayas.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://wa.me/213794120959"
                  className="w-10 h-10 rounded-full bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center transition-colors"
                >
                  <span className="text-secondary">📱</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-base sm:text-lg mb-4">Livraison</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>58 wilayas couvertes</li>
                <li>Délai: 2-5 jours ouvrables</li>
                <li>Paiement à la livraison</li>
                <li>Suivi en temps réel</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-base sm:text-lg mb-4">Garanties</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>Produits 100% authentiques</li>
                <li>Satisfait ou remboursé</li>
                <li>Support client 7j/7</li>
                <li>Échange gratuit</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-xs sm:text-sm text-muted-foreground">
            <p>&copy; 2025 Chaussura. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      <WhatsAppButton />
    </main>
  )
}
