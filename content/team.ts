/**
 * The one photo for the support section of Home (SupportTeam): an atmosphere image, never a named person (owner, 2026-10-10).
 * No names, no roles, no captions that present the people in it as DronaHost staff. Prefer imagery without identifiable faces
 * (hands on a keyboard, a headset on a desk, a softly blurred workspace): a recognisable stock face beside "real people"
 * reads as our team, and buyers check. Use only a photo you have a commercial licence for (and a model release when a person
 * can be recognised). Decorative: it carries an empty alt text.
 *
 * Put the file in public/images/support/ (at least 1200 px wide, landscape or 4:5). While this is null, the section shows its
 * illustration of a ticket answered in writing.
 */
export type SupportPhoto = {
  src: `/images/support/${string}`;
  width: number;
  height: number;
  /** Where the licence is recorded, for example "Stock licence #12345, bought 2026-10-12". */
  licence: string;
};

export const SUPPORT_PHOTO: SupportPhoto | null = null;
