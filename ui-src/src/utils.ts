/* Test CONSTS: */
// github: UI URL: https://github.com/Holo-Host/holofuel-gui/releases/download/0.1.0/holofuel-gui-v0.1.0.zip
// github link >> DNAURL: https://github.com/Holo-Host/holofuel/releases/download/v0.8.2-alpha/holofuel.dna.json
// QmSN2JqK2YTsPU1JR6xMDDghr7gKvV2ieQjfyH2uJUFFPQ


// website: holofuel6example.org
// domain: holofuel6example.holohost.net
// uiUrl:`http://localhost:5555/holofuel/ui.zip`
// uiHash: `QMhfFakeHash`
// dnaUrl: `http://localhost:5555/holofuel/dist/holofuel.dna.json`
// dnaHash: HCv15: QmWDzwJ2EDTY6nsmYrHYfgzQ3vsj49xxVoEez8JLPTaviN // OLD: `QmUrd3q8fF71VM3eA1mSEhcEzRsAiE8XiLnMZXBW6omHdV`
// hCLient agent_id = HcScIk8YYA4M39b7zsX9VCYzkAOett3i9v98krbi55JMf8kju9VSxaG3Myzw8bz

// ======================================
//      Type and Action Imports
// ======================================
import { Hash } from '../../holochain'
import store from './store'
import axios from 'axios'

import * as express from 'express'
import * as multer from 'multer'
import * as fs from 'fs'
import * as path from 'path'

// ========================
//      UI Constants
// ========================
export const ICON_SIZE = "100px";
export const URL = `ws://localhost:3400`

// ========================
//        API CALLS
// ========================
export const fetchPOST = (url: string, data?: any, extraPayload?: any): Promise<any> => {
  extraPayload = extraPayload || {}
  return fetch(url, {
    ...extraPayload,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
  }).then(r => r.json())
}

export const fetchFormPOST = (url: string, data?: any, extraPayload?: any): Promise<any> => {
  extraPayload = extraPayload || {}
  return fetch(url, {
    ...extraPayload,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
  }).then(r => r.json())
}
