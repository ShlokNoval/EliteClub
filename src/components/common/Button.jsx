import { motion } from 'framer-motion';

export default function Button({ children, variant = 'gold', size = 'md', className = '', onClick, type = 'button', disabled = false, icon: Icon }) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-wide cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    gold: 'btn-gold',
    burgundy: 'btn-burgundy',
    ghost: 'bg-transparent border border-gold/20 text-gold hover:bg-gold/5 hover:border-gold/40',
    outline: 'bg-transparent border border-champagne/20 text-champagne hover:bg-champagne/5',
    danger: 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
    xl: 'px-10 py-5 text-lg',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={disabled ? {} : { 
        scale: 1.05, 
        boxShadow: variant === 'gold' ? '0 0 25px rgba(201,169,78,0.5)' : 
                   variant === 'burgundy' ? '0 0 25px rgba(107,29,42,0.5)' : 
                   '0 0 15px rgba(255,255,255,0.1)',
        y: -2
      }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : 18} />}
      {children}
    </motion.button>
  );
}
