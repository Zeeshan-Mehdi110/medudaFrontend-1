//@ts-nocheck
import ArtistTemplate from "@modules/artist"
import { getRegion } from "app/actions"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Artist",
  description: "Filter Products by Artist",
}

export default async function ArtistPage(params) {
  const { params: nestedParams } = params;
  const { artistId, locale , countryCode } = nestedParams;
  const region = await getRegion(countryCode)
  const actualArtistId = Array.isArray(artistId) ? artistId[0] : artistId;
  return <ArtistTemplate artistId={actualArtistId} countryCode={countryCode} local={locale} region={region} />
}
