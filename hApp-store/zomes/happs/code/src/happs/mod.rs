use hdk::{
    self,
    entry_definition::ValidatingEntryType,
    holochain_core_types::dna::entry_types::Sharing,
    holochain_json_api::{error::JsonError, json::JsonString},
    holochain_persistence_api::{cas::content::Address, hash::HashString},
};

pub mod handlers;
pub mod utils;
pub use handlers::get_linked_apps;

#[derive(Serialize, Deserialize, Debug, Clone, DefaultJson)]
pub struct AppResource {
    pub location: String,
    pub hash: HashString,
    pub handle: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, DefaultJson)]
#[serde(rename_all = "camelCase")]
pub struct AppEntry {
    pub title: String,
    pub author: String,
    pub description: String,
    pub thumbnail_url: String,
    pub homepage_url: String,
    pub dnas: Vec<AppResource>,
    pub ui: AppResource,
}

#[derive(Serialize, Deserialize, Debug, Clone, DefaultJson)]
#[serde(rename_all = "camelCase")]
pub struct AppResponse {
    pub address: Address,
    pub app_entry: AppEntry,
    pub upvotes: i32,
    pub upvoted_by_me: bool,
}

impl AppResponse {
    pub fn new(entry: AppEntry, address: Address, upvotes: i32, upvoted_by_me: bool) -> Self {
        return Self {
            address,
            app_entry: entry,
            upvotes: upvotes,
            upvoted_by_me,
        };
    }
    pub fn entry(&self) -> AppEntry {
        return self.app_entry.clone();
    }
}

// const ADMIN_AUTHOR: &str = "liza-----------------------------------------------------------------------------AAAIuDJb4M";

pub fn app_definitions() -> ValidatingEntryType {
    entry!(
        name: "app",
        description: "Details of the app",
        sharing: Sharing::Public,
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },

        validation: |_validation_data: hdk::EntryValidationData<AppEntry>| {
            {
                Ok(())
            }
        },

        links: [
            to!(
                "%agent_id",
                link_type: "author_is",

                validation_package: || {
                    hdk::ValidationPackageDefinition::Entry
                },

                validation: |_validation_data: hdk::LinkValidationData| {
                    Ok(())
                }
            ),
            to!(
                "%agent_id",
                link_type: "upvote",

                validation_package: || {
                    hdk::ValidationPackageDefinition::Entry
                },

                validation: |_validation_data: hdk::LinkValidationData| {
                    Ok(())
                }
            ),
            from!(
                "%agent_id",
                link_type: "published",

                validation_package: || {
                    hdk::ValidationPackageDefinition::Entry
                },

                validation: |_validation_data: hdk::LinkValidationData| {
                    Ok(())
                }
            )
        ]
    )
}
