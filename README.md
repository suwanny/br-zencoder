br-zencoder
===========

Nodejs Zencoder client

## Install

    npm install br-zencoder
    
## How to use

    var ZenCoder = require('br-zencoder');
    var ZencoderJob = ZenCoder.Job;
    var coder = ZenCoder.create(apiKey);
    
    // Job list
    coder.Job.list(function(err, resp){});
    
    // Notification
    coder.Notification.list(function(err, resp){});
    
    // ZencoderJob
    var job = new ZencoderJob(apiKey);
    job.list(function(err, resp){});
    job.listByState('finished', function(err, resp){});
    job.listByState('failed', function(err, resp){});
    job.listByState('waiting', function(err, resp){});
    job.listByState('pending', function(err, resp){});
    job.listByState('processing', function(err, resp){});
    job.progress(existingJobId, function(err, resp){});
    

## License

BSD