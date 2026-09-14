import { useMemo } from 'react';
import { SvgBlazonDrawer } from '../../application/drawer/SvgBlazonDrawer';
import { Blazon } from '../../domain/models/Blazon';
import { ColorModel } from '../../domain/services/IBlazonDrawer';
import { WikipediaColours } from '../colours/WikipediaColours';

const SHIELD_RATIO = 240 / 200;

export interface BlazonShieldProps {
  readonly blazon: Blazon;
  /** What the arms say, for anyone who cannot see them. */
  readonly alt: string;
  /** What each tincture is painted with. Heraldry fixes no shade. */
  readonly colours?: ColorModel;
  readonly width?: number;
}

/**
 * Shows a drawn shield.
 *
 * The SVG travels as an image rather than being inlined, which keeps its clip
 * path in a document of its own — several shields inlined on one page would
 * otherwise share an id space and all take the first one's shape.
 */
export function BlazonShield({ blazon, alt, colours, width = 200 }: BlazonShieldProps) {
  const svg = useMemo(
    () => new SvgBlazonDrawer(colours ?? WikipediaColours).draw(blazon),
    [blazon, colours]
  );

  return (
    <img
      className="blazon-shield"
      src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
      alt={alt}
      width={width}
      height={Math.round(width * SHIELD_RATIO)}
    />
  );
}
