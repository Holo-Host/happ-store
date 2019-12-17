#[macro_use]
extern crate hdk;
extern crate serde;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate holochain_json_derive;

use hdk::{
    error::ZomeApiResult,
    holochain_json_api::{error::JsonError, json::JsonString},
    holochain_persistence_api::{cas::content::Address, hash::HashString},
};

mod categories;
mod happs;
mod ratings;

use crate::happs::AppResource;
use crate::happs::AppResponse;
use crate::ratings::Ratings;

define_zome! {
    entries: [
        happs::app_definitions(),
        ratings::rating_definition(),
        categories::category_anchor_entry(),
        categories::tag_anchor_entry()
    ]

    init: || { Ok(()) }

    validate_agent: |validation_data : EntryValidationData::<AgentId>| {
        Ok(())
    }

    functions: [
        create_app: {
            inputs:| title: String, description: String, thumbnail_url: String, homepage_url: String, dnas: Vec<AppResource>, ui: AppResource |,
            outputs: |result: ZomeApiResult<Address>|,
            handler: happs::handlers::handle_create_app
        }
        get_all_apps: {
            inputs:| |,
            outputs: |result: ZomeApiResult<Vec<AppResponse>>|,
            handler: happs::handlers::handle_get_all_apps
        }
        get_app: {
            inputs:|app_hash: Address|,
            outputs: |result: ZomeApiResult<AppResponse>|,
            handler: happs::handlers::handle_get_app
        }
        upvote_app: {
            inputs:|app_address: Address|,
            outputs: |result: ZomeApiResult<Address>|,
            handler: happs::handlers::handle_upvote_app
        }
        create_ratings: {
            inputs:| rate:String, review:String, reviewed_hash: Address |,
            outputs: | result: ZomeApiResult<Address> |,
            handler: ratings::handlers::handle_creating_ratings
        }
        get_ratings: {
            inputs:| reviewed_hash: Address |,
            outputs: |result: ZomeApiResult<Vec<Ratings>>|,
            handler: ratings::handlers::handle_get_reviews_by_hash
        }
        add_app_to_category: {
            inputs:|app_address: Address, category: String|,
            outputs: | result: ZomeApiResult<()> |,
            handler: categories::handlers::handle_add_app_to_category
        }
        add_app_to_tag: {
            inputs:|app_address: Address, tag: String|,
            outputs: | result: ZomeApiResult<()> |,
            handler: categories::handlers::handle_add_app_to_tag
        }
        get_apps_by_category: {
            inputs:|category: String|,
            outputs: |result: ZomeApiResult<Vec<AppResponse>>|,
            handler: categories::handlers::handle_get_apps_by_category
        }
        get_apps_by_tag: {
            inputs:|tag: String|,
            outputs: |result: ZomeApiResult<Vec<AppResponse>>|,
            handler: categories::handlers::handle_get_apps_by_tag
        }
        generate_manifest: {
            inputs:|app_hash: HashString|,
            outputs: |result: ZomeApiResult<happs::utils::Manifest>|,
            handler: happs::utils::generate_manifest
        }
    ]

    traits: {
        hc_public [get_apps_by_tag, get_apps_by_category, add_app_to_tag, add_app_to_category, get_ratings, create_ratings, get_app, get_all_apps, create_app, upvote_app, generate_manifest]
    }
}
