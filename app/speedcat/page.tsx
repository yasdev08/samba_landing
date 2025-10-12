"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useState, useEffect } from "react"
import OrderForm from "../components/OrderForm"
import WhatsAppButton from "../components/WhatsAppButton"
import { Check, Shield, Truck, Clock, Star, Zap, Award, TrendingUp } from "lucide-react"


const images = [
  "/puma1.webp",
  "/puma2.webp",
  "/puma3.webp",
  "/puma4.webp",
  "/puma5.webp",
]

export default function Home() {
  const [current, setCurrent] = useState(0)
  const [countdown, setCountdown] = useState<number>(0)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

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
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="font-bold text-xl sm:text-2xl tracking-wider uppercase">PUMA</div>
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
              className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-bold"
            >
              Commander
            </a>
          </nav>
        </div>
      </header>

      <section className="px-4 sm:px-6 py-8 max-w-7xl mx-auto border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-secondary flex-shrink-0" />
            <span className="font-bold">+800 paires vendues</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-secondary flex-shrink-0" />
            <span className="font-bold">100% Authentique</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-secondary flex-shrink-0" />
            <span className="font-bold">Livraison Express</span>
          </div>
        </motion.div>
      </section>

      <section className="px-4 sm:px-6 py-12 md:py-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.div
              style={{ opacity }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 border border-secondary rounded-full text-xs sm:text-sm font-bold mb-6"
            >
              <Clock className="w-4 h-4 text-secondary flex-shrink-0" />
              <span className="text-secondary">OFFRE LIMITÉE — {formatCountdown(countdown)}</span>
            </motion.div>

            <div className="mb-6">
              <div className="text-secondary font-bold text-sm sm:text-base tracking-widest mb-2">RACING HERITAGE</div>
              <h1 className="font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] text-balance uppercase">
                PUMA
                <span className="block text-secondary mt-2">SPEEDCAT</span>
              </h1>
            </div>

            <p className="text-lg sm:text-xl text-muted-foreground font-medium mb-8 text-pretty leading-relaxed">
              L'icône du motorsport réinventée. Design racing low-profile avec la bande signature rose pour un style
              rétro-moderne irrésistible.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 p-6 bg-card rounded-2xl border-2 border-secondary/30">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl sm:text-6xl font-black text-secondary">6900</span>
                <span className="text-2xl font-bold text-muted-foreground">DZD</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-lg text-muted-foreground line-through">8500 DZD</span>
                <span className="px-4 py-1.5 bg-secondary text-white rounded-full text-sm font-black uppercase">
                  -19% AUJOURD'HUI
                </span>
              </div>
            </div>

            <ul className="space-y-4 mb-10">
              {[
                "Design racing iconique low-profile",
                "Bande signature rose - Style unique",
                "Confort supérieur daim premium",
                "Livraison 2-5 jours - 58 wilayas",
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
                  <span className="font-medium">{feature}</span>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <motion.a
                href="#order"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-secondary text-white rounded-xl font-black text-lg text-center hover:bg-secondary/90 transition-colors shadow-lg uppercase tracking-wide"
              >
                Commander Maintenant
              </motion.a>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-6 pt-6 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <div className="font-bold text-sm">Paiement sécurisé</div>
                  <div className="text-xs text-muted-foreground">À la livraison</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <div className="font-bold text-sm">Livraison rapide</div>
                  <div className="text-xs text-muted-foreground">Toute l'Algérie</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl bg-card border-4 border-secondary/30">
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

              <div className="absolute top-6 right-6 px-4 py-2 bg-secondary text-white backdrop-blur-sm rounded-full shadow-lg font-black uppercase text-xs tracking-wider">
                Racing Icon
              </div>

              <div className="absolute bottom-6 left-6 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
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
                    i === current ? "w-10 bg-secondary" : "w-2.5 bg-border hover:bg-secondary/50"
                  }`}
                  aria-label={`Voir image ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-black text-4xl sm:text-5xl md:text-6xl mb-4 text-balance uppercase">
              Pourquoi la Speedcat ?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              L'héritage du motorsport dans une sneaker lifestyle moderne
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Héritage Racing",
                desc: "Inspirée des chaussures de pilotes de course des années 90. Un design iconique qui fait tourner les têtes partout où vous allez.",
                icon: "🏁",
              },
              {
                title: "Style Unique",
                desc: "La bande rose signature sur daim noir premium crée un contraste audacieux. Silhouette basse racing pour un look sleek et moderne.",
                icon: "💎",
              },
              {
                title: "Confort Premium",
                desc: "Daim de haute qualité et semelle confortable pour un port toute la journée. Design ergonomique inspiré de la performance automobile.",
                icon: "⚡",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="p-8 bg-card rounded-2xl border-2 border-border hover:border-secondary transition-all"
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="font-black text-2xl mb-4 uppercase">{feature.title}</h3>
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
          <h2 className="font-black text-4xl sm:text-5xl md:text-6xl mb-4 uppercase">Galerie Style</h2>
          <p className="text-lg sm:text-xl text-muted-foreground">La Speedcat dans tous ses angles</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images
            .concat(images)
            .slice(0, 6)
            .map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-md cursor-pointer border-2 border-border hover:border-secondary transition-all bg-card"
              >
                <Image src={src || "/placeholder.svg"} alt={`Style ${i + 1}`} fill className="object-contain p-4" />
              </motion.div>
            ))}
        </div>
      </section>

      <section id="reviews" className="py-20 bg-card/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-black text-4xl sm:text-5xl md:text-6xl mb-6 uppercase">Avis Clients</h2>
            <div className="flex items-center justify-center gap-3 text-lg mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-secondary text-secondary" />
                ))}
              </div>
              <span className="font-bold text-2xl">4.9/5</span>
            </div>
            <p className="text-muted-foreground">Basé sur 156 avis vérifiés</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Yasmine M.",
                location: "Alger",
                text: "Ces Speedcat sont incroyables ! Le style racing est unique et la bande rose est magnifique. Je reçois des compliments à chaque fois que je les porte. Qualité premium !",
                rating: 5,
                verified: true,
              },
              {
                name: "Nadia K.",
                location: "Oran",
                text: "Parfaites pour mon style streetwear. Le daim est de très haute qualité et elles sont super confortables. La livraison a été rapide et le produit est 100% authentique.",
                rating: 5,
                verified: true,
              },
              {
                name: "Selma B.",
                location: "Constantine",
                text: "J'adore le look rétro racing ! Elles vont avec tout - jeans, robes, joggings. Le confort est excellent même après une journée complète. Très satisfaite de mon achat.",
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
                className="p-6 bg-card rounded-2xl border-2 border-border hover:border-secondary/50 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                  {review.verified && (
                    <span className="text-xs px-2 py-1 bg-secondary/20 text-secondary rounded-full font-bold uppercase">
                      Vérifié
                    </span>
                  )}
                </div>
                <p className="text-foreground/90 mb-6 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-lg text-secondary">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold">{review.name}</div>
                    <div className="text-sm text-muted-foreground">{review.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="order" className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-black text-4xl sm:text-5xl md:text-6xl mb-4 uppercase">Commander</h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6">
              Remplissez le formulaire. Paiement sécurisé à la livraison.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 border border-secondary rounded-full text-sm font-bold text-secondary uppercase">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>Offre expire dans {formatCountdown(countdown)}</span>
            </div>
          </motion.div>

          <OrderForm product="Puma Speedcat OG Femme" />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-border"
          >
            {[
              { icon: Shield, text: "Paiement sécurisé" },
              { icon: Truck, text: "Livraison rapide" },
              { icon: Check, text: "100% Authentique" },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center gap-2 text-center">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                  <badge.icon className="w-6 h-6 text-secondary" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-muted-foreground">{badge.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="lg:hidden fixed left-0 right-0 bottom-0 p-4 bg-card/98 backdrop-blur-md border-t-2 border-secondary z-50 shadow-2xl">
        <a
          href="#order"
          className="flex items-center justify-between bg-secondary text-white px-6 py-4 rounded-2xl shadow-lg hover:bg-secondary/90 transition-colors"
        >
          <div>
            <div className="text-xs font-bold opacity-90 uppercase">Offre limitée</div>
            <div className="text-2xl font-black">6900 DZD</div>
          </div>
          <div className="px-6 py-3 bg-white text-secondary rounded-xl font-black text-base uppercase">Commander</div>
        </a>
      </div>

      <footer className="bg-card border-t-2 border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="sm:col-span-2">
              <div className="font-black text-3xl mb-4 uppercase tracking-wider">PUMA</div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Sneakers authentiques Puma en Algérie. Livraison rapide et paiement sécurisé dans les 58 wilayas.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 uppercase">Livraison</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>58 wilayas couvertes</li>
                <li>Délai: 2-5 jours</li>
                <li>Paiement à la livraison</li>
                <li>Suivi en temps réel</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 uppercase">Garanties</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>100% authentique</li>
                <li>Satisfait ou remboursé</li>
                <li>Support 7j/7</li>
                <li>Échange gratuit</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Puma Algeria. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      <WhatsAppButton />
    </main>
  )
}
