"use client";

import React from "react";

export default function HeroArtworkVector({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full h-full overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Radiant Solar Atmosphere */}
      <div className="absolute right-[5%] top-[20%] w-[320px] sm:w-[480px] h-[320px] sm:h-[480px] rounded-full bg-gradient-to-tr from-[#FFA000]/40 via-[#FF6D00]/25 to-transparent blur-[80px]" />
      <div className="absolute right-[18%] top-[38%] w-[150px] sm:w-[220px] h-[150px] sm:h-[220px] rounded-full bg-[#FFE082]/70 blur-[45px]" />

      <svg
        viewBox="0 0 520 620"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover object-bottom"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          {/* Saffron Flag Radiant Gradient */}
          <linearGradient id="flagBhagwaGrad" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#FFA000" />
            <stop offset="25%" stopColor="#FF6D00" />
            <stop offset="65%" stopColor="#E65100" />
            <stop offset="100%" stopColor="#C84200" />
          </linearGradient>

          {/* Deep Flag Fold Shadows */}
          <linearGradient id="flagFoldShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4A1800" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#2A0B00" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#5A1C00" stopOpacity="0.5" />
          </linearGradient>

          {/* Detailed Mandir Silhouette Gradients */}
          <linearGradient id="mandirGradFar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7A522E" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#3D2614" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="mandirGradNear" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#543319" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#221307" stopOpacity="0.95" />
          </linearGradient>

          {/* Crowd Base Gradient */}
          <linearGradient id="crowdGradDetailed" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3E2410" stopOpacity="0.7" />
            <stop offset="40%" stopColor="#221206" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#120903" stopOpacity="1" />
          </linearGradient>

          {/* Sun Disc */}
          <radialGradient id="sunDiscAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFDE7" stopOpacity="1" />
            <stop offset="35%" stopColor="#FFF59D" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#FFD54F" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFB300" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Golden Sun Disc Rising Over Temples */}
        <circle cx="375" cy="340" r="55" fill="url(#sunDiscAura)" />

        {/* 2. Soaring Birds in the Morning Sky */}
        <g fill="#3D291A" opacity="0.75">
          <path d="M 435 125 Q 444 118 453 124 Q 462 118 471 125 Q 462 121 453 127 Q 444 121 435 125 Z" />
          <path d="M 460 155 Q 467 150 475 154 Q 483 150 490 155 Q 483 152 475 157 Q 467 152 460 155 Z" />
          <path d="M 405 168 Q 411 163 417 167 Q 423 163 429 168 Q 423 165 417 169 Q 411 165 405 168 Z" />
          <path d="M 475 185 Q 480 181 486 184 Q 492 181 497 185 Q 492 183 486 187 Q 480 183 475 185 Z" />
        </g>

        {/* 3. Layer 1: Distant Majestic Mandir & Temple Spires */}
        <g fill="url(#mandirGradFar)">
          {/* Far Mandir Spire 1 */}
          <path d="M 235 410 Q 244 330 248 290 L 249 270 L 250 290 Q 254 330 263 410 Z" />
          <circle cx="249" cy="266" r="3.5" fill="#E6A14A" />
          {/* Base tiered mandap */}
          <path d="M 225 410 L 273 410 L 268 375 L 230 375 Z" opacity="0.8" />

          {/* Far Mandir Spire 2 */}
          <path d="M 285 410 Q 293 355 296 325 L 297 310 L 298 325 Q 301 355 309 410 Z" />
          <circle cx="297" cy="307" r="3" fill="#E6A14A" />

          {/* Far Right Temple Cluster */}
          <path d="M 440 420 Q 455 300 464 240 L 465 220 L 466 240 Q 475 300 490 420 Z" />
          <circle cx="465" cy="216" r="4.5" fill="#E6A14A" />
          <path d="M 410 420 Q 422 330 429 285 L 430 270 L 431 285 Q 438 330 450 420 Z" />
          <circle cx="430" cy="267" r="3.5" fill="#E6A14A" />
        </g>

        {/* 4. Layer 2: Near Mandir Architectural Silhouette */}
        <g fill="url(#mandirGradNear)">
          {/* Grand Central Mandir behind Youth */}
          <path d="M 330 420 Q 345 285 354 225 L 355 200 L 356 225 Q 365 285 380 420 Z" />
          <circle cx="355" cy="196" r="4.5" fill="#FFA000" />
          <ellipse cx="355" cy="235" rx="14" ry="4" opacity="0.6" />
          <ellipse cx="355" cy="285" rx="20" ry="6" opacity="0.6" />

          {/* Side tiered sanctum */}
          <path d="M 470 420 Q 482 340 488 300 L 489 285 L 490 300 Q 496 340 508 420 Z" />
          <circle cx="489" cy="282" r="3.5" fill="#FFA000" />
        </g>

        {/* 5. Layer 3: Dynamic Crowd Gathering at the Base */}
        <g fill="url(#crowdGradDetailed)">
          {/* Ground Mass */}
          <path d="M 140 620 L 520 620 L 520 420 Q 460 410 400 415 Q 330 405 270 418 Q 200 425 140 455 Z" />
          
          {/* Crowd Head Details */}
          {Array.from({ length: 60 }).map((_, i) => {
            const cx = 155 + i * 6.2 + ((i * 3) % 5);
            const cy = 435 + (i % 6) * 7.5 + ((i * 7) % 4);
            const r = 4.5 + (i % 3) * 0.8;
            return (
              <g key={i} opacity={0.8 + (i % 4) * 0.05}>
                <circle cx={cx} cy={cy} r={r} />
                <path d={`M ${cx - r * 1.5} ${cy + r * 1.1} Q ${cx} ${cy + r * 0.6} ${cx + r * 1.5} ${cy + r * 1.1} L ${cx + r * 2} 620 L ${cx - r * 2} 620 Z`} />
              </g>
            );
          })}
        </g>

        {/* 6. Foreground Youth Hero Raising the Bhagwa Dhwaj */}
        <g id="heroYouthFigure">
          {/* Sturdy Wood/Metal Flagpole (Angular Stance) */}
          <line
            x1="328"
            y1="540"
            x2="258"
            y2="45"
            stroke="#120A05"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          {/* Top Brass Finial Spear */}
          <polygon points="258,28 252,48 264,48" fill="#FF8F00" />
          <circle cx="258" cy="50" r="5.5" fill="#E65100" />

          {/* Majestic Fluttering Double-Tailed Bhagwa Dhwaj (Saffron Flag) */}
          <g>
            {/* Base Flag Geometry */}
            <path
              d="M 260 55 
                 C 298 50, 345 85, 388 75
                 C 428 65, 455 102, 492 90
                 L 435 125
                 C 462 138, 485 172, 512 160
                 L 452 190
                 C 395 208, 345 160, 308 182
                 C 282 198, 268 180, 260 186
                 Z"
              fill="url(#flagBhagwaGrad)"
              filter="drop-shadow(0px 10px 20px rgba(0,0,0,0.4))"
            />

            {/* Realistic Wave Shadows */}
            <path
              d="M 260 55 
                 C 295 62, 322 118, 352 98
                 C 388 75, 425 122, 458 102
                 L 428 135
                 C 388 158, 348 112, 308 148
                 C 280 172, 264 180, 260 186
                 Z"
              fill="url(#flagFoldShadow)"
              opacity="0.5"
            />

            {/* Sunlight Highlight Ridge along Top Edge */}
            <path
              d="M 260 55 
                 C 298 50, 345 85, 388 75
                 C 428 65, 455 102, 492 90"
              stroke="#FFF9C4"
              strokeWidth="2.5"
              fill="none"
              opacity="0.75"
            />
          </g>

          {/* Hero Figure (Athletic Youth Silhouette) */}
          <g fill="#140D07">
            {/* Raised Arm Gripping High */}
            <path d="M 322 280 Q 300 215 284 172 L 297 166 Q 314 210 338 270 Z" />
            {/* Hand Grip */}
            <ellipse cx="288" cy="170" rx="9" ry="6.5" transform="rotate(-32 288 170)" />

            {/* Second Arm Gripping Lower */}
            <path d="M 342 305 Q 320 298 298 292 L 296 305 Q 322 312 346 320 Z" />
            <ellipse cx="298" cy="298" rx="8" ry="5.5" />

            {/* Head & Athletic Hair */}
            <circle cx="334" cy="222" r="15" />
            <path d="M 340 216 Q 352 221 348 232 L 340 234 Z" />
            <path d="M 320 212 Q 325 200 338 205 Q 346 208 345 215 L 324 222 Z" />

            {/* Torso */}
            <path d="M 318 238 C 336 235, 354 240, 362 255 L 368 335 C 348 342, 324 342, 308 334 L 318 238 Z" />

            {/* Muscular Leg Stance */}
            <path d="M 308 334 L 302 485 L 326 485 L 336 370 L 348 485 L 372 485 L 368 335 Z" />
          </g>
        </g>
      </svg>
    </div>
  );
}
