// / <reference types="react-scripts" />

declare module "*.svg" {
  import React = require("react")
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

declare module "*.png" {
  const src: string
  export default src
}

declare module "*.gif" {
  const src: string
  export default src
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Window {
  ethereum?: {
    isMetaMask?: boolean
    isTally?: boolean
    on?: (...args: any[]) => void
    removeListener?: (...args: any[]) => void
    autoRefreshOnNetworkChange?: boolean
  }
  gtag?: (...args: any[]) => void
  web3?: unknown
}

declare module "@metamask/jazzicon" {
  export default function (diameter: number, seed: number): HTMLElement
}
