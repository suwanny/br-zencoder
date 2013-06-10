/*
  mocha -R spec spec/zencoder_spec
 */


var should      = require("should");
var zenCoder    = require('../index');
var ZencoderJob = require('../index').Job;
var apiKey      = process.env.ZENCODER_KEY;


describe('Zencoder', function(){
  
  var existingJobId = '';

  var sampleJobList = [
    { job: 
       { updated_at: '2013-04-10T17:29:48-05:00',
         created_at: '2013-04-10T17:28:55-05:00',
         finished_at: '2013-04-10T17:29:47-05:00',
         thumbnails: [],
         input_media_file: [],
         state: 'finished',
         submitted_at: '2013-04-10T17:28:55-05:00',
         id: 43239924,
         output_media_files: [],
         pass_through: '38083',
         privacy: true,
         test: true } },
    { job: 
       { updated_at: '2013-04-10T17:26:04-05:00',
         created_at: '2013-04-10T17:24:10-05:00',
         finished_at: '2013-04-10T17:26:04-05:00',
         thumbnails: [],
         input_media_file: [],
         state: 'finished',
         submitted_at: '2013-04-10T17:24:10-05:00',
         id: 43239640,
         output_media_files: [],
         pass_through: '38082',
         privacy: true,
         test: true } } 
  ];

  describe('#create(key)', function(){
    it('should return an Zencoder instance', function(){
      var Zencoder = zenCoder.create(apiKey);
      should.exist(Zencoder.Job);
      should.exist(Zencoder.Input);
      should.exist(Zencoder.Output);
      should.exist(Zencoder.Notification);
      should.exist(Zencoder.Account);
      should.exist(Zencoder.Reports);
    });
  });

  describe("#Job#list", function(){
    it('should return a list of jobs', function(done){
      this.timeout(30000);
      var Zencoder = zenCoder.create(apiKey);
      Zencoder.Job.list(function(err, resp){
        if (err) throw err;
        var body = resp.body;
        resp.code.should.eql(200);
        body.should.be.an.instanceOf(Array);
        console.log("length: " + body.length);
        if (body.length > 0) {
          var item  = body[0];  
          var job   = item.job;
          item.should.have.property('job');
          job.should.have.property('output_media_files');
          job.should.have.property('finished_at');
          job.should.have.property('pass_through');
          job.should.have.property('thumbnails');
          job.should.have.property('privacy');
          job.should.have.property('input_media_file');
          job.should.have.property('id');
          job.should.have.property('test');
          job.should.have.property('state');
          job.should.have.property('submitted_at');
          job.should.have.property('updated_at');
          job.should.have.property('created_at');

          // console.info(job.id);
        }
        
        done();
      });
    });
  });

  describe("#Notification#list", function(){
    it('should return a list of notifications', function(done){
      this.timeout(30000);
      var Zencoder = zenCoder.create(apiKey);
      Zencoder.Notification.list(function(err, resp){
        if (err) throw err;
        var body = resp.body;
        resp.code.should.eql(200);
        // console.info(body);
        body.should.have.property('sent_at');
        body.should.have.property('notifications');
        var notifications = body.notifications;
        console.log("length: " + notifications.length);
        notifications.forEach(function(item){
          item.should.have.property('format');
          item.should.have.property('outputs');
          item.should.have.property('input');
          item.should.have.property('job');
        });
        // console.info(notifications[0]);
        done();
      });
    });
  });

});

