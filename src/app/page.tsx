'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const wordsToHide = ['DOG', 'CAT', 'BIRD', 'FISH', 'LION']

const generateRandomString = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return Array(length).fill(null).map(() => characters.charAt(Math.floor(Math.random() * characters.length))).join('')
}

const insertWordsRandomly = (baseString: string, words: string[]) => {
  let result = baseString
  words.forEach(word => {
    const insertIndex = Math.floor(Math.random() * (result.length - word.length))
    result = result.slice(0, insertIndex) + word + result.slice(insertIndex + word.length)
  })
  return result
}

export default function HiddenWordFinder() {
  const [randomString, setRandomString] = useState('')
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set())
  const [input, setInput] = useState('')
  const [message, setMessage] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)

  useEffect(() => {
    startNewGame()
  }, [])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (foundWords.size < wordsToHide.length) {
      setMessage('Time\'s up! Game over.')
    }
  }, [timeLeft, foundWords])

  const startNewGame = () => {
    const baseString = generateRandomString(50)
    setRandomString(insertWordsRandomly(baseString, wordsToHide))
    setFoundWords(new Set())
    setInput('')
    setMessage('')
    setTimeLeft(60)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const word = input.toUpperCase()
    if (wordsToHide.includes(word) && !foundWords.has(word)) {
      setFoundWords(new Set(foundWords).add(word))
      setMessage(`Great! You found "${word}"`)
      setInput('')
      if (foundWords.size + 1 === wordsToHide.length) {
        setMessage('Congratulations! You found all the words!')
      }
    } else if (foundWords.has(word)) {
      setMessage('You already found this word')
    } else {
      setMessage('Sorry, that word is not in the list')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-20">
      <CardHeader>
        <CardTitle>Hidden Word Finder</CardTitle>
        <CardDescription>Find the hidden words in the random string of letters!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Badge variant="secondary">Found: {foundWords.size}/{wordsToHide.length}</Badge>
          <Badge variant="secondary">Time: {timeLeft}s</Badge>
        </div>
        <div className="p-4 bg-muted rounded-lg mb-4 text-center break-all">
          {randomString}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Enter word"
            disabled={timeLeft === 0 || foundWords.size === wordsToHide.length}
          />
          <Button type="submit" disabled={timeLeft === 0 || foundWords.size === wordsToHide.length}>
            Submit
          </Button>
        </form>
        {message && <p className="mt-2 text-center text-sm">{message}</p>}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={startNewGame}>New Game</Button>
      </CardFooter>
    </Card>
  )
}