/** Shared flat form control styles — matches site inputs, no native browser chrome. */
export const formInputClassName =
  "mt-1 w-full border border-white/10 bg-black-light px-4 py-3 text-sm text-white outline-none transition hover:border-white/25 focus:border-red autofill-target";

/** 16px text prevents iOS Safari from zooming the page on input focus. */
export const gateInputClassName =
  "mt-1 w-full border border-white/10 bg-black-light px-4 py-3 text-base text-white outline-none transition hover:border-white/25 focus:border-red autofill-target";

export const formSelectClassName = `${formInputClassName} form-select cursor-pointer pr-10`;