describe('ZencoderJob', function(){
  var job = new ZencoderJob(apiKey);

  describe('#list()', function(){
    it('should return a list of jobs', function(done){
      this.timeout(30000);
      job.list(function(err, resp){
        if (err) throw err;
        var body = resp.body;
        resp.code.should.eql(200);
        body.should.be.an.instanceOf(Array);
        console.log("length: " + body.length);
        
        if (body.length > 0) {
          var item  = body[0];  
          var job   = item.job;
          item.should.have.property('job');
          job.should.have.property('output_media_files');
          job.should.have.property('finished_at');
          job.should.have.property('pass_through');
          job.should.have.property('thumbnails');
          job.should.have.property('privacy');
          job.should.have.property('input_media_file');
          job.should.have.property('id');
          job.should.have.property('test');
          job.should.have.property('state');
          job.should.have.property('submitted_at');
          job.should.have.property('updated_at');
          job.should.have.property('created_at');

          // store to use for next tests..
          existingJobId = job.id;
        }
        done();
      });
    });
  });

  

  describe('#listByState()', function(){
    it('should return a list of finished jobs', function(done){
      this.timeout(30000);
      job.listByState('finished', function(err, resp){
        if (err) throw err;
        var body = resp.body;
        resp.code.should.eql(200);
        body.should.be.an.instanceOf(Array);
        console.log("length: " + body.length);

        body.forEach(function(item){
          item.should.have.property('job');

          var job = item.job;
          job.state.should.eql('finished');
          job.should.have.property('output_media_files');
          job.should.have.property('finished_at');
          job.should.have.property('pass_through');
          job.should.have.property('thumbnails');
          job.should.have.property('privacy');
          job.should.have.property('input_media_file');
          job.should.have.property('id');
          job.should.have.property('test');
          job.should.have.property('state');
          job.should.have.property('submitted_at');
          job.should.have.property('updated_at');
          job.should.have.property('created_at');

          // store to use for next tests..
          existingJobId = job.id;
        });
        done();
      });
    }); // it 
  
    it('should return a list of failed jobs', function(done){
      this.timeout(30000);
      job.listByState('failed', function(err, resp){
        if (err) throw err;
        var body = resp.body;
        resp.code.should.eql(200);
        body.should.be.an.instanceOf(Array);
        console.log("length: " + body.length);

        body.forEach(function(item){
          item.should.have.property('job');
          var job = item.job;
          job.state.should.eql('failed');
          job.should.have.property('output_media_files');
          job.should.have.property('finished_at');
          job.should.have.property('pass_through');
          job.should.have.property('thumbnails');
          job.should.have.property('privacy');
          job.should.have.property('input_media_file');
          job.should.have.property('id');
          job.should.have.property('test');
          job.should.have.property('state');
          job.should.have.property('submitted_at');
          job.should.have.property('updated_at');
          job.should.have.property('created_at');
          
          // store to use for next tests..
          existingJobId = job.id;
        });
        done();
      });
    }); // it 

    it('should return a list of waiting jobs', function(done){
      this.timeout(30000);
      job.listByState('waiting', function(err, resp){
        if (err) throw err;
        var body = resp.body;
        resp.code.should.eql(200);
        body.should.be.an.instanceOf(Array);
        console.log("length: " + body.length);

        body.forEach(function(item){
          item.should.have.property('job');
          var job = item.job;
          job.state.should.eql('waiting');
          job.should.have.property('output_media_files');
          job.should.have.property('finished_at');
          job.should.have.property('pass_through');
          job.should.have.property('thumbnails');
          job.should.have.property('privacy');
          job.should.have.property('input_media_file');
          job.should.have.property('id');
          job.should.have.property('test');
          job.should.have.property('state');
          job.should.have.property('submitted_at');
          job.should.have.property('updated_at');
          job.should.have.property('created_at');

          // store to use for next tests..
          existingJobId = job.id;
        });
        done();
      });
    }); // it 

    it('should return a list of pending jobs', function(done){
      this.timeout(30000);
      job.listByState('pending', function(err, resp){
        if (err) throw err;
        var body = resp.body;
        resp.code.should.eql(200);
        body.should.be.an.instanceOf(Array);
        console.log("length: " + body.length);

        body.forEach(function(item){
          item.should.have.property('job');
          var job = item.job;
          job.state.should.eql('pending');
          job.should.have.property('output_media_files');
          job.should.have.property('finished_at');
          job.should.have.property('pass_through');
          job.should.have.property('thumbnails');
          job.should.have.property('privacy');
          job.should.have.property('input_media_file');
          job.should.have.property('id');
          job.should.have.property('test');
          job.should.have.property('state');
          job.should.have.property('submitted_at');
          job.should.have.property('updated_at');
          job.should.have.property('created_at');
          existingJobId = job.id;
        });
        done();
      });
    }); // it 

    it('should return a list of processing jobs', function(done){
      this.timeout(30000);
      job.listByState('processing', function(err, resp){
        if (err) throw err;
        var body = resp.body;
        resp.code.should.eql(200);
        body.should.be.an.instanceOf(Array);
        console.log("length: " + body.length);

        body.forEach(function(item){
          item.should.have.property('job');
          var job = item.job;
          job.state.should.eql('processing');
          job.should.have.property('output_media_files');
          job.should.have.property('finished_at');
          job.should.have.property('pass_through');
          job.should.have.property('thumbnails');
          job.should.have.property('privacy');
          job.should.have.property('input_media_file');
          job.should.have.property('id');
          job.should.have.property('test');
          job.should.have.property('state');
          job.should.have.property('submitted_at');
          job.should.have.property('updated_at');
          job.should.have.property('created_at');
          existingJobId = job.id;
        });
        done();
      });
    }); // it 
  });

  describe('#progress()', function(){
    it('should return the progress of a job', function(done){
      this.timeout(30000);
      job.progress(existingJobId, function(err, resp){
        if (err) throw err;
        var body = resp.body;
        resp.code.should.eql(200);
        body.should.have.property('input');
        body.should.have.property('outputs');
        body.should.have.property('state');
        done();
      });
    });
  });

});




