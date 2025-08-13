import type { SVGProps } from "react";

const ETH = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 600 600"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    xmlSpace="preserve"
    style={{
      fillRule: "evenodd",
      clipRule: "evenodd",
      strokeLinejoin: "round",
      strokeMiterlimit: 2,
    }}
    {...props}
  >
    <circle
      cx={300}
      cy={300}
      r={300}
      style={{
        fill: "rgb(117,148,238)",
      }}
    />
    <g
      id="_1421394342400"
      transform="matrix(0.355026,0,0,0.355026,160.764,73.2482)"
    >
      <g>
        <g>
          <path
            d="M392.07,0L383.5,29.11L383.5,873.74L392.07,882.29L784.13,650.54L392.07,0Z"
            style={{
              fill: "rgb(204,215,249)",
              fillRule: "nonzero",
            }}
          />
          <path
            d="M392.07,0L-0,650.54L392.07,882.29L392.07,0Z"
            style={{
              fill: "white",
              fillRule: "nonzero",
            }}
          />
          <path
            d="M392.07,956.52L387.24,962.41L387.24,1263.28L392.07,1277.38L784.37,724.89L392.07,956.52Z"
            style={{
              fill: "rgb(204,215,249)",
              fillRule: "nonzero",
            }}
          />
          <path
            d="M392.07,1277.38L392.07,956.52L-0,724.89L392.07,1277.38Z"
            style={{
              fill: "white",
              fillRule: "nonzero",
            }}
          />
          <path
            d="M392.07,882.29L784.13,650.54L392.07,472.33L392.07,882.29Z"
            style={{
              fill: "rgb(147,171,242)",
              fillRule: "nonzero",
            }}
          />
          <path
            d="M0,650.54L392.07,882.29L392.07,472.33L0,650.54Z"
            style={{
              fill: "rgb(204,215,249)",
              fillRule: "nonzero",
            }}
          />
        </g>
      </g>
    </g>
  </svg>
);
export default ETH;
