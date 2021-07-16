const axios = require('axios').default
const { firstBy } = require('thenby')
const notifier = require('node-notifier')
const cheerio = require('cheerio')

main()

async function main () {
  let interval

  async function tick () {
    const found = await tryToFindSlot()
    if (found) {
      clearInterval(interval)
    }
  }

  tick()

  interval = setInterval(tick, 30_000)
}

// [...document.querySelectorAll('.dl-search-result')].map(node => node.id).map(id => /search-result-(?<id>.*)/.exec(id)?.groups.id)
async function listSearchResults () {
  const searchResultsOnPage = await Promise.all([1, 2, 3].map(i => listSearchResultsOnPage(i)))

  return searchResultsOnPage.flat()
}

async function listSearchResultsOnPage (page) {
  const url = `https://www.doctolib.fr/vaccination-covid-19/strasbourg?page=${page}&ref_visit_motive_id=6970&ref_visit_motive_ids%5B%5D=6970&ref_visit_motive_ids%5B%5D=7005&ref_visit_motive_ids%5B%5D=8740&ref_visit_motive_ids%5B%5D=8739`

  const response = await axios.get(url)

  const html = response.data

  const $ = cheerio.load(html)

  const searchResultIds = $('.dl-search-result')
    .toArray()
    .map(node => node.attribs.id)
    .map(id => /search-result-(?<id>.*)/.exec(id)?.groups.id)
  
  return searchResultIds
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
      message: `Le ${date} à ${slot.city}`,
      open: slot.url
    })
  })
  return true
}

async function fetchGoodSlots (searchResultIds) {
  const results = await Promise.allSettled(searchResultIds.map(id => fetchSlotsById(id)))

  const slots = results
    .filter(r => r.status === "fulfilled")
    .flatMap(r => r.value)
    .filter(({ date, search_result }) => !['Haguenau', 'Montswiller'].includes(search_result.city))
    .sort(firstBy('slot'))
    .map(({ date, search_result }) => ({
      date,
      url: 'https://www.doctolib.fr' + search_result.link,
      zipcode: search_result.zipcode,
      city: search_result.city
    }))
  
  const errors = results
    .filter(r => r.status === 'rejected')
    .map(r => r.reason)
  
  if (errors.length > 0) {
    errors.forEach(e => console.error(e))
  }

  return slots
}

