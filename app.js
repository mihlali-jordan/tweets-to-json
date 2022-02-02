const converter = require('json-2-csv')
const axios = require('axios')

const API_URL = 'https://api.twitter.com/2'
const token = process.env.TWITTER_BEARER_TOKEN
const twitter_account_username = 'madewifsupabase'

const Axios = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

async function getUserID(username) {
  const {
    data: {
      data: { id },
    },
  } = await Axios({
    method: 'GET',
    url: `/users/by/username/${username}`,
  })

  return id
}

async function getTweets() {
  const userId = await getUserID(twitter_account_username)
  const { data } = await Axios({
    method: 'GET',
    url: `/users/${userId}/tweets`,
    params: {
      max_results: 100,
      'tweet.fields': 'public_metrics',
      expansions: 'author_id',
    },
  })
  return data
}

async function transformTweets(username) {
  const { data: tweets } = await getTweets()
  const transformedTweets = tweets.map((tweet) => ({
    text: tweet.text,
    like_count: tweet.public_metrics.like_count,
    tweet_url: `https://twitter.com/${username}/status/${tweet.id}`,
  }))

  transformedTweets.sort((a, b) => {
    return b.like_count - a.like_count
  })

  console.log(transformedTweets)
}

// getTweets()
transformTweets(twitter_account_username)