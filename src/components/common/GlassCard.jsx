import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = true, delay = 0, onClick }) {
  return (
    <motion.div
      className={`glass-card rounded-2xl p-6 transition-colors ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? { 
        y: -8, 
        scale: 1.02, 
        boxShadow: "0 20px 40px -10px rgba(201,169,78,0.15)",
        borderColor: "rgba(201,169,78,0.3)",
        transition: { duration: 0.3, ease: "easeOut" } 
      } : {}}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
