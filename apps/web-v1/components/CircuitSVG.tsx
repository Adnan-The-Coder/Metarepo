// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';

// export default function CircuitSVG() {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const glowFilter = (
//     <defs>
//       <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
//         <feGaussianBlur stdDeviation="2" result="blur" />
//         <feComposite in="SourceGraphic" in2="blur" operator="over" />
//       </filter>
//       <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//         <stop offset="0%" stopColor="#0d9488" stopOpacity="0.2" />
//         <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
//         <stop offset="100%" stopColor="#0d9488" stopOpacity="0.2" />
//       </linearGradient>
//       <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//         <stop offset="0%" stopColor="#0891b2" stopOpacity="0.2" />
//         <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
//         <stop offset="100%" stopColor="#0891b2" stopOpacity="0.2" />
//       </linearGradient>
//       <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
//         <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
//         <stop offset="40%" stopColor="#10b981" stopOpacity="0.6" />
//         <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
//       </radialGradient>
//     </defs>
//   );

//   const circuitVariants = {
//     hidden: { opacity: 0, y: 100 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 1.2,
//         delay: 0.3,
//         type: "spring",
//         stiffness: 30
//       }
//     }
//   };

//   const pulseVariants = {
//     pulse: {
//       scale: [1, 1.1, 1],
//       opacity: [0.4, 0.8, 0.4],
//       transition: {
//         duration: 2,
//         repeat: Infinity,
//         ease: "easeInOut"
//       }
//     }
//   };

//   // Animation for flowing data
//   const flowVariants = {
//     flow: {
//       pathLength: [0, 1],
//       pathOffset: [0, 1],
//       transition: {
//         duration: 3,
//         repeat: Infinity,
//         ease: "linear"
//       }
//     }
//   };

