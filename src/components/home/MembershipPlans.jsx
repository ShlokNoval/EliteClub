import { motion } from 'framer-motion';
import { Check, Sparkles, Crown } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import Button from '../common/Button';
import { membershipPlans } from '../../data/mockData';
import { Link } from 'react-router-dom';

export default function MembershipPlans() {
  return (
    <section id="membership" className="py-24 md:py-32 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(107,29,42,0.1)_0%,_transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Membership Plans"
          title="Choose Your Privilege"
          subtitle="Select the membership that suits your lifestyle. Every plan comes with exclusive access to all partner venues."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
          {membershipPlans.map((plan, i) => (
            <motion.div
              key={plan.id}
              className={`relative rounded-3xl overflow-hidden ${
                plan.popular ? 'lg:mt-32 lg:-mb-32' : ''
              }`}
              initial={{ opacity: 0, y: 150 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.2, type: "spring", stiffness: 40, damping: 20 }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-burgundy to-burgundy-light py-2 text-center z-10">
                  <span className="text-gold-light text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2">
                    <Crown size={14} /> Most Popular
                  </span>
                </div>
              )}

              <div className={`glass-card rounded-3xl p-8 md:p-10 h-full transition-transform duration-500 hover:scale-[1.02] ${
                plan.popular
                  ? 'border-burgundy/30 shadow-[0_0_60px_rgba(107,29,42,0.15)]'
                  : 'border-gold/15'
              } ${plan.popular ? 'pt-14' : ''}`}>

                {/* Plan Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={18} className="text-gold" />
                    <span className="text-gold text-sm font-semibold tracking-[0.15em] uppercase">
                      {plan.subtitle}
                    </span>
                  </div>
                  <h3 className="font-playfair text-3xl font-bold text-champagne mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-smoke text-sm">
                    {plan.duration} • {plan.mrpDays} days MRP + {plan.freeDays} day FREE
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8 flex items-end gap-2">
                  <span className="font-playfair text-5xl font-bold text-gold-gradient">
                    ₹{plan.price.toLocaleString()}
                  </span>
                  <span className="text-smoke text-sm mb-2">/ cycle</span>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check size={18} className="text-gold shrink-0 mt-0.5" />
                      <span className="text-champagne-dark text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link to="/login">
                  <Button
                    variant={plan.popular ? 'burgundy' : 'gold'}
                    size="lg"
                    className="w-full"
                  >
                    Get {plan.name}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
