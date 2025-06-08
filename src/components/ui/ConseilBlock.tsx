import React from 'react';
import { motion } from 'framer-motion';

interface ConseilBlockProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'purple' | 'orange';
  icon?: React.ReactNode;
}

const variantStyles = {
  blue: {
    container: 'bg-blue-500/10 border-blue-500/20',
    dot: 'bg-blue-400',
    title: 'text-blue-400',
    content: 'text-blue-300'
  },
  green: {
    container: 'bg-green-500/10 border-green-500/20',
    dot: 'bg-green-400',
    title: 'text-green-400',
    content: 'text-green-300'
  },
  purple: {
    container: 'bg-purple-500/10 border-purple-500/20',
    dot: 'bg-purple-400',
    title: 'text-purple-400',
    content: 'text-purple-300'
  },
  orange: {
    container: 'bg-orange-500/10 border-orange-500/20',
    dot: 'bg-orange-400',
    title: 'text-orange-400',
    content: 'text-orange-300'
  }
};

export function ConseilBlock({ 
  title = "Conseil Dropskills AI", 
  children, 
  variant = 'blue',
  icon 
}: ConseilBlockProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div 
      className={`${styles.container} border rounded-lg p-4`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-3">
        {icon ? (
          <div className={`${styles.dot} p-1 rounded-full mt-1 flex-shrink-0`}>
            {icon}
          </div>
        ) : (
          <div className={`w-2 h-2 ${styles.dot} rounded-full mt-2 flex-shrink-0`} />
        )}
        <div className="flex-1">
          <h4 className={`${styles.title} font-medium mb-1`}>{title}</h4>
          <div className={`${styles.content} text-sm leading-relaxed`}>
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ConseilBlock;