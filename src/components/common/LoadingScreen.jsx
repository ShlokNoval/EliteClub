import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-black-deep flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-burgundy/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative flex flex-col items-center">
        {/* Animated Logo Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-24 h-24 mb-8"
        >
          {/* Pulsing Rings */}
          <motion.div
            animate={{ 
              scale: [1, 1.5],
              opacity: [0.3, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className="absolute inset-0 border-2 border-gold rounded-full"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.2],
              opacity: [0.2, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.5
            }}
            className="absolute inset-0 border border-burgundy rounded-full"
          />

          {/* Logo Placeholder / Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ 
                opacity: [0.6, 1, 0.6],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img src="/logo.png" alt="Elite Club" className="w-16 h-16 object-contain" />
            </motion.div>
          </div>
        </motion.div>

        {/* Text Animation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-center"
        >
          <h2 className="font-playfair text-xl tracking-[0.3em] text-gold-gradient uppercase mb-2">
            Elite Club
          </h2>
          <div className="flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
                className="w-1.5 h-1.5 rounded-full bg-gold/60"
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Progress Bar (Optional/Decorative) */}
      <div className="absolute bottom-12 w-48 h-[1px] bg-white/5 overflow-hidden">
        <motion.div
          animate={{ 
            x: ['-100%', '100%']
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-full h-full bg-gradient-to-r from-transparent via-gold/40 to-transparent"
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