async function fetchSlotsById(searchResultId) {
  const url = `https://www.doctolib.fr/search_results/${searchResultId}.json?limit=7&ref_visit_motive_id=6970&ref_visit_motive_ids%5B%5D=6970&ref_visit_motive_ids%5B%5D=7005&speciality_id=5494&search_result_format=json`
  // const url = 'https://www.doctolib.fr/search_results/3006785.json?limit=7&ref_visit_motive_id=6970&ref_visit_motive_ids%5B%5D=6970&ref_visit_motive_ids%5B%5D=7005&speciality_id=5494&search_result_format=json'

  const response = await axios.get(url, {
    "headers": {
      "accept": "application/json",
      "accept-language": "fr,en;q=0.9,en-US;q=0.8",
      "content-type": "application/json; charset=utf-8",
      "if-none-match": "W/\"0df28c841e4bb9124006f9d8ebd94717\"",
      "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-csrf-token": "u5JeiRI2hv56QgXw70CW2S0K94lMuwoPjHBmiP2odCtvMetvfzCUoIfJipvIGUdJPrj1q19To5XBWOWbMNLXmQ==",
      "cookie": "ssid=c890438990lin-Mso0BZx20z9D; esid=BaTvvT8Ky5g3h_OlQobsLtnY; didomi_token=eyJ1c2VyX2lkIjoiMTc4NmExNmMtMzUzMC02ZWI1LTgwZWMtMmJiYmE4MmYxMGZiIiwiY3JlYXRlZCI6IjIwMjEtMDMtMjVUMTU6NTM6MDAuMDY1WiIsInVwZGF0ZWQiOiIyMDIxLTAzLTI1VDE1OjU0OjU4LjA1MFoiLCJ2ZW5kb3JzIjp7ImVuYWJsZWQiOlsiYzpnb29nbGVhbmEtS0ZLenBXamIiLCJjOmRvY3RvbGliLWl3WEJoV2NwIiwiYzpnb29nbGVhZHMtNk5hODZqbnEiLCJjOmNsb3VkZmxhcmUtbVlZRk1ZTlQiLCJjOmRvdWJsZWNsaWMtcjYyMzhnYTkiXX0sInB1cnBvc2VzIjp7ImVuYWJsZWQiOlsibWVzdXJlZGEtREVUUXo2N0EiLCJtYXJrZXRpbmctSkxScWJ0RzgiLCJwdWJsaWNpdGUtQ2pXcVdhWjIiXX0sInZlcnNpb24iOjF9; euconsent=BPDnvKYPDnvc0AHABBFRDWAAAAAyOAAA; _ga=GA1.2.209687280.1616687698; __cf_bm=64831a857f602a0b98e71c182c21a8da4f5463c4-1626426114-1800-AZdAyanvjjPMM8ieyeBCi3vG7Ttt1XNiR8Wl1BVQ7LhsUpRgdaLnZ6IGGaC23X9/j0PppzLdYs4CEeDywl3277U=; __cfwaitingroom=ChhpWDAzTTFyZ25NY2ErVjd3Zy85dGZRPT0S1AFWSVVaVHVnZ2k1VHpRQ3p6Smxxc0pKSXZoOU9tYmdPMk1Zc0VvcERJNEhxcCt2TnJxWUdCZWxiZW9tNkFiNFA5UHhaSUI0TnBURGUrLzYzVXBZVHdDTmV3cGNwSWRYaFBHTVFiQk1lMGlDOG1MdG9ab1hUVXNBQUVnTGVjTU4zMG45cEptc3BPeStveUptdmZuRVVZWlExRS9rQVBEa25taVg0L3AwMGZCaHZmTW1wN2JTa0QvcWFSSFh3RzBQRUl0MjkvSEhSUnFjdmNqNXVKanVIeg%3D%3D; utm_b2b=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaWwxZEcxZmMyOTFjbU5sUFdkdmIyZHNaU1oxZEcxZmJXVmthWFZ0UFc5eVoyRnVhV01HT2daRlZBPT0iLCJleHAiOiIyMDIxLTA3LTE2VDA5OjM4OjEwLjk5OFoiLCJwdXIiOiJjb29raWUudXRtX2IyYiJ9fQ%3D%3D--ea8326476dd65a70bcaa88dbb5cb7703fa8eaa81; _doctolib_session=LuCHaY382fTGSaAGpEd3slYFwZZuOlbsPU1gv2Cq9u9z0MA6X9jpOPa1UeYfiUxrhKRQQPts%2BWJ4QYXQsdsTy0vTVEsw2xDqLitSsGxCFeWpCxf2wBlSWXnm%2FHkM4H%2F8ykkE%2FdsjLzjqG6VNMv35mYQhk0kV5qedkbnuYqo4kfOQUp5RCflmOCuWfP2ZMGQIjDL6PF4oOWleFehXUBaOh033GO74wqqwTyPyhXf%2B2Pt2Cn%2FSMOMXkcA7dA%2ByQ23mTwhoHt6CFz6K%2FAyDCDkyeXg%2BuJ3MDAJMHp4aE3ZCjeE43Rpr7HTOAefsrmJ3PT71JqAAC499N8WMVNyC79ORpdSEXY%2BJCi%2BsgOsZWzE6tJlM3EU7wGmbbhNSWNhEh%2BVjiUHrzzIv1%2FT9DToUixAUbHXmnulBzMYaxWCbe4Exz64hs6b5u2JInxkK7Uo40teAvLafTtPeQQIbtfgPYSpo--M3dacrLm7zTDupVy--BMZ03Ddd9PNiT%2FbkEtJucQ%3D%3D"
    }
    // "referrer": "https://www.doctolib.fr/vaccination-covid-19/strasbourg?page=3&ref_visit_motive_id=6970&ref_visit_motive_ids%5B%5D=6970&ref_visit_motive_ids%5B%5D=7005",
    // "referrerPolicy": "origin-when-cross-origin",
    // "mode": "cors"
  })

  // console.log(response.status, response.data)

  const dates = response.data.availabilities.flatMap(o => o.slots).map(slot => slot.start_date)
  const search_result = response.data.search_result

  return dates.map(date => ({ date, search_result }))
}
