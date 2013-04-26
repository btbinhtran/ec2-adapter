var adapter = require('tower-adapter')
  , model = require('tower-model')
  , query = require('tower-query')
  , assert = require('assert')
  , data = require('./data');

adapter.model = model.ns('ec2');

var ec2 = require('..')();

describe('ec2 adapter', function(){
  var imageId = 'ami-7539b41c';

  before(function(done){
    adapter('ec2').connect(data.aws, function(){
      done();
    });
  });

  it('should create/remove instances', function(done){
    query().use('ec2').select('instance').action('find').exec().on('data', function(instances){
      query()
        .use('ec2')
        .select('instance')
        // .where('id').in(ids)
        .action('remove', instances)
        .exec()
        .on('data', function(instances){
          query()
            .use('ec2')
            .select('instance')
            .action('create', [{ imageId: imageId, key: 'x' }])
            .exec()
            .on('data', function(newInstances){
              console.log(newInstances);
              done();
            });
      });
    });
  });

  it('should list images', function(done){
    ec2('image')
      .where('architecture').eq('x86_64')
      .where('imageId').eq(imageId)
      .action('find')
      .exec(function(err, images){
        console.log(images);
        done();
      });
  });

  describe('key (key-pair)', function(){
    it('should list', function(done){
      ec2('key')
        .use('ec2')
        //.find()
        .action('find')
        .exec(function(err, keys){
          done();
        });
    });

    it('should create', function(done){
      query()
      .use('ec2')
      .select('certificate')
      .action('create', [{ name: 'viatropos2' }])
      .exec()
      .on('data', function(certificates){
        done();
      });
    });
  });
});