use hdk::{
    error::{ZomeApiError, ZomeApiResult},
    holochain_core_types::{
        cas::content::{Address, AddressableContent},
        entry::Entry,
        json::RawString,
    },
    utils, AGENT_ADDRESS,
};

use crate::happs::{self, AppResponse};
use crate::happs::{AppDnaResource, AppUiResource};
/***
Getter Functions
***/

// returns tuple of number of upvotes and if this agent upvoted
fn get_upvotes(app_address: &Address) -> ZomeApiResult<(i32, bool)> {
    let result = hdk::get_links(
        app_address,
        Some("upvote".to_string()),
        Some("".to_string()),
    )?;
    let upvoters = result.addresses();
    Ok((upvoters.len() as i32, upvoters.contains(&AGENT_ADDRESS)))
}

pub fn get_linked_apps(base_addr: &Address, tag: &str) -> ZomeApiResult<Vec<happs::AppResponse>> {
    let addrs = hdk::get_links(base_addr, Some(tag.to_string()), Some("".to_string()))?
        .addresses()
        .clone();

    Ok(addrs
        .into_iter()
        .map(|addr| {
            let (upvotes, upvoted_my_me) = get_upvotes(&addr).unwrap();
            let entry = utils::get_as_type(addr.to_owned()).unwrap();
            happs::AppResponse::new(entry, addr, upvotes as i32, upvoted_my_me)
        })
        .collect())
}

pub fn handle_get_all_apps() -> ZomeApiResult<Vec<happs::AppResponse>> {
    let all_apps_anchor_addr =
        Entry::App("category_anchor".into(), RawString::from("*").into()).address();
    get_linked_apps(&all_apps_anchor_addr, "contains")
}

pub fn handle_get_app(app_hash: Address) -> ZomeApiResult<happs::AppResponse> {
    let (upvotes, upvoted_my_me) = get_upvotes(&app_hash)?;
    let entry = utils::get_as_type(app_hash.clone())?;
    Ok(AppResponse::new(entry, app_hash, upvotes, upvoted_my_me))
}

/*
Functions needed to be handeled by the HCHC
*/
pub fn handle_create_app(
    title: String,
    description: String,
    thumbnail_url: String,
    homepage_url: String,
    dnas: Vec<AppDnaResource>,
    ui: Option<AppUiResource>,
) -> ZomeApiResult<Address> {
    let agent_data: serde_json::Value = serde_json::from_str(&hdk::AGENT_ID_STR.to_string())
        .map_err(|_| ZomeApiError::Internal("Error: Agent string not valid json".to_string()))?;

    let app_entry = Entry::App(
        "app".into(),
        happs::AppEntry {
            title,
            author: agent_data["nick"].as_str().unwrap().into(),
            description,
            thumbnail_url,
            homepage_url,
            dnas,
            ui,
        }
        .into(),
    );
    let app_addr = hdk::commit_entry(&app_entry)?;
    utils::link_entries_bidir(
        &app_addr,
        &hdk::AGENT_ADDRESS,
        "author_is",
        "published",
        "",
        "",
    )?;

    let all_apps_anchor_addr = hdk::commit_entry(&Entry::App(
        "category_anchor".into(),
        RawString::from("*").into(),
    ))?;
    utils::link_entries_bidir(&all_apps_anchor_addr, &app_addr, "contains", "in", "", "")?;

    Ok(app_addr)
}

pub fn handle_upvote_app(app_address: Address) -> ZomeApiResult<Address> {
    hdk::link_entries(&app_address, &AGENT_ADDRESS, "upvote", "")?;
    Ok(app_address)
}
