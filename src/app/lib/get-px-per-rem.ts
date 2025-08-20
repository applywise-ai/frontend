export const getPxPerRem = () => {
  const bodyComputedStyle = getComputedStyle(
    document.querySelector("body")!
  ) as CSSStyleDeclaration;
  return parseFloat(bodyComputedStyle.fontSize) || 16;
};
