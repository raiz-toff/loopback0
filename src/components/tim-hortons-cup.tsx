import React from "react";

export function TimHortonsCup({
  className = "size-6 shrink-0 inline-block align-middle",
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={className}
      aria-label="Tim Hortons Double-Double Cup"
      role="img"
      {...props}
    >
      <defs>
        {/* Soft Warm Ambient Glow */}
        <radialGradient id="th_ambientGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFEEDD" stopOpacity="0.45" />
          <stop offset="65%" stopColor="#FFF8F0" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>

        {/* 3D Cylindrical Red Cup Gradient (Tim Hortons Red) */}
        <linearGradient id="th_cupBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#880716" />
          <stop offset="14%" stopColor="#B30D23" />
          <stop offset="38%" stopColor="#DC1A35" />
          <stop offset="55%" stopColor="#EB233F" />
          <stop offset="78%" stopColor="#C00F26" />
          <stop offset="100%" stopColor="#730512" />
        </linearGradient>

        {/* Tim Hortons Mocha/Espresso Brown Lid Gradients */}
        <linearGradient id="th_lidBaseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#180C07" />
          <stop offset="18%" stopColor="#2E170E" />
          <stop offset="50%" stopColor="#442316" />
          <stop offset="82%" stopColor="#2E170E" />
          <stop offset="100%" stopColor="#180C07" />
        </linearGradient>

        <linearGradient id="th_lidTopDomeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#522C1C" />
          <stop offset="50%" stopColor="#3A1E13" />
          <stop offset="100%" stopColor="#24120A" />
        </linearGradient>

        <linearGradient id="th_lidRimHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#24120A" />
          <stop offset="50%" stopColor="#6E3B26" />
          <stop offset="100%" stopColor="#24120A" />
        </linearGradient>

        {/* Sunglasses Lens & Iridescent Reflection Gradients */}
        <linearGradient id="th_sunglassLensGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E232A" />
          <stop offset="55%" stopColor="#111418" />
          <stop offset="100%" stopColor="#07080A" />
        </linearGradient>

        <linearGradient id="th_lensIridescent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.38" />
          <stop offset="45%" stopColor="#7B2CBF" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#FF007F" stopOpacity="0.28" />
        </linearGradient>

        <linearGradient id="th_goldFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="50%" stopColor="#FFB300" />
          <stop offset="100%" stopColor="#FF8F00" />
        </linearGradient>

        {/* Double-Double Cafe-au-Lait Cream Gradient */}
        <linearGradient id="th_creamBadgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D9BA96" />
          <stop offset="35%" stopColor="#F7EADB" />
          <stop offset="70%" stopColor="#EED5BA" />
          <stop offset="100%" stopColor="#CFA880" />
        </linearGradient>

        {/* Drop Shadow Filter */}
        <filter id="th_cupShadow" x="-15%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#1A0507" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Ambient Glow */}
      <circle cx="256" cy="270" r="230" fill="url(#th_ambientGlow)" />

      {/* Ground Shadow */}
      <ellipse cx="256" cy="472" rx="116" ry="15" fill="#1C0608" opacity="0.2" />
      <ellipse cx="256" cy="471" rx="86" ry="9" fill="#1C0608" opacity="0.16" />

      {/* STEAM & AROMA */}
      <g id="steamGroup" opacity="0.88">
        <path
          d="M212 108 C194 82, 204 60, 186 38 C176 24, 186 12, 194 6"
          fill="none"
          stroke="#E2C4A2"
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity="0.65"
        />
        <path
          d="M256 100 C248 70, 276 58, 262 32 C254 18, 242 22, 246 8"
          fill="none"
          stroke="#DDB58E"
          strokeWidth="5.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M298 108 C318 84, 304 56, 326 34 C338 20, 330 10, 322 4"
          fill="none"
          stroke="#E2C4A2"
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity="0.65"
        />

        {/* Floating Aroma Heart */}
        <g transform="translate(266, 26) scale(0.9)">
          <path
            d="M0 -4 C0 -9, -7 -12, -11 -7 C-15 -12, -22 -9, -22 -4 C-22 3, -11 11, -11 11 C-11 11, 0 3, 0 -4 Z"
            fill="#FF6B8B"
            opacity="0.85"
          />
          <circle cx="-16" cy="-6" r="1.5" fill="#FFFFFF" opacity="0.7" />
        </g>

        {/* Sparkles */}
        <path d="M174 48 Q180 48 180 42 Q180 48 186 48 Q180 48 180 54 Q180 48 174 48 Z" fill="#FFCA28" />
        <path d="M336 64 Q341 64 341 59 Q341 64 346 64 Q341 64 341 69 Q341 64 336 64 Z" fill="#FFD54F" />
        <circle cx="166" cy="74" r="2.5" fill="#FFE082" opacity="0.8" />
        <circle cx="344" cy="40" r="3" fill="#FFE082" opacity="0.85" />
        <circle cx="232" cy="30" r="2" fill="#FFCA28" opacity="0.75" />
      </g>

      {/* MAIN CUP OBJECT */}
      <g id="timHortonsCup" filter="url(#th_cupShadow)">
        {/* Bottom Rolled Rim */}
        <ellipse cx="256" cy="446" rx="76" ry="11" fill="#780512" />
        <path d="M180 446 C180 453, 332 453, 332 446 L329 452 C329 459, 183 459, 183 452 Z" fill="#4A0209" />
        <ellipse cx="256" cy="452" rx="73" ry="7" fill="#E8E8E8" />
        <ellipse cx="256" cy="451.5" rx="70" ry="5.5" fill="#FFFFFF" />

        {/* Tapered Cup Body */}
        <path
          d="M146 168 L180 446 C180 446, 206 456, 256 456 C306 456, 332 446, 332 446 L366 168 Z"
          fill="url(#th_cupBodyGrad)"
        />

        {/* Cup Highlights and Shading */}
        <path d="M154 174 L184 440 C176 430, 166 210, 154 174 Z" fill="#FFFFFF" opacity="0.14" />
        <path d="M358 174 L328 440 C338 430, 348 210, 358 174 Z" fill="#000000" opacity="0.22" />

        {/* CANADIAN MAPLE LEAF EMBLEM */}
        <g id="canadianMapleLeaf" transform="translate(256, 212) scale(0.68)">
          <path
            d="M0 -44 L7 -23 L19 -26 L15 -13 L27 -15 L23 1 L37 1 L29 15 L33 21 L18 23 L19 29 L8 27 L2 45 L-2 45 L-8 27 L-19 29 L-18 23 L-33 21 L-29 15 L-37 1 L-23 1 L-27 -15 L-15 -13 L-19 -26 L-7 -23 Z"
            fill="#800A16"
            opacity="0.3"
            transform="translate(0, 2)"
          />
          <path
            d="M0 -44 L7 -23 L19 -26 L15 -13 L27 -15 L23 1 L37 1 L29 15 L33 21 L18 23 L19 29 L8 27 L2 45 L-2 45 L-8 27 L-19 29 L-18 23 L-33 21 L-29 15 L-37 1 L-23 1 L-27 -15 L-15 -13 L-19 -26 L-7 -23 Z"
            fill="#FFFFFF"
          />
          <path d="M-2 27 L2 27 L3 45 L-3 45 Z" fill="#FFFFFF" />
        </g>

        {/* MOTTO / SLOGAN */}
        <text
          x="256"
          y="254"
          fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
          fontWeight="900"
          fontSize="7.5"
          fill="#FFFFFF"
          letterSpacing="2.2"
          textAnchor="middle"
          opacity="0.95"
        >
          ALWAYS FRESH • TOUJOURS FRAIS
        </text>
        <text
          x="256"
          y="264"
          fontFamily="'Helvetica Neue', Arial, sans-serif"
          fontWeight="700"
          fontSize="5.8"
          fill="#FFCDD2"
          letterSpacing="1.4"
          textAnchor="middle"
          opacity="0.85"
        >
          EST. 1964
        </text>

        {/* CUTE & COOL FACE */}
        <g id="cuteCoolFace">
          {/* Cool Sunglasses */}
          <g id="sunglasses" transform="translate(0, 3)">
            <path
              d="M241 278 C247 274, 265 274, 271 278"
              fill="none"
              stroke="#1A0D08"
              strokeWidth="6.5"
              strokeLinecap="round"
            />
            <path
              d="M242 278 C248 275, 264 275, 270 278"
              fill="none"
              stroke="url(#th_goldFrameGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Left Lens */}
            <path
              d="M184 272 C210 270, 243 273, 244 286 C245 305, 235 323, 211 323 C187 323, 179 303, 179 286 C179 274, 181 272, 184 272 Z"
              fill="#180C07"
              stroke="url(#th_goldFrameGrad)"
              strokeWidth="3"
            />
            <path
              d="M186 274 C209 272, 240 275, 241 286 C242 302, 233 319, 211 319 C189 319, 182 301, 182 286 C182 276, 184 274, 186 274 Z"
              fill="url(#th_sunglassLensGrad)"
            />
            <path
              d="M186 274 C209 272, 240 275, 241 286 C242 302, 233 319, 211 319 C189 319, 182 301, 182 286 C182 276, 184 274, 186 274 Z"
              fill="url(#th_lensIridescent)"
            />
            <path d="M189 278 L203 277 L190 315 L183 309 Z" fill="#FFFFFF" opacity="0.36" />
            <path d="M206 277 L212 276 L201 317 L197 317 Z" fill="#FFFFFF" opacity="0.22" />

            {/* Right Lens with Maple Leaf Glare */}
            <path
              d="M328 272 C302 270, 269 273, 268 286 C267 305, 277 323, 301 323 C325 323, 333 303, 333 286 C333 274, 331 272, 328 272 Z"
              fill="#180C07"
              stroke="url(#th_goldFrameGrad)"
              strokeWidth="3"
            />
            <path
              d="M326 274 C303 272, 272 275, 271 286 C270 302, 279 319, 301 319 C323 319, 330 301, 330 286 C330 276, 328 274, 326 274 Z"
              fill="url(#th_sunglassLensGrad)"
            />
            <path
              d="M326 274 C303 272, 272 275, 271 286 C270 302, 279 319, 301 319 C323 319, 330 301, 330 286 C330 276, 328 274, 326 274 Z"
              fill="url(#th_lensIridescent)"
            />
            <path d="M279 277 L287 276 L278 310 L274 305 Z" fill="#FFFFFF" opacity="0.32" />
            <g transform="translate(306, 296) scale(0.24)" opacity="0.62">
              <path
                d="M0 -30 L5 -16 L14 -18 L11 -8 L19 -9 L16 1 L26 1 L20 10 L23 15 L12 16 L13 21 L5 19 L1 31 L-1 31 L-5 19 L-13 21 L-12 16 L-23 15 L-20 10 L-26 1 L-16 1 L-19 -9 L-11 -8 L-14 -18 L-5 -16 Z"
                fill="#FFFFFF"
              />
            </g>
          </g>

          {/* Blushing Kawaii Cheeks */}
          <g id="blushingCheeks">
            <ellipse cx="176" cy="334" rx="14" ry="7.5" fill="#FF4770" opacity="0.75" />
            <circle cx="172" cy="332" r="2.5" fill="#FFFFFF" opacity="0.85" />
            <circle cx="178" cy="336" r="1.5" fill="#FFFFFF" opacity="0.75" />

            <ellipse cx="336" cy="334" rx="14" ry="7.5" fill="#FF4770" opacity="0.75" />
            <circle cx="339" cy="332" r="2.5" fill="#FFFFFF" opacity="0.85" />
            <circle cx="333" cy="336" r="1.5" fill="#FFFFFF" opacity="0.75" />
          </g>

          {/* Happy Smile with Tongue */}
          <g id="kawaiiSmile">
            <path
              d="M237 329 Q256 354 275 329 Q256 334 237 329 Z"
              fill="#3A080A"
              stroke="#260405"
              strokeWidth="1.6"
            />
            <path
              d="M245 338 C249 332, 263 332, 267 338 C263 346, 249 346, 245 338 Z"
              fill="#FF6584"
            />
            <path
              d="M233 328 C235 331, 236 333, 237 330"
              fill="none"
              stroke="#4A080A"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M279 328 C277 331, 276 333, 275 330"
              fill="none"
              stroke="#4A080A"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* "DOUBLE-DOUBLE" COFFEE BADGE */}
        <g id="doubleDoubleBadge" transform="translate(0, 15)">
          <rect
            x="168"
            y="340"
            width="176"
            height="46"
            rx="23"
            fill="#FFF9F2"
            stroke="#E6C49F"
            strokeWidth="2.2"
            opacity="0.98"
          />
          <rect x="172" y="344" width="168" height="38" rx="19" fill="url(#th_creamBadgeGrad)" />

          {/* 2 Cream Drops */}
          <g transform="translate(187, 363)">
            <path d="M0 -6 C3 -2, 4 2, 0 5 C-4 2, -3 -2, 0 -6 Z" fill="#FFFFFF" />
            <path
              d="M7 -3 C9.5 0.5, 10 3.5, 7.5 5.5 C5 3.5, 5.5 0.5, 7 -3 Z"
              fill="#FFFFFF"
              opacity="0.88"
            />
          </g>

          <text
            x="257"
            y="361"
            fontFamily="'Arial Black', 'Impact', sans-serif"
            fontSize="14.5"
            fill="#28140B"
            fontWeight="900"
            letterSpacing="0.8"
            textAnchor="middle"
          >
            DOUBLE-DOUBLE
          </text>
          <text
            x="257"
            y="374"
            fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
            fontSize="7.5"
            fontWeight="800"
            fill="#6A3B1F"
            letterSpacing="1"
            textAnchor="middle"
          >
            2 CREAM  •  2 SUGAR
          </text>

          {/* 2 Sugar Cubes */}
          <g transform="translate(314, 356)">
            <rect
              x="0"
              y="4"
              width="7"
              height="7"
              rx="1.5"
              fill="#FFFFFF"
              stroke="#D7CCC8"
              strokeWidth="0.8"
            />
            <rect
              x="5.5"
              y="-1"
              width="7"
              height="7"
              rx="1.5"
              fill="#FFFFFF"
              stroke="#D7CCC8"
              strokeWidth="0.8"
            />
          </g>
        </g>

        {/* TIM HORTONS CURSIVE SCRIPT */}
        <g id="timHortonsScript" transform="translate(256, 427)">
          <text
            x="0"
            y="1"
            fontFamily="'Brush Script MT', 'Lucida Calligraphy', 'Snell Roundhand', 'Pacifico', cursive, sans-serif"
            fontSize="24"
            fontWeight="bold"
            fontStyle="italic"
            fill="#5E050E"
            textAnchor="middle"
            letterSpacing="0.6"
          >
            Tim Hortons
          </text>
          <text
            x="0"
            y="0"
            fontFamily="'Brush Script MT', 'Lucida Calligraphy', 'Snell Roundhand', 'Pacifico', cursive, sans-serif"
            fontSize="24"
            fontWeight="bold"
            fontStyle="italic"
            fill="#FFFFFF"
            textAnchor="middle"
            letterSpacing="0.6"
          >
            Tim Hortons
          </text>
        </g>

        {/* Canadian Pin on Shoulder */}
        <g transform="translate(336, 196) rotate(14) scale(0.34)">
          <circle cx="0" cy="0" r="28" fill="#FFF8F0" stroke="#FFB300" strokeWidth="3.5" />
          <path
            d="M0 -18 L4 -9 L10 -10 L7 -4 L13 -5 L10 2 L17 2 L13 8 L15 11 L7 12 L8 15 L3 14 L1 22 L-1 22 L-3 14 L-8 15 L-7 12 L-15 11 L-13 8 L-1 L-8 15 L-7 12 L-15 11 L-13 8 L-17 2 L-10 2 L-13 -5 L-7 -4 L-10 -10 L-4 -9 Z"
            fill="#C8102E"
          />
        </g>

        {/* TIM HORTONS BROWN LID */}
        <g id="authenticMochaLid">
          <path
            d="M136 157 C136 148, 376 148, 376 157 L372 171 C372 176, 140 176, 140 171 Z"
            fill="url(#th_lidBaseGrad)"
          />
          <ellipse cx="256" cy="170" rx="116" ry="6" fill="#150A05" />

          <path
            d="M143 151 C143 138, 369 138, 369 151 L366 159 C366 168, 146 168, 146 159 Z"
            fill="url(#th_lidBaseGrad)"
          />

          <ellipse cx="256" cy="151" rx="113" ry="11" fill="url(#th_lidRimHighlight)" />
          <ellipse cx="256" cy="149" rx="101" ry="9" fill="url(#th_lidTopDomeGrad)" />
          <ellipse cx="256" cy="148" rx="89" ry="7.5" fill="#200F08" />

          {/* Drinking Spout & Tab */}
          <path
            d="M228 139 C228 134, 284 134, 284 139 L282 145 C282 148, 230 148, 230 145 Z"
            fill="#4F2A1B"
          />
          <ellipse cx="256" cy="139" rx="26" ry="3.5" fill="#6B3A26" />
          <ellipse cx="256" cy="139" rx="9.5" ry="2" fill="#100603" />

          <path
            d="M246 143 L266 143 L264 152 L248 152 Z"
            fill="#2B160E"
            stroke="#482517"
            strokeWidth="0.8"
          />
          <circle cx="256" cy="147" r="1.8" fill="#5E3524" />

          {/* Lid Edge Grip Grooves */}
          <g stroke="#482618" strokeWidth="1.8" strokeLinecap="round" opacity="0.65">
            <line x1="150" y1="157" x2="150" y2="165" />
            <line x1="158" y1="159" x2="158" y2="167" />
            <line x1="362" y1="157" x2="362" y2="165" />
            <line x1="354" y1="159" x2="354" y2="167" />
          </g>

          <path
            d="M168 149 C188 144, 232 143, 252 144"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.25"
          />
        </g>
      </g>
    </svg>
  );
}
