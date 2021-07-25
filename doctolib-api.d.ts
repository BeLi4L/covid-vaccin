export function getSearchResultResponse (searchResultId: string): Promise<SearchResultResponse>
export function getAvailabilitiesResponse (startDate: string, agendaIds: number[]): Promise<AvailabilitiesResponse>

interface SearchResultResponse {
  total: number
  availabilities: Availability[]
  /**
   * e.g. "2021-08-05"
   */
  next_slot?: string
  /**
   * e.g. "2021-08-05T09:40:00.000+02:00"
   */
  next_slot_datetime?: string
  search_result: SearchResult
}

interface AvailabilitiesResponse {
  total: number
  availabilities: Availability[]
}

interface Availability {
  date: string
  slots: Slot[]
  substitution: any
}

interface Slot {
  agenda_id: number
  start_date: number
  end_date: number
  steps: Step[]
}

interface Step {
  agenda_id: number
  practitioner_agenda_id: number
  start_date: string
  end_date: string
  visit_motive_id: number
}

interface SearchResult {
  id: number
  is_directory: boolean
  address: string
  city: string
  zipcode: string
  link: string
  cloudinary_public_id: string
  profile_id: number
  exact_match: any
  priority_speciality: boolean
  first_name: any
  last_name: string
  name_with_title: string
  speciality: any
  organization_status: string
  top_specialities: string[]
  regulation_sector_type: any
  position: {
    lat: number
    lng: number
  }
  distance: any
  place_id: any
  telehealth: boolean
  visit_motive_id: number
  visit_motive_name: string
  agenda_ids: number[]
  landline_number: string
  booking_temporary_disabled: boolean
  resetVisitMotive: boolean
  toFinalizeStep: boolean
  toFinalizeStepWithoutState: boolean
  covid_vaccines: string[]
  url: string
}
