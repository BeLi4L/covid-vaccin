const axios = require('axios').default

/**
 * @type {(id: string) => Promise<SearchResultResponse>}
 */
async function getSearchResultResponse (searchResultId) {
  const url = `https://www.doctolib.fr/search_results/${searchResultId}.json?limit=7&ref_visit_motive_id=6970&ref_visit_motive_ids%5B%5D=6970&ref_visit_motive_ids%5B%5D=7005&speciality_id=5494&search_result_format=json`

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
  })
  return response.data
}

/**
 * @type {(startDate: string, agendaIds: number[]) => Promise<AvailabilitiesResponse>}
 */
 async function getAvailabilitiesResponse (startDate, agendaIds) {
  const url = `https://www.doctolib.fr/availabilities.json?start_date=${startDate}&visit_motive_ids=2533890&agenda_ids=${agendaIds.join('-')}&limit=7`

  const response = await axios.get(url, {
    "headers": {
      "accept": "application/json",
      "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
      "content-type": "application/json; charset=utf-8",
      "sec-ch-ua": "\"Chromium\";v=\"92\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"92\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-csrf-token": "J/sJ6wXcunghdwKJBhPZO5NUCkcDgW5RSqhoQufSWAuwUwWQYYaM6jiZ2Z5CFyQ8rZJEbx/qqCpLm/4XORB1hw==",
      "cookie": "ssid=c8804324182lin-RLT4Mg--KzVJ; esid=iSaj5ozTMBk3EVYaNJzQo7Tf; _ga=GA1.2.805815008.1613923356; __cf_bm=92bf7c06479dfd3a692ca62a3204e9822ef8a733-1627241222-1800-Ae596n3loV+TSNbK7SqfskdBIyznBn270aQXR9g07upFn8jzRpeC82ZTahm7ZUB7zNsxzZdIu9w1SmcNdiTVw4A=; utm_b2b=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaUoxZEcxZmMyOTFjbU5sUFdScGNtVmpkQ1oxZEcxZmJXVmthWFZ0UFFZNkJrVlUiLCJleHAiOiIyMDIxLTA3LTI1VDE5OjU4OjIxLjE1N1oiLCJwdXIiOiJjb29raWUudXRtX2IyYiJ9fQ%3D%3D--70416c33a26cb5d57b23d3db970219f1aa649430; _doctolib_session=MNwmKjALWkmSxikf3ypSjI20UWkVIgDV7itkXlshXxhDa4sAZUC%2B3cT5JRvz6ZVGXpZJPeXpJjCGlIdZLe3V5zaEME%2FQ6XA7iVi1eOWSKBzWf%2B0xIVbc2alDFNVBRDkMQ4ykojCEwyNAgCj7uvXseO22530iafy7DVMUV28cTb7PgjM%2B0Y4X84MLFOjkiAVhEZhxGAgFScEsWz2UPHOSdu01BtgVxyV5vE1rjRNFb8VXIQqR9X94ICgDeq1AL3CK7q4PsIiPW0YoH98ZzvsNczwSK85CLpnTYsUg4cJ%2BcFVXpuE1Sqsz3jQFLcrCE59KiLpWpw%2BeKwc9OmsnRrK0DeZxMPqybNt5EwNkmbWpbxlX2knBS%2FfVguBI%2BrT%2FjC0%3D--jefE7K%2B%2Bv%2FD%2FDJOX--cy2nSlHP5vrekK7VaH7oMg%3D%3D; __cfwaitingroom=ChhpeGVTeFNtbjRjeWZYMVdxTERnSmF3PT0ShAJ0aTEraU10VEJwaTRHcG8wMEswK2ZVeDlIR1JTano2emdGcXIyanVRQ0RNc2ppWUVzVHpHcnJGdXUwT3liNmVNUTVBY2YxVjU3SnVydm9RS2NLb01ISFgxNmxkYm5mcHRjUkNjTFZ2dXYwQ2djcnowbUo2TTBTak02RFJEcEkzS21pLzNldXFTaitnQzlXblhRdnVFWHBMUFYrSTNxeVJwZktoYURoM0NhcllPSDFodGdyN1dOMkRZNXo4ZlN5eldYa2VuSmhmNkJPT1RUTGRpMHQwYU9QQllqYVRGNFpJdXBKRU1Rb3ZvejJ3cVhzOXFrU2ZXRnJFZ2JzdkNBN3VkTXc9PQ%3D%3D"
    }
  })
  return response.data
}

module.exports = {
  getSearchResultResponse,
  getAvailabilitiesResponse
}
