const fetch = require('isomorphic-fetch')
const url = process.env.REACT_APP_API
const toJSON = res => res.json()

const data = function () {
  const list = model => fetch(`${url}/${model}`).then(toJSON)
  const get = (model, id) => fetch(`${url}/${model}/${id}`).then(toJSON)
  const post = (model, doc) => fetch(`${url}/${model}`, {
    method: "post",
    body: JSON.stringify(doc),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(toJSON)

  const put = (model, id, doc) => fetch(`${url}/${model}/${id}`, {
    method: "PUT",
    body: JSON.stringify(doc),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(toJSON)

  const remove = (model, id, doc) => fetch(`${url}/${model}/${id}`, {
    method: "DELETE",
    body: JSON.stringify(doc)
  }).then(toJSON)

  return {
    list,
    get,
    post,
    put,
    remove
    //,
    //query,
    //subscribe
  }
}

module.exports = data
