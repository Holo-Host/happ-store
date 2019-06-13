use hdk::holochain_core_types::{
    cas::content::Address, dna::entry_types::Sharing, error::HolochainError, hash::HashString,
    json::JsonString,
};
use hdk::{self, entry_definition::ValidatingEntryType};

pub mod handlers;
pub use handlers::get_linked_apps;

#[derive(Serialize, Deserialize, Debug, Clone, DefaultJson)]
pub struct AppUiResource {
    pub location: String,
    pub hash: HashString,
}

#[derive(Serialize, Deserialize, Debug, Clone, DefaultJson)]
pub struct AppDnaResource {
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
    pub dnas: Vec<AppDnaResource>,
    pub ui: Option<AppUiResource>,
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
}

// const ADMIN_AUTHOR: &str = "alice-----------------------------------------------------------------------------AAAIuDJb4M";

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
