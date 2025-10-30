export interface LensDataPoint {
  focalLength: number;
  aperture: number;
}

export type DataSource = 'official' | 'ai-research';

export interface Lens {
  id: string;
  name: string;
  format: 'full-frame' | 'apsc' | 'm43';
  data: LensDataPoint[];
  dataSource: DataSource;
  sourceUrl?: string;
}

export const lensData: Lens[] = [
  {
    id: 'tamron-28-200-f2.8-5.6-di-iii-rxd',
    name: 'Tamron 28-200mm f/2.8-5.6 Di III RXD',
    format: 'full-frame',
    dataSource: 'official',
    sourceUrl: 'https://y-g-jiang.github.io/LAC.html',
    data: [
      { focalLength: 28, aperture: 2.8 },
      { focalLength: 31, aperture: 3.2 },
      { focalLength: 39, aperture: 3.5 },
      { focalLength: 50, aperture: 4 },
      { focalLength: 70, aperture: 4.5 },
      { focalLength: 103, aperture: 5.6 },
      { focalLength: 200, aperture: 5.6 },
    ],
  },
  {
    id: 'tamron-35-150-f2-2.8-di-iii-vxd',
    name: 'Tamron 35-150mm f/2-2.8 Di III VXD',
    format: 'full-frame',
    dataSource: 'official',
    sourceUrl: 'https://y-g-jiang.github.io/LAC.html',
    data: [
      { focalLength: 35, aperture: 2.0 },
      { focalLength: 39, aperture: 2.2 },
      { focalLength: 50, aperture: 2.5 },
      { focalLength: 70, aperture: 2.8 },
      { focalLength: 150, aperture: 2.8 },
    ],
  },
  {
    id: 'sigma-20-200-f3.5-6.3-dg-contemporary',
    name: 'Sigma 20-200mm f/3.5-6.3 DG Contemporary',
    format: 'full-frame',
    dataSource: 'official',
    sourceUrl: 'https://y-g-jiang.github.io/LAC.html',
    data: [
      { focalLength: 20, aperture: 3.5 },
      { focalLength: 24, aperture: 4.0 },
      { focalLength: 28, aperture: 4.5 },
      { focalLength: 35, aperture: 5.0 },
      { focalLength: 50, aperture: 5.6 },
      { focalLength: 70, aperture: 6.3 },
      { focalLength: 200, aperture: 6.3 },
    ],
  },
  {
    id: 'sony-fe-24-240-f3.5-6.3-oss',
    name: 'Sony FE 24-240mm f/3.5-6.3 OSS',
    format: 'full-frame',
    dataSource: 'official',
    sourceUrl: 'https://y-g-jiang.github.io/LAC.html',
    data: [
      { focalLength: 24, aperture: 3.5 },
      { focalLength: 28, aperture: 4.0 },
      { focalLength: 35, aperture: 4.5 },
      { focalLength: 50, aperture: 5.0 },
      { focalLength: 55, aperture: 5.6 },
      { focalLength: 70, aperture: 5.6 },
      { focalLength: 103, aperture: 6.3 },
      { focalLength: 240, aperture: 6.3 },
    ],
  },
  {
    id: 'canon-rf-24-240-f4-6.3-is-usm',
    name: 'Canon RF 24-240mm F4-6.3 IS USM',
    format: 'full-frame',
    dataSource: 'official',
    sourceUrl: 'https://y-g-jiang.github.io/LAC.html',
    data: [
      { focalLength: 24, aperture: 4 },
      { focalLength: 40, aperture: 5 },
      { focalLength: 105, aperture: 6.3 },
      { focalLength: 240, aperture: 6.3 },
    ],
  },
  {
    id: 'nikon-z-24-200-f4-6.3-vr',
    name: 'Nikon Z 24-200mm f/4-6.3 VR',
    format: 'full-frame',
    dataSource: 'official',
    sourceUrl: 'https://y-g-jiang.github.io/LAC.html',
    data: [
      { focalLength: 24, aperture: 4 },
      { focalLength: 28, aperture: 4.5 },
      { focalLength: 35, aperture: 4.8 },
      { focalLength: 50, aperture: 5.6 },
      { focalLength: 70, aperture: 6 },
      { focalLength: 85, aperture: 6.3 },
      { focalLength: 200, aperture: 6.3 },
    ],
  },
  {
    id: 'canon-ef-s-18-55-f3.5-5.6-is-stm',
    name: 'Canon EF-S 18-55mm f/3.5-5.6 IS STM',
    format: 'apsc',
    dataSource: 'official',
    sourceUrl: 'https://y-g-jiang.github.io/LAC.html',
    data: [
      { focalLength: 18, aperture: 3.5 },
      { focalLength: 24, aperture: 4 },
      { focalLength: 32, aperture: 4.5 },
      { focalLength: 37, aperture: 5 },
      { focalLength: 47, aperture: 5.6 },
      { focalLength: 55, aperture: 5.6 },
    ],
  },
  {
    id: 'canon-ef-s-18-200-f3.5-5.6-is',
    name: 'Canon EF-S 18-200mm f/3.5-5.6 IS',
    format: 'apsc',
    dataSource: 'official',
    sourceUrl: 'https://y-g-jiang.github.io/LAC.html',
    data: [
      { focalLength: 18, aperture: 3.5 },
      { focalLength: 24, aperture: 4 },
      { focalLength: 40, aperture: 4.5 },
      { focalLength: 50, aperture: 5 },
      { focalLength: 90, aperture: 5.6 },
      { focalLength: 200, aperture: 5.6 },
    ],
  },
  {
    id: 'sigma-16-300-f3.5-6.7-dn',
    name: 'Sigma 16-300mm f/3.5-6.7 DN',
    format: 'apsc',
    dataSource: 'official',
    sourceUrl: 'https://y-g-jiang.github.io/LAC.html',
    data: [
      { focalLength: 16, aperture: 3.5 },
      { focalLength: 18, aperture: 4 },
      { focalLength: 31, aperture: 4.5 },
      { focalLength: 48, aperture: 5.6 },
      { focalLength: 133, aperture: 6.7 },
      { focalLength: 300, aperture: 6.7 },
    ],
  },
  {
    id: 'tamron-18-300-f3.5-6.3-di-iii-a-vc-vxd',
    name: 'Tamron 18-300mm f/3.5-6.3 Di III-A VC VXD',
    format: 'apsc',
    dataSource: 'official',
    sourceUrl: 'https://y-g-jiang.github.io/LAC.html',
    data: [
      { focalLength: 18, aperture: 3.5 },
      { focalLength: 23, aperture: 4 },
      { focalLength: 39, aperture: 4.5 },
      { focalLength: 64, aperture: 5 },
      { focalLength: 88, aperture: 5.6 },
      { focalLength: 167, aperture: 6.3 },
      { focalLength: 300, aperture: 6.3 },
    ],
  },
  {
    id: 'tamron-18-400mm-f-35-63-di-ii-vc-hld-aps-c',
    name: 'Tamron 18-400mm f/3.5-6.3 Di II VC HLD APS-C',
    format: 'apsc',
    dataSource: 'ai-research',
    sourceUrl: 'https://www.the-digital-picture.com/Reviews/Tamron-18-400mm-f-3.5-6.3-Di-II-VC-HLD-Lens.aspx',
    data: [
      { focalLength: 18, aperture: 3.5 },
      { focalLength: 27, aperture: 4.0 },
      { focalLength: 42, aperture: 4.5 },
      { focalLength: 50, aperture: 5.0 },
      { focalLength: 89, aperture: 5.6 },
      { focalLength: 117, aperture: 6.3 },
      { focalLength: 400, aperture: 6.3 },
    ],
  },
  {
    id: 'canon-rf-100-500mm-f-45-71-l-is-usm',
    name: 'Canon RF 100-500mm f/4.5-7.1 L IS USM',
    format: 'full-frame',
    dataSource: 'ai-research',
    sourceUrl: 'https://www.cameralabs.com/canon-rf-100-500mm-f4-5-7-1l-is-usm-review/',
    data: [
      { focalLength: 100, aperture: 4.5 },
      { focalLength: 151, aperture: 4.5 },
      { focalLength: 152, aperture: 5.0 },
      { focalLength: 254, aperture: 5.0 },
      { focalLength: 255, aperture: 5.6 },
      { focalLength: 363, aperture: 5.6 },
      { focalLength: 364, aperture: 6.3 },
      { focalLength: 472, aperture: 6.3 },
      { focalLength: 473, aperture: 7.1 },
      { focalLength: 500, aperture: 7.1 },
    ],
  },
  {
    id: 'nikon-z-180-600mm-f-56-63-vr-full-frame',
    name: 'Nikon Z 180-600mm f/5.6-6.3 VR Full Frame',
    format: 'full-frame',
    dataSource: 'ai-research',
    sourceUrl: 'https://photographylife.com/reviews/nikon-z-180-600mm-f-5-6-6-3-vr',
    data: [
      { focalLength: 180, aperture: 5.6 },
      { focalLength: 300, aperture: 5.6 },
      { focalLength: 301, aperture: 6.0 },
      { focalLength: 500, aperture: 6.0 },
      { focalLength: 501, aperture: 6.3 },
      { focalLength: 600, aperture: 6.3 },
    ],
  },
  {
    id: 'nikon-af-s-80-400mm-f-45-56g-ed-vr-full-frame',
    name: 'Nikon AF-S 80-400mm f/4.5-5.6G ED VR Full Frame',
    format: 'full-frame',
    dataSource: 'ai-research',
    sourceUrl: 'https://www.pcmag.com/reviews/nikon-af-s-nikkor-80-400mm-f45-56g-ed-vr',
    data: [
      { focalLength: 80, aperture: 4.5 },
      { focalLength: 100, aperture: 4.5 },
      { focalLength: 135, aperture: 5.0 },
      { focalLength: 200, aperture: 5.3 },
      { focalLength: 300, aperture: 5.6 },
      { focalLength: 400, aperture: 5.6 },
    ],
  },
  {
    id: 'canon-rf-100-400mm-f-56-8-is-usm-full-frame',
    name: 'Canon RF 100-400mm f/5.6-8 IS USM Full Frame',
    format: 'full-frame',
    dataSource: 'ai-research',
    sourceUrl: 'https://www.the-digital-picture.com/Reviews/Lens-Specifications.aspx?Lens=1572',
    data: [
      { focalLength: 100, aperture: 5.6 },
      { focalLength: 122, aperture: 5.6 },
      { focalLength: 123, aperture: 6.3 },
      { focalLength: 155, aperture: 6.3 },
      { focalLength: 156, aperture: 7.1 },
      { focalLength: 258, aperture: 7.1 },
      { focalLength: 259, aperture: 8.0 },
      { focalLength: 400, aperture: 8.0 },
    ],
  },
  {
    id: 'sigma-100-400mm-f-5-63-dg-dn-os-contemporary',
    name: 'Sigma 100-400mm f/5-6.3 DG DN OS Contemporary',
    format: 'full-frame',
    dataSource: 'ai-research',
    sourceUrl: 'https://www.the-digital-picture.com/Reviews/Lens-Specifications.aspx?Lens=1536&LensComp=1120',
    data: [
      { focalLength: 100, aperture: 5.0 },
      { focalLength: 112, aperture: 5.0 },
      { focalLength: 113, aperture: 5.6 },
      { focalLength: 234, aperture: 5.6 },
      { focalLength: 235, aperture: 6.3 },
      { focalLength: 400, aperture: 6.3 },
    ],
  },
  {
    id: 'tamron-11-20mm-f-28-di-iii-a-rxd-aps-c',
    name: 'Tamron 11-20mm f/2.8 Di III-A RXD APS-C',
    format: 'apsc',
    dataSource: 'official',
    sourceUrl: 'https://tamron-americas.com/product/11-20mm-f-2-8-di-iii-a-rxd/',
    data: [
      { focalLength: 11, aperture: 2.8 },
      { focalLength: 15, aperture: 2.8 },
      { focalLength: 20, aperture: 2.8 },
    ],
  },
  {
    id: 'sigma-18-50mm-f-28-dc-dn-contemporary-aps-c',
    name: 'Sigma 18-50mm f/2.8 DC DN Contemporary APS-C',
    format: 'apsc',
    dataSource: 'official',
    sourceUrl: 'https://www.sigma-global.com/en/lenses/c021_18_50_28/',
    data: [
      { focalLength: 18, aperture: 2.8 },
      { focalLength: 24, aperture: 2.8 },
      { focalLength: 35, aperture: 2.8 },
      { focalLength: 50, aperture: 2.8 },
    ],
  },
  {
    id: 'canon-ef-70-300mm-f-4-56-is-ii-usm',
    name: 'Canon EF 70-300mm f/4-5.6 IS II USM',
    format: 'full-frame',
    dataSource: 'ai-research',
    sourceUrl: 'https://www.the-digital-picture.com/Reviews/Canon-EF-70-300mm-f-4-5.6-IS-II-USM-Lens.aspx',
    data: [
      { focalLength: 70, aperture: 4.0 },
      { focalLength: 76, aperture: 4.0 },
      { focalLength: 77, aperture: 4.5 },
      { focalLength: 105, aperture: 4.5 },
      { focalLength: 106, aperture: 5.0 },
      { focalLength: 175, aperture: 5.0 },
      { focalLength: 176, aperture: 5.6 },
      { focalLength: 300, aperture: 5.6 },
    ],
  },
  {
    id: 'sony-fe-24-70mm-f-28-gm-ii-full-frame',
    name: 'Sony FE 24-70mm f/2.8 GM II Full Frame',
    format: 'full-frame',
    dataSource: 'official',
    sourceUrl: 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel2470gm2',
    data: [
      { focalLength: 24, aperture: 2.8 },
      { focalLength: 35, aperture: 2.8 },
      { focalLength: 50, aperture: 2.8 },
      { focalLength: 70, aperture: 2.8 },
    ],
  },
  {
    id: 'sony-fe-70-200mm-f-28-gm-oss-full-frame',
    name: 'Sony FE 70-200mm f/2.8 GM OSS Full Frame',
    format: 'full-frame',
    dataSource: 'official',
    sourceUrl: 'https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel70200gm',
    data: [
      { focalLength: 70, aperture: 2.8 },
      { focalLength: 100, aperture: 2.8 },
      { focalLength: 135, aperture: 2.8 },
      { focalLength: 200, aperture: 2.8 },
    ],
  },
  {
    id: 'tamron-70-300mm-f-45-63-di-iii-rxd-full-frame',
    name: 'Tamron 70-300mm f/4.5-6.3 Di III RXD Full Frame',
    format: 'full-frame',
    dataSource: 'ai-research',
    sourceUrl: 'https://www.the-digital-picture.com/Reviews/Tamron-70-300mm-f-4.5-6.3-Di-III-RXD-Lens.aspx',
    data: [
      { focalLength: 70, aperture: 4.5 },
      { focalLength: 109, aperture: 4.5 },
      { focalLength: 110, aperture: 5.0 },
      { focalLength: 151, aperture: 5.0 },
      { focalLength: 152, aperture: 5.6 },
      { focalLength: 240, aperture: 5.6 },
      { focalLength: 241, aperture: 6.3 },
      { focalLength: 300, aperture: 6.3 },
    ],
  },
  {
    id: 'nikkor-z-24-120mm-f-4-s',
    name: 'NIKKOR Z 24-120mm f/4 S',
    format: 'full-frame',
    dataSource: 'official',
    sourceUrl: 'https://www.nikonusa.com/p/nikkor-z-24-120mm-f4-s/20105/overview?srsltid=AfmBOorosLWGe7nYTVDwYejyC4bvzdpiQoCh9t7zi82kXM9I1GC0vIE_#tech-specs',
    data: [
      { focalLength: 24, aperture: 4.0 },
      { focalLength: 35, aperture: 4.0 },
      { focalLength: 50, aperture: 4.0 },
      { focalLength: 70, aperture: 4.0 },
      { focalLength: 85, aperture: 4.0 },
      { focalLength: 105, aperture: 4.0 },
      { focalLength: 120, aperture: 4.0 },
    ],
  },
  {
    id: 'fujifilm-xf-18-135mm-f-35-56-r-lm-ois-wr',
    name: 'Fujifilm XF 18-135mm f/3.5-5.6 R LM OIS WR',
    format: 'apsc',
    dataSource: 'ai-research',
    sourceUrl: 'https://www.imaging-resource.com/lenses/fujinon-xf-18-135mm-f-3-5-5-6-r-lm-ois-wr/',
    data: [
      { focalLength: 18, aperture: 3.5 },
      { focalLength: 23, aperture: 4.0 },
      { focalLength: 35, aperture: 4.3 },
      { focalLength: 55, aperture: 5.0 },
      { focalLength: 70, aperture: 5.3 },
      { focalLength: 135, aperture: 5.6 },
    ],
  },
  {
    id: 'canon-rf-15-35mm-f-28-l-is-usm',
    name: 'Canon RF 15-35mm f/2.8 L IS USM',
    format: 'full-frame',
    dataSource: 'official',
    sourceUrl: 'https://www.usa.canon.com/shop/p/rf15-35mm-f2-8-l-is-usm',
    data: [
      { focalLength: 15, aperture: 2.8 },
      { focalLength: 20, aperture: 2.8 },
      { focalLength: 25, aperture: 2.8 },
      { focalLength: 30, aperture: 2.8 },
      { focalLength: 35, aperture: 2.8 },
    ],
  },
];

// Convert APS-C or M43 lens to equivalent full-frame focal length
export function getEquivalentLens(lens: Lens): Lens {
  let cropFactor = 1;
  if (lens.format === 'apsc') {
    cropFactor = 1.5;
  } else if (lens.format === 'm43') {
    cropFactor = 2;
  }

  if (cropFactor === 1) {
    return lens;
  }

  return {
    ...lens,
    data: lens.data.map((point) => ({
      focalLength: Math.round(point.focalLength * cropFactor),
      aperture: point.aperture * cropFactor,
    })),
  };
}
