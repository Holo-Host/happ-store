use hdk::{
    error::{ZomeApiError, ZomeApiResult},
    holochain_json_api::{error::JsonError, json::JsonString},
    holochain_persistence_api::{cas::content::Address, hash::HashString},
};

use crate::happs::{self};

#[derive(Serialize, Deserialize, Debug, Clone, DefaultJson)]
pub struct Manifest {
    pub instances: Vec<Instances>,
    pub bridges: Vec<Bridges>,
    pub uis: Vec<Uis>,
}

#[derive(Serialize, Deserialize, Debug, Clone, DefaultJson)]
pub struct Instances {
    pub name: String,
    pub id: String,
    pub dna_hash: String,
    pub uri: String,
    pub agent_id: String,
}
impl Instances {
    pub fn new(name: String, id: String, dna_hash: String, uri: String, agent_id: String) -> Self {
        return Self {
            name,
            id,
            dna_hash,
            uri,
            agent_id,
        };
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, DefaultJson)]
pub struct Bridges {
    pub handle: String,
    pub caller_id: String,
    pub callee_id: String
}

impl Bridges {
    pub fn new(handle: String, caller_id: String, callee_id: String) -> Self {
        return Self {
            handle,
            caller_id,
            callee_id,
        };
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, DefaultJson)]
pub struct Uis {
    pub name: String,
    pub id: String,
    pub ui_bundle_hash: String,
    pub uri: String,
    pub instance_references: Vec<InstanceReference>
}
impl Uis {
    pub fn new(name: String, id: String, ui_bundle_hash: String, uri: String, instance_references: Vec<InstanceReference>) -> Self {
        return Self {
            name,
            id,
            ui_bundle_hash,
            uri,
            instance_references,
        };
    }
}
#[derive(Serialize, Deserialize, Debug, Clone, DefaultJson)]
#[serde(rename_all = "camelCase")]
pub struct InstanceReference {
    pub ui_handle: String,
    pub instance_id: String,
}

impl Manifest {
    pub fn new(instances: Vec<Instances>, bridges: Vec<Bridges>, uis: Vec<Uis>) -> Self {
        return Self {
            instances,
            bridges,
            uis,
        };
    }
}

pub fn generate_manifest(app_hash: HashString) -> ZomeApiResult<Manifest>{
    match happs::handlers::handle_get_app(Address::from(app_hash)){
        Ok(app) => {
            let apps: happs::AppResponse= app;
            let app_details: happs::AppEntry = apps.entry();
            let mut instances: Vec<Instances> = [].to_vec();
            let bridges: Vec<Bridges> = [].to_vec();
            let mut uis: Vec<Uis> = [].to_vec();

            for dna in app_details.dnas.iter() {
                instances.push(Instances::new(
                    app_details.title.clone(),
                    dna.handle.clone(),
                    dna.hash.clone().to_string(),
                    dna.location.clone(),
                    "${AGENT_ID}".to_string()
                ));
                uis.push(Uis::new(
                    app_details.title.clone(),
                    app_details.ui.handle.clone(),
                    app_details.ui.hash.clone().to_string(),
                    app_details.ui.location.clone(),
                    [InstanceReference{
                        ui_handle:app_details.ui.handle.clone(),
                        instance_id:  dna.handle.clone(),
                    }].to_vec(),
                ));
            }

            Ok(Manifest::new(instances,bridges,uis))
        }
        Err(_e) => {
            Err(ZomeApiError::Internal("Error: ".to_string()))
        }
    }

}
