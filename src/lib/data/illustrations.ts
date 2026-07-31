export type Illustration = {
  slug: string;
  caption: string;
  hue: number;
  // Intrinsic pixel size of the actual image file — lets the masonry
  // gallery size each tile by its real aspect ratio instead of a
  // fixed, hand-picked height.
  width: number;
  height: number;
  // Path under /public, e.g. "/illustrations/sketch-041.jpg". Omit to
  // fall back to the generated placeholder gradient.
  image?: string;
};

export const ILLUSTRATIONS: Illustration[] = [
  { slug: "beautifultree", caption: "beautifultree.png", hue: 140, width: 2034, height: 2994, image: "/illustrations/beautifultree.png" },
  { slug: "moustache", caption: "moustache.png", hue: 30, width: 3816, height: 3816, image: "/illustrations/moustache.png" },
  { slug: "me2", caption: "me2.png", hue: 200, width: 3600, height: 4200, image: "/illustrations/me2.png" },
  { slug: "hole2", caption: "hole2.png", hue: 260, width: 1399, height: 1560, image: "/illustrations/hole2.png" },
  { slug: "bignosedwomen", caption: "bignosedwomen.png", hue: 10, width: 1743, height: 1743, image: "/illustrations/bignosedwomen.png" },
  { slug: "paintprogv3-copy", caption: "paintprogv3 - Copy.png", hue: 320, width: 1471, height: 1628, image: "/illustrations/paintprogv3%20-%20Copy.png" },
  { slug: "paintprogressv4", caption: "paintprogressv4.png", hue: 90, width: 1418, height: 1938, image: "/illustrations/paintprogressv4.png" },
  { slug: "magic", caption: "magic.png", hue: 280, width: 1423, height: 1423, image: "/illustrations/magic.png" },
  { slug: "himaltcolors", caption: "himaltcolors.png", hue: 45, width: 1449, height: 1532, image: "/illustrations/himaltcolors.png" },
  { slug: "himaltcolors-copy", caption: "himaltcolors - Copy.png", hue: 45, width: 1459, height: 1836, image: "/illustrations/himaltcolors%20-%20Copy.png" },
  { slug: "prettyher", caption: "prettyher.png", hue: 340, width: 983, height: 1654, image: "/illustrations/prettyher.png" },
  { slug: "some-ladies", caption: "some_ladies.png", hue: 190, width: 1175, height: 1175, image: "/illustrations/some_ladies.png" },
  { slug: "some-ladies-copy", caption: "some_ladies - Copy.png", hue: 190, width: 1196, height: 1196, image: "/illustrations/some_ladies%20-%20Copy.png" },
  { slug: "grace", caption: "grace.png", hue: 220, width: 2344, height: 2930, image: "/illustrations/grace.png" },
  { slug: "paint-pracc", caption: "paint pracc.png", hue: 70, width: 2150, height: 2150, image: "/illustrations/paint%20pracc.png" },
  { slug: "moreposing-copy", caption: "moreposing - Copy.png", hue: 300, width: 2364, height: 1965, image: "/illustrations/moreposing%20-%20Copy.png" },
  { slug: "tomato-copy", caption: "tomato - Copy.png", hue: 15, width: 1228, height: 1637, image: "/illustrations/tomato%20-%20Copy.png" },
  { slug: "paintinggg-copy", caption: "paintinggg - Copy.png", hue: 250, width: 1282, height: 1928, image: "/illustrations/paintinggg%20-%20Copy.png" },
  { slug: "ladiezs-copy-2", caption: "ladiezs - Copy (2).png", hue: 160, width: 1983, height: 2644, image: "/illustrations/ladiezs%20-%20Copy%20(2).png" },
];
