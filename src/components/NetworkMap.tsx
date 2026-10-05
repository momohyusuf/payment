import { useId } from "react";
import { LAGOS, ROUTES } from "../lib/data.ts";
import type { Route } from "../lib/data.ts";

const africa =
  "M366 177 401 170 426 181 452 177 468 189 498 184 524 196 541 212 561 217 572 244 593 257 621 275 650 282 663 271 674 276 654 307 631 329 624 358 612 383 615 406 599 440 586 468 565 484 553 515 531 551 514 565 496 557 482 528 471 498 461 477 455 450 443 430 441 411 429 390 425 371 413 351 391 337 368 338 350 325 328 326 309 310 295 282 296 261 310 235 323 216 341 206 352 187Z";
function curve(route: Route) {
  return `M${LAGOS.x} ${LAGOS.y} Q${route.x > 500 ? 525 : route.x - 65} ${Math.min(route.y, LAGOS.y) - 75} ${route.x} ${route.y}`;
}
export default function NetworkMap({
  selected,
  onSelect,
  compact = false,
  celebrating = false,
}: {
  selected: Route;
  onSelect: (route: Route) => void;
  compact?: boolean;
  celebrating?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox={compact ? "250 50 460 550" : "180 35 600 565"}
      className={`h-full w-full ${compact ? "opacity-95" : ""}`}
      aria-label="Interactive NOVA network: Lagos, Abuja, Accra, Nairobi, and London"
      role="group"
    >
      <defs>
        <pattern
          id={`${id}-dots`}
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="2"
            cy="2"
            r="1.2"
            fill={compact ? "#c9d1ff" : "#bcc3ce"}
          />
        </pattern>
        <radialGradient id={`${id}-glow`}>
          <stop stopColor="#3155ec" stopOpacity=".15" />
          <stop offset="1" stopColor="#3155ec" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="468" cy="320" r="260" fill={`url(#${id}-glow)`} />
      <g fill="none" stroke={compact ? "#ffffff20" : "#dce0e5"} strokeWidth="1">
        <ellipse cx="468" cy="300" rx="275" ry="265" />
        <ellipse cx="468" cy="300" rx="190" ry="265" />
        <ellipse cx="468" cy="300" rx="100" ry="265" />
        <path d="M204 220H730M195 300H740M211 395H723M257 490H681" />
      </g>
      <g fill={`url(#${id}-dots)`}>
        <path d={africa} />
        <path d="M380 155 373 128 394 107 405 84 424 76 437 48 458 58 460 81 480 86 489 114 507 132 533 130 551 159 576 170 556 185 529 176 510 163 491 178 471 154 451 160 429 148 409 163Z" />
        <path d="M572 214 596 201 612 205 633 225 652 233 675 231 696 252 677 268 649 265 627 253 607 247 585 232Z" />
        <path d="m637 424 12 9-3 36-14 36-9-6 4-35z" />
      </g>
      <path
        d={africa}
        fill="none"
        stroke={compact ? "#e3e7ff40" : "#c7ccd6"}
        strokeWidth=".8"
      />
      {ROUTES.map((route) => (
        <path
          key={route.id}
          d={curve(route)}
          fill="none"
          stroke={compact ? "#ffffff35" : "#bcc5df"}
          strokeWidth="1.2"
          strokeDasharray="3 6"
        />
      ))}
      <path
        d={curve(selected)}
        fill="none"
        stroke={compact ? "#fff" : "#3155ec"}
        strokeWidth={celebrating ? 4 : 2}
        className="transition-all duration-500"
      />
      <path
        d={curve(selected)}
        fill="none"
        stroke={compact ? "#baffd4" : "#3155ec"}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="1 79"
        className="animate-travel motion-reduce:hidden"
      />
      {[{ ...LAGOS, id: "lagos", city: "Lagos" }, ...ROUTES].map((city) => {
        const active = city.id === "lagos" || city.id === selected.id;
        return (
          <g
            key={city.id}
            role="button"
            tabIndex={0}
            aria-label={`Select ${city.city} corridor`}
            aria-pressed={active}
            className="cursor-pointer outline-offset-4"
            onClick={() =>
              onSelect(ROUTES.find((r) => r.id === city.id) ?? ROUTES[0])
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(ROUTES.find((r) => r.id === city.id) ?? ROUTES[0]);
              }
            }}
          >
            <circle cx={city.x} cy={city.y} r="21" fill="transparent" />
            <circle
              cx={city.x}
              cy={city.y}
              r={active ? 14 : 9}
              fill={compact ? "#ffffff12" : "#3155ec12"}
            />
            <circle
              cx={city.x}
              cy={city.y}
              r={active ? 5 : 3.5}
              fill={compact ? "#fff" : active ? "#3155ec" : "#7d879f"}
              stroke={compact ? "#3155ec" : "#fff"}
              strokeWidth="2"
            />
            <text
              x={
                city.x +
                (city.id === "accra" ? -12 : city.id === "lagos" ? -6 : 12)
              }
              y={
                city.y +
                (city.id === "lagos" ? 27 : city.id === "abuja" ? -12 : 4)
              }
              textAnchor={
                city.id === "accra" || city.id === "lagos" ? "end" : "start"
              }
              fill={compact ? "#fff" : "#171a20"}
              fontSize={compact ? 13 : 12}
              fontWeight={active ? 600 : 400}
            >
              {city.city}
            </text>
          </g>
        );
      })}
      {!compact && (
        <text
          x="242"
          y="470"
          fill="#8d93a0"
          fontSize="9"
          letterSpacing="3"
          transform="rotate(-90 242 470)"
        >
          BUILT IN AFRICA. CONNECTED TO EVERYWHERE.
        </text>
      )}
    </svg>
  );
}
