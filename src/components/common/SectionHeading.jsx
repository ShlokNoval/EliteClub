import { motion } from 'framer-motion';

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', className = '' }) {
  const alignment = {
    center: 'text-center mx-auto',
    left: 'text-left',
  };

  return (
    <motion.div
      className={`max-w-3xl mb-16 ${alignment[align]} ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {eyebrow && (
        <motion.span
          className="inline-block text-gold text-sm font-semibold tracking-[0.2em] uppercase mb-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {eyebrow}
        </motion.span>
      )}
      <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-champagne mb-4 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-smoke text-base md:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className={`section-divider w-24 mt-6 ${align === 'center' ? 'mx-auto' : 'ml-0'}`} />
    </motion.div>
  );
}
