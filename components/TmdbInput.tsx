import React, { useState, useCallback } from 'react'
import { TextInput, Button, Flex, Box } from '@sanity/ui'
import { set, unset, useClient, useFormValue } from 'sanity'

export const TmdbInput = (props: any) => {
  const { value, onChange } = props
  const [loading, setLoading] = useState(false)
  
  const documentId = useFormValue(['_id']) as string
  const client = useClient({ apiVersion: '2021-06-07' })

  // Yahan SANITY_STUDIO_ prefix add kiya gaya hai API key ko theek se read karne ke liye
  const TMDB_API_KEY = process.env.SANITY_STUDIO_TMDB_API_KEY

  const fetchMovieData = useCallback(async () => {
    if (!value) return
    setLoading(true)
    
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${SANITY_STUDIO_TMDB_API_KEY}&query=${value}`)
      const data = await res.json()

      if (data.results && data.results.length > 0) {
        const movie = data.results[0]
        
        const docId = documentId?.replace('drafts.', '') || documentId

        await client.patch(docId)
          .set({
            overview: movie.overview,
            releaseDate: movie.release_date,
          })
          .commit()

        alert('Details successfully aa gayi hain!')
      } else {
        alert('Is naam ki koi movie nahi mili!')
      }
    } catch (err) {
      console.error(err)
      alert('Details laane mein error aaya.')
    } finally {
      setLoading(false)
    }
  }, [value, client, documentId])

  return (
    <Flex gap={3} align="center">
      <Box flex={1}>
        <TextInput
          value={value || ''}
          onChange={(event) => onChange(event.currentTarget.value ? set(event.currentTarget.value) : unset())}
          placeholder="Movie ka naam likho..."
        />
      </Box>
      <Button
        mode="ghost"
        text={loading ? 'Searching...' : 'Fetch TMDb Details'}
        onClick={fetchMovieData}
        disabled={loading || !value}
      />
    </Flex>
  )
}
