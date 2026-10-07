# Image prompts: Higgsfield (signature cocktail stills)

Status (2026-10-07): **waiting for the Higgsfield API key** (add `HIGGSFIELD_API_KEY` and, if the
dashboard gives one, `HIGGSFIELD_API_SECRET` to `Projects\Random Convos\env.local`).

## Why only these
Real photos cover the venue, the mural, the storefront, coffee and the Drunk Monkey (all from the
bar's own Instagram + the owner's Google photo). Only four signature cocktails have no real photo, so
they currently show 70s "poster art" in their brand colours. Generate **drinks only**, never the venue,
people or the logo. Two of 14 Google reviews already mock the "AI logo", so anything generated must
read as a real photo taken at this bar, or it should not ship.

## Output contract
- Save to `assets-src/generated/cocktail-<id>.jpg` (ids below), portrait **3:4**, at least 1440 px tall.
- Then run `npm run images && npm run build`. `scripts/build-images.mjs` picks the files up
  automatically and the Signature cards switch from poster art to the photo. No code changes needed.

## Global style block (prepend to every prompt)
Photorealistic editorial drink photograph, shot on a full-frame camera with a 50mm lens at f/2.8,
natural warm evening light from a window on the left plus a soft amber pendant lamp, shallow depth of
field. The glass stands on a warm oak bar counter; behind it, out of focus, a forest-green vertically
slatted bar front with a thin warm LED strip, and a few blurred liquor bottles. Real condensation, real
ice with imperfections, true-to-life liquid colour and refraction. Vertical 3:4 composition, drink
centred slightly low, generous headroom. No text, no logos, no labels, no people, no hands, no props
that are not listed. Not a 3D render, not illustration, no oversaturation, no glow effects.

## Prompts

### cocktail-parrots-kiss
Parrot's Kiss (vodka, mango, lime, ginger beer). A tall highball glass with a sunset-orange mango drink
fading to pale gold at the top from the ginger beer, fine bubbles rising, plenty of clear ice. Garnish:
a thin lime wheel on the rim and a small fan of mango slices on a bamboo pick.

### cocktail-mamacita
Mamacita (vodka, strawberry, coconut, lime, blueberry). A coupe or short tumbler with a creamy pastel
pink drink (strawberry and coconut) with a subtle purple swirl from blueberries near the bottom.
Garnish: three fresh blueberries on a pick and half a fresh strawberry on the rim, a light dusting of
toasted coconut on part of the rim.

### cocktail-forest-animal
Forest Animal (vodka, passion fruit, berries, lemon, soda water, vanilla). A tall glass with a deep
berry-red drink lightened toward the top by soda, fine bubbles, crushed ice. Garnish: half a passion
fruit with visible seeds floating on top and a small cluster of mixed berries (raspberry, blackberry)
on a pick. Moodier, slightly darker frame than the others.

### cocktail-tropical-mirage
Tropical Mirage (tequila, passion fruit, lime, agave, pineapple, soda water, tabasco). A rocks or
highball glass with a bright golden-orange drink, a faint red tabasco drop dispersing near the surface,
clear ice. Garnish: a pineapple leaf standing upright, a lime wedge and a thin slice of red chilli on
the rim.

## Review checklist before shipping a still
- Looks like the same bar in every shot (green slats, oak counter, warm light), same grade.
- Ingredients and colours match the printed menu; no garnish that is not plausible for the recipe.
- Hands, faces, text, logos: none. Glass edges and ice look physically right at 100% zoom.
- If any still looks generated at a glance, keep the poster art for that drink instead.
