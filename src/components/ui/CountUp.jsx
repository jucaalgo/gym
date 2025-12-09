import React from 'react';
import { motion } from 'framer-motion';

/**
 * Animated number counter
 * Counts up from 0 to target value
 */
const CountUp = ({ value, duration = 1, suffix = '', className = '' }) => {
    const [displayValue, setDisplayValue] = React.useState(0);

    React.useEffect(() => {
        let startTime = null;
        const startValue = displayValue;
        const endValue = value;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

            // Easing function (ease-out)
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startValue + (endValue - startValue) * eased);

            setDisplayValue(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration]);

    return (
        <motion.span
            key={value}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className={className}
        >
            {displayValue}{suffix}
        </motion.span>
    );
};

export default CountUp;
