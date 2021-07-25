const axios = require('axios').default
const { firstBy } = require('thenby')
const notifier = require('node-notifier')
const cheerio = require('cheerio')
const open = require('open')

const doctolibApi = require('./doctolib-api')

const myPosition = { lat: 43.6304129, lng: 3.9002208 } // montpellier
const radiusAroundMe = 12 // km
// const minDate = '2021-08-01T00:00:00.000+02:00'
const minDate = '2021-08-06'

main()

async function main () {
  let found = false
  while (!found) {
    found = await tryToFindSlot()
    if (!found) {
      await sleep(5_000)
    }
  }
}

async function tryToFindSlot () {
  const searchResultIds = await listSearchResults()

  const slots = await fetchGoodSlots(searchResultIds)

  const date = new Date().toISOString().slice(11,19)
  console.log(`${date} - Found ${slots.length} slots`)

  if (slots.length === 0) {
    return false
  }

  console.log('Success !')
  console.log(slots)

  slots.forEach(slot => {
    const date = slot.date.slice(0, 10)
    notifier.notify({
      title: 'VACCIN TROUVÉ !',
      message: `Le ${date} à ${slot.city}`
    })
  })

  open(slots[0].url)

  return true
}

// [...document.querySelectorAll('.dl-search-result')].map(node => node.id).map(id => /search-result-(?<id>.*)/.exec(id)?.groups.id)
async function listSearchResults () {
  const searchResultsOnPage = await Promise.all([1, 2, 3].map(i => listSearchResultsOnPage(i)))

  return searchResultsOnPage.flat()
}

async function listSearchResultsOnPage (page) {
  const url = `https://www.doctolib.fr/vaccination-covid-19/castelnau-le-lez?page=${page}&ref_visit_motive_ids[]=6970&ref_visit_motive_ids[]=7005&ref_visit_motive_ids[]=8740&ref_visit_motive_ids[]=8739`

  const response = await axios.get(url)

  const html = response.data

  const $ = cheerio.load(html)

  const searchResultNodes = $('.dl-search-result').toArray()

  const goodSearchResultNodes = searchResultNodes.filter(node => {
    const lat = parseFloat(node.attribs['data-lat'])
    const lng = parseFloat(node.attribs['data-lng'])
    return gpsDistance(lat, lng, myPosition.lat, myPosition.lng) <= radiusAroundMe
  })

  const searchResultIds = goodSearchResultNodes
    .map(node => node.attribs.id)
    .map(id => /search-result-(?<id>.*)/.exec(id)?.groups.id)
  
  return searchResultIds
}

async function fetchGoodSlots (searchResultIds) {
  const results = await Promise.allSettled(searchResultIds.map(id =>
    doctolibApi.getSearchResultResponse(id)
  ))

  /**
   * @type {doctolibApi.SearchResultResponse[]}
   */
  const searchResultResponses = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value)

  // console.log('searchResultResponses:', searchResultResponses.length)
  
  const errors = results
    .filter(r => r.status === 'rejected')
    .map(r => r.reason)
  
  if (errors.length > 0) {
    errors.forEach(e => console.error(e))
  }

  const results2 = await Promise.allSettled(
    searchResultResponses
      .map(async ({ search_result }) => {
        const { availabilities } = await doctolibApi.getAvailabilitiesResponse(minDate, search_result.agenda_ids)

        // console.log(availabilities.length, 'availabilities')

        const dates = availabilities
          .flatMap(o => o.slots)
          // .map(slot => slot.start_date)

        return dates.map(date => ({ date, search_result })) 
      })
  )

  /**
   * @type {{ date: string, search_result: doctolibApi.SearchResult }[]}
   */
   const slots = results2
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)
  
  const errors2 = results2
    .filter(r => r.status === 'rejected')
    .map(r => r.reason)
  
  if (errors2.length > 0) {
    errors2.forEach(e => console.error(e))
  }

  const goodSlots = slots
    .sort(firstBy('date'))
    .map(({ date, search_result }) => ({
      date,
      url: 'https://www.doctolib.fr' + search_result.link,
      zipcode: search_result.zipcode,
      city: search_result.city
    }))

  return goodSlots
}

// UTILS

function toRad (value) {
  return (value * Math.PI) / 180
}

function gpsDistance (latA, lngA, latB, lngB) {
  latA = toRad(latA)
  latB = toRad(latB)
  lngA = toRad(lngA)
  lngB = toRad(lngB)
  const earthRadius = 6371
  return earthRadius * Math.acos(Math.sin(latA) * Math.sin(latB) + Math.cos(latA) * Math.cos(latB) * Math.cos(lngB - lngA))
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
