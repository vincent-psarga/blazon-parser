import { useMemo } from 'react';
import { SvgBlazonDrawer } from '../../src/application/drawer/SvgBlazonDrawer';
import { Blazon } from '../../src/domain/models/Blazon';
import { ColorModel } from '../../src/domain/services/IBlazonDrawer';
import { WikipediaColours } from '../../src/infra/colours/WikipediaColours';

const SHIELD_RATIO = 240 / 200;

export interface BlazonShieldProps {
  readonly blazon: Blazon;
  /** What the arms say, for anyone who cannot see them. */
  readonly alt: string;
  /** What each tincture is painted with. Heraldry fixes no shade. */
  readonly colours?: ColorModel;
  /** What the shield's edge is drawn in, so it never vanishes into its ground. */
  readonly outline?: string;
  readonly width?: number;
}

/**
 * Shows a drawn shield.
 *
 * The SVG travels as an image rather than being inlined, which keeps its clip
 * path in a document of its own — several shields inlined on one page would
 * otherwise share an id space and all take the first one's shape.
 */
export function BlazonShield({ blazon, alt, colours, outline, width = 200 }: BlazonShieldProps) {
  const svg = useMemo(
    () => new SvgBlazonDrawer(colours ?? WikipediaColours, outline).draw(blazon),
    [blazon, colours, outline]
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
