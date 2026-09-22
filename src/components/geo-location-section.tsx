"use client";

import React from "react";

export interface GeoLocationSectionProps {
  isStageMode?: boolean;
}

/**
 * GeoLocationSection
 * Hidden as requested. Returns null so it does not render in the DOM.
 */
export function GeoLocationSection({
  isStageMode: _isStageMode = false,
}: GeoLocationSectionProps = {}) {
  return null;
}

export default GeoLocationSection;
