#![feature(try_from)]
#[macro_use]
extern crate hdk;
extern crate serde;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate holochain_core_types_derive;

use hdk::{
    error::ZomeApiResult,
    holochain_core_types::{cas::content::Address, error::HolochainError, json::JsonString},
};

mod categories;
mod happs;
mod ratings;

use crate::happs::AppResponse;
use crate::happs::{AppDnaResource, AppUiResource};
use crate::ratings::Ratings;

define_zome! {
    entries: [
        happs::app_definitions(),
        ratings::rating_definition(),
        categories::category_anchor_entry(),
        categories::tag_anchor_entry()
    ]

    genesis: || { Ok(()) }

    functions: [
        create_app: {
            inputs:| title: String, description: String, thumbnail_url: String, homepage_url: String, dnas: Vec<AppDnaResource>, ui: Option<AppUiResource> |,
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
    ]

    traits: {
        hc_public [get_apps_by_tag, get_apps_by_category, add_app_to_tag, add_app_to_category, get_ratings, create_ratings, get_app, get_all_apps, create_app, upvote_app]
    }
}
