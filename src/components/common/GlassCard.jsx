import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = true, delay = 0, onClick }) {
  return (
    <motion.div
      className={`glass-card rounded-2xl p-6 ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? { y: -4, transition: { duration: 0.3 } } : {}}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