//   return (
//     <div className="w-full h-full overflow-hidden absolute bottom-0 left-0">
//       <motion.svg
//         viewBox="0 0 1200 200"
//         preserveAspectRatio="none"
//         className="w-full h-32 md:h-40 lg:h-48"
//         initial="hidden"
//         animate="visible"
//         variants={circuitVariants}
//       >
//         {glowFilter}
//         {/* Base layers */}
//         <path
//           d="M0,200 L0,85 
//              C50,90 100,75 150,85 
//              C200,95 250,70 300,80 
//              C350,90 400,65 450,75 
//              C500,85 550,60 600,70 
//              C650,80 700,65 750,75 
//              C800,85 850,60 900,70 
//              C950,80 1000,65 1050,75 
//              C1100,85 1150,70 1200,80 
//              L1200,200 Z"
//           fill="#0f172a"
//           opacity="0.9"
//         />
//         <path
//           d="M0,200 L0,110 
//              C50,105 100,120 150,110 
//              C200,100 250,115 300,105 
//              C350,95 400,110 450,100 
//              C500,90 550,115 600,105 
//              C650,95 700,110 750,100 
//              C800,90 850,115 900,105 
//              C950,95 1000,110 1050,100 
//              C1100,90 1150,115 1200,105 
//              L1200,200 Z"
//           fill="#111827"
//           opacity="0.7"
//         />
//         <path
//           d="M0,200 L0,135 
//              C50,137 100,132 150,134 
//              C200,136 250,131 300,133 
//              C350,135 400,130 450,132 
//              C500,134 550,129 600,131 
//              C650,133 700,128 750,130 
//              C800,132 850,127 900,129 
//              C950,131 1000,126 1050,128 
//              C1100,130 1150,125 1200,127 
//              L1200,200 Z"
//           fill="#0f1729"
//         />
//         {/* Horizontal Circuit Lines */}
//         <motion.path
//           d="M0,140 L1200,140"
//           stroke="url(#greenGradient)"
//           strokeWidth="1.5"
//           strokeDasharray="5,5"
//           fill="none"
//           variants={flowVariants}
//           animate="flow"
//         />
//         <motion.path
//           d="M0,150 L300,150 L300,130 L600,130 L600,150 L900,150 L900,130 L1200,130"
//           stroke="url(#blueGradient)"
//           strokeWidth="1"
//           fill="none"
//           filter="url(#glow)"
//           variants={flowVariants}
//           animate="flow"
//         />
//         <motion.path
//           d="M0,160 L400,160 L400,120 L800,120 L800,160 L1200,160"
//           stroke="#10b981"
//           strokeWidth="0.75"
//           strokeDasharray="10,5"
//           fill="none"
//           variants={flowVariants}
//           animate="flow"
//         />
//         {/* Vertical Connection Lines */}
//         <motion.line
//           x1="200" y1="140" x2="200" y2="100"
//           stroke="#10b981"
//           strokeWidth="1"
//           opacity="0.7"
//           initial={{ pathLength: 0 }}
//           animate={{ pathLength: 1 }}
//           transition={{ duration: 1.5, delay: 0.5 }}
//         />
//         <motion.line
//           x1="500" y1="150" x2="500" y2="80"
//           stroke="#06b6d4"
//           strokeWidth="1"
//           opacity="0.7"
//           initial={{ pathLength: 0 }}
//           animate={{ pathLength: 1 }}
//           transition={{ duration: 1.5, delay: 0.7 }}
//         />
//         <motion.line
//           x1="700" y1="130" x2="700" y2="90"
//           stroke="#10b981"
//           strokeWidth="1"
//           opacity="0.7"
//           initial={{ pathLength: 0 }}
//           animate={{ pathLength: 1 }}
//           transition={{ duration: 1.5, delay: 1 }}
//         />
//         <motion.line
//           x1="1000" y1="160" x2="1000" y2="70"
//           stroke="#06b6d4"
//           strokeWidth="1"
//           opacity="0.7"
//           initial={{ pathLength: 0 }}
//           animate={{ pathLength: 1 }}
//           transition={{ duration: 1.5, delay: 1.2 }}
//         />
//         {/* Nodes */}
//         {[
//           { x: 200, y: 140, r: 3, delay: 1.5 },
//           { x: 300, y: 150, r: 4, delay: 1.7 },
//           { x: 400, y: 160, r: 3, delay: 1.9 },
//           { x: 500, y: 150, r: 4, delay: 2.1 },
//           { x: 600, y: 130, r: 3, delay: 2.3 },
//           { x: 700, y: 130, r: 4, delay: 2.5 },
//           { x: 800, y: 120, r: 3, delay: 2.7 },
//           { x: 900, y: 150, r: 4, delay: 2.9 },
//           { x: 1000, y: 160, r: 3, delay: 3.1 }
//         ].map((node, index) => (
//           <g key={index}>
//             <motion.circle
//               cx={node.x}
//               cy={node.y}
//               r={node.r}
//               fill="#10b981"
//               opacity="0.8"
//               filter="url(#glow)"
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ duration: 0.5, delay: node.delay }}
//             />
//             <motion.circle
//               cx={node.x}
//               cy={node.y}
//               r={node.r * 2}
//               fill="url(#nodeGlow)"
//               opacity="0.4"
//               variants={pulseVariants}
//               animate="pulse"
//             />
//           </g>
//         ))}
//         {/* Data Flow Particles */}
//         {mounted && (
//           <>
//             <motion.circle
//               cx="0"
//               cy="140"
//               r="2"
//               fill="#06b6d4"
//               filter="url(#glow)"
//               animate={{
//                 x: [0, 1200],
//                 opacity: [0, 1, 0]
//               }}
//               transition={{
//                 duration: 8,
//                 repeat: Infinity,
//                 ease: "linear",
//                 times: [0, 0.5, 1]
//               }}
//             />
//             <motion.circle
//               cx="0"
//               cy="150"
//               r="2"
//               fill="#10b981"
//               filter="url(#glow)"
//               animate={{
//                 x: [0, 1200],
//                 opacity: [0, 1, 0]
//               }}
//               transition={{
//                 duration: 6,
//                 delay: 2,
//                 repeat: Infinity,
//                 ease: "linear",
//                 times: [0, 0.5, 1]
//               }}
//             />
//             <motion.circle
//               cx="0"
//               cy="160"
//               r="2"
//               fill="#06b6d4"
//               filter="url(#glow)"
//               animate={{
//                 x: [0, 1200],
//                 opacity: [0, 1, 0]
//               }}
//               transition={{
//                 duration: 7,
//                 delay: 3.5,
//                 repeat: Infinity,
//                 ease: "linear",
//                 times: [0, 0.5, 1]
//               }}
//             />
//           </>
//         )}
//         {/* Digital Circuit Details */}
//         <motion.path
//           d="M450,110 L475,110 L475,105 L500,105 L500,110 L525,110"
//           stroke="#10b981"
//           strokeWidth="0.75"
//           fill="none"
//           opacity="0.7"
//           initial={{ pathLength: 0 }}
//           animate={{ pathLength: 1 }}
//           transition={{ duration: 1, delay: 2 }}
//         />
//         <motion.path
//           d="M700,90 L725,90 L725,85 L750,85 L750,90 L775,90"
//           stroke="#06b6d4"
//           strokeWidth="0.75"
//           fill="none"
//           opacity="0.7"
//           initial={{ pathLength: 0 }}
//           animate={{ pathLength: 1 }}
//           transition={{ duration: 1, delay: 2.2 }}
//         />
//         <motion.path
//           d="M950,120 L975,120 L975,115 L1000,115 L1000,120 L1025,120"
//           stroke="#10b981"
//           strokeWidth="0.75"
//           fill="none"
//           opacity="0.7"
//           initial={{ pathLength: 0 }}
//           animate={{ pathLength: 1 }}
//           transition={{ duration: 1, delay: 2.4 }}
//         />
//         {/* Hexagon Node Details */}
//         {[
//           { x: 200, y: 100, size: 8, delay: 2.6 },
//           { x: 500, y: 80, size: 10, delay: 2.8 },
//           { x: 700, y: 90, size: 8, delay: 3 },
//           { x: 1000, y: 70, size: 10, delay: 3.2 }
//         ].map((hex, index) => (
//           <motion.path
//             key={`hex-${index}`}
//             d={`M${hex.x},${hex.y-hex.size} 
//                 L${hex.x+hex.size*0.866},${hex.y-hex.size*0.5} 
//                 L${hex.x+hex.size*0.866},${hex.y+hex.size*0.5} 
//                 L${hex.x},${hex.y+hex.size} 
//                 L${hex.x-hex.size*0.866},${hex.y+hex.size*0.5} 
//                 L${hex.x-hex.size*0.866},${hex.y-hex.size*0.5} Z`}
//             stroke="#10b981"
//             strokeWidth="0.75"
//             fill="rgba(16, 185, 129, 0.1)"
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ duration: 0.8, delay: hex.delay }}
//           />
//         ))}
//       </motion.svg>
//     </div>
//   );
// }