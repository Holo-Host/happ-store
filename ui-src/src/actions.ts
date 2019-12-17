// ======================================
//      Type and Action Imports
// ======================================
import { Hash } from '../../holochain'
import store from './store'

import { createAction } from 'typesafe-actions'
import { createHolochainZomeCallAsyncAction } from '@holochain/hc-redux-middleware'
import { AppCreationSpecSnake, App,  } from './types/app'


interface DnaBundle {
    dna_bundle: string,
}

interface UiBundle {
    ui_bundle: string,
}

export const GetManifest = createHolochainZomeCallAsyncAction<
{app_hash: string},
{}
>
(`happ-store`, 'happs', 'generate_manifest')

export const CreateApp = createHolochainZomeCallAsyncAction<
  AppCreationSpecSnake,
  string
>(`happ-store`, 'happs', 'create_app')


export const GetAllApps = createHolochainZomeCallAsyncAction<
  {},
  Array<App>
>(`happ-store`, 'happs', 'get_all_apps')


export const GetApp = createHolochainZomeCallAsyncAction<
  {address: string},
  App
>(`happ-store`, 'happs', 'get_all_apps')


export const Whoami = createHolochainZomeCallAsyncAction<
{},
{hash: string, name: string}
>
(`happ-store`, 'whoami', 'get_user')

export const AddAppToCategory = createHolochainZomeCallAsyncAction<
{app_address: string, category: string},
{}
>
(`happ-store`, 'happs', 'add_app_to_category')

export const AddAppToTag = createHolochainZomeCallAsyncAction<
{app_address: string, category: string},
{}
>
(`happ-store`, 'happs', 'add_app_to_tag')

export const GetAppsByCategory = createHolochainZomeCallAsyncAction<
{app_address: string, category: string},
{}
>
(`happ-store`, 'happs', 'get_apps_by_category')

export const GetAppsByTag = createHolochainZomeCallAsyncAction<
{app_address: string, category: string},
{}
>
(`happ-store`, 'happs', 'get_apps_by_tag')

export const UpvoteApp = createHolochainZomeCallAsyncAction<
{app_address: string},
{}
>
(`happ-store`, 'happs', 'upvote_app')

// create_ratings: {
//     inputs:| rate:String, review:String, reviewed_hash: Address |,
//     outputs: | result: ZomeApiResult<Address> |,
//     handler: ratings::handlers::handle_creating_ratings
// }
// get_ratings: {
//     inputs:| reviewed_hash: Address |,
//     outputs: |result: ZomeApiResult<Vec<GetLinksLoadElement<Ratings>>>|,
//     handler: ratings::handlers::handle_get_reviews_by_hash
// }
export const SetCurrentApp = createAction('SET_CURRENT_APP', resolve => {
  return (currentApp: App) => resolve(currentApp)
})

export const SetConnectionTimeout = createAction('SET_CONNECTION_TIMEOUT', resolve => {
  return () => resolve()
})
