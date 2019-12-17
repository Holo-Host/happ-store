const { one } = require('../config')

const App1 = {
  title: "HoloChat",
  description: "A better Chat",
  thumbnail_url: "/IMG.jpg",
  homepage_url: "home/page",
  dnas: [{
    location: "/dna/url",
    hash: "QmHash",
    handle: "holochat",
  }],
  ui: {
    location: "ui/url",
    hash: "QmHash",
    handle: "holochat",
  }
}

module.exports = (scenario) => {

  scenario('Create an app, add dna+ui bundles and retrieve', async (s, t) => {
    const { liza } = await s.players({liza: one('liza')}, true)

    const create_result = await liza.callSync( "app", "happs", "create_app", App1);
    console.log("Created:",create_result)
    const app_address = create_result.Ok
    t.equal(app_address.length, 46)

    const get_app_result = await liza.call( "app", 'happs', "get_app", {app_hash:app_address})
    console.log(get_app_result)
    const app_details = get_app_result.Ok
    t.equal(app_details.uuid, App1.uuid)

    const get_all_apps_result = await liza.call( "app", 'happs', "get_all_apps", {})
    console.log(get_all_apps_result)
    const all_app_details = get_all_apps_result.Ok
    t.equal(all_app_details.length , 1)

    const upvote_result = await liza.callSync( "app", 'happs', 'upvote_app', {app_address: app_address})
    console.log(upvote_result)
    t.notEqual(upvote_result.Ok, undefined)

    const get_all_apps_result_after_upvote = await liza.call( "app", 'happs', "get_all_apps", {})
    console.log(get_all_apps_result_after_upvote)
    t.equal(get_all_apps_result_after_upvote.Ok[0].upvotes , 1)
    t.equal(get_all_apps_result_after_upvote.Ok[0].upvotedByMe , true)

    const manifest = await liza.callSync( "app", "happs", "generate_manifest", {app_hash:app_address});
    console.log("--> ",manifest.Ok)
    t.ok(manifest.Ok)

    await liza.kill()
  })
}
