import React from "react";
import { COLORS, TYPOGRAPHY } from "./constants";

/**
 * Production-grade text component with WCAG AAA compliance
 * Handles color contrast, readability, semantics
 * 
 * @example
 * <AccessibleText variant="secondary" size="sm" weight="medium">
 *   Assumes steady, uninterrupted growth...
 * </AccessibleText>
 */
export const AccessibleText = ({
  as: Component = "p",
  variant = "primary",
  size = "base",
  weight = "normal",
  className = "",
  children,
  ariaLabel,
  role,
  id,
}) => {
  // Color mapping - WCAG AAA compliant
  const colorMap = {
    primary: COLORS.TEXT.PRIMARY,
    secondary: COLORS.TEXT.SECONDARY,
    tertiary: COLORS.TEXT.TERTIARY,
    muted: COLORS.TEXT.MUTED,
  };

  // Font size mapping
  const sizeMap = {
    xs: TYPOGRAPHY.FONT_SIZE.XS,
    sm: TYPOGRAPHY.FONT_SIZE.SM,
    base: TYPOGRAPHY.FONT_SIZE.BASE,
    lg: TYPOGRAPHY.FONT_SIZE.LG,
    xl: TYPOGRAPHY.FONT_SIZE.XL,
  };

  const style = {
    color: colorMap[variant] || COLORS.TEXT.PRIMARY,
    fontSize: sizeMap[size] || TYPOGRAPHY.FONT_SIZE.BASE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT[weight?.toUpperCase()] || TYPOGRAPHY.FONT_WEIGHT.NORMAL,
    lineHeight: size === "xs" || size === "sm" ? TYPOGRAPHY.LINE_HEIGHT.TIGHT : TYPOGRAPHY.LINE_HEIGHT.NORMAL,
    fontFamily: TYPOGRAPHY.FONT_FAMILY.SANS,
  };

  return React.createElement(Component, {
    style,
    className,
    "aria-label": ariaLabel,
    role,
    id,
    children,
  });
};

export default AccessibleText;
