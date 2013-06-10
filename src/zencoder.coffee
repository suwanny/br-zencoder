

Request     = require 'request'
Url         = require 'url'
_           = require 'lodash'
querystring = require 'querystring'


class Zencoder
  @create: (apiKey) ->
    {
      Job:          new Job(apiKey),
      Input:        new Input(apiKey),
      Output:       new Output(apiKey),
      Notification: new Notification(apiKey),
      Account:      new Account(apiKey),
      Reports:      new Reports(apiKey)
    }

  constructor: (@apiKey, @apiVersion=2) ->
    @base_url         = "https://app.zencoder.com/api/v#{@apiVersion}"
    @api_version      = 2
    @defOptions       = {
      json: true,
      strictSSL:false,
      timeout: 120000, # 2 mins
      headers: { 'Zencoder-Api-Key': @apiKey }
    }

  get: (path, params, callback) ->
    url = @base_url + path
    if typeof params is 'function'
      callback = params
    else
      url += "?" + querystring.stringify(params)      
    Request.get url, @defOptions, (err, res, body) ->
      return callback(err) if err
      callback(err, {code: res.statusCode, body: body})
    
  put: (path, callback) ->
    url = @base_url + path
    Request.put url, @defOptions, (err, res, body) ->
      return callback(err) if err
      callback(err, {code: res.statusCode, body: body})

  post: (path, body, callback) ->
    url = @base_url + path
    body = JSON.stringify(body) unless typeof body is 'string'
    options = _.extend(@defOptions, {body: body})
    Request.post url, options, (err, res, body) ->
      return callback(err) if err
      callback(err, {code: res.statusCode, body: body})
  
  
class Job extends Zencoder
  constructor: (@apiKey, @apiVersion=2) ->
    super(@apiKey, @apiVersion)
  
  list:     (params={}, cb) -> @get '/jobs.json', params, cb
  listByState:  (state, cb) -> @list({state:state}, cb)
  create:       (job, cb)   -> @post '/jobs', job, cb
  details:      (jobId, cb) -> @get "/jobs/#{jobId}.json", cb
  resubmit:     (jobId, cb) -> @put "/jobs/#{jobId}/resubmit.json", cb
  cancel:       (jobId, cb) -> @put "/jobs/#{jobId}/cancel.json", cb
  progress:     (jobId, cb) -> @get "/jobs/#{jobId}/progress.json", cb
    
  
class Input extends Zencoder
  constructor:  (@apiKey, @apiVersion=2) -> super(@apiKey, @apiVersion)
  details:      (inputId, cb) -> @get "/inputs/#{inputId}.json", cb
  progress:     (inputId, cb) -> @get "/inputs/#{inputId}/progress.json", cb

class Output extends Zencoder
  constructor:  (@apiKey, @apiVersion=2) -> super(@apiKey, @apiVersion)
  details:      (outputId, cb) -> @get "/outputs/#{outputId}.json", cb
  progress:     (outputId, cb) -> @get "/outputs/#{outputId}/progress.json", cb

class Notification extends Zencoder
  constructor:  (@apiKey, @apiVersion=2) -> super(@apiKey, @apiVersion)
  list:         (params={}, cb) -> @get '/notifications', params, cb

class Account extends Zencoder
  constructor:  (@apiKey, @apiVersion=2) -> super(@apiKey, @apiVersion)
  create:       (params, cb) -> @post '/account', params, cb
  details:      (cb) -> @get '/account', cb
  integration:  (cb) -> @put '/account/integration', cb
  live:         (cb) -> @put '/account/live', cb
  
class Reports extends Zencoder
  constructor: (@apiKey, @apiVersion=2) -> super(@apiKey, @apiVersion)
  

module.exports              = Zencoder
module.exports.Job          = Job
module.exports.Input        = Input
module.exports.Output       = Output
module.exports.Notification = Notification
module.exports.Account      = Account
module.exports.Reports      = Reports







