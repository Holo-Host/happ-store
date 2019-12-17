const test = require('tape');
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

const App2 = {
  title: "Clutter",
  description: "A better Twiter",
  thumbnail_url: "/IMG.jpg",
  homepage_url: "home/page",
  dnas: [{
    location: "/dna/url",
    hash: "QmHash",
    handle: "clutter",
  }],
  ui: {
    location: "ui/url",
    hash: "QmHash",
    handle: "clutter",
  }
}

module.exports = (scenario) => {

  scenario('add Category ', async (s, t) => {

    const { liza } = await s.players({liza: one('liza')}, true)

    const create_result = await liza.callSync( "app", "happs", "create_app", App1);
    console.log(create_result)
    const app_address = create_result.Ok
    t.equal(app_address.length, 46)

    const create_result2 = await liza.callSync( "app", "happs", "create_app", App2);
    console.log(create_result2)
    const app_address2 = create_result2.Ok
    t.equal(app_address2.length, 46)

    const result1 = await liza.callSync( "app", "happs", "add_app_to_category", {app_address: app_address, category: "good apps"})
    console.log(result1)
    t.equal(result1.Ok, null)

    const result2 = await liza.callSync( "app", "happs", "add_app_to_category", {app_address: app_address2, category: "good apps"})
    console.log(result2)
    t.equal(result2.Ok, null)

    const result3 = await liza.callSync( "app", "happs", "get_apps_by_category", {category:"good apps"})
    console.log(result3)
    t.equal(result3.Ok.length, 2)

    await liza.kill()
  })
}
