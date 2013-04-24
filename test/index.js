var adapter = require('tower-adapter')
  , graph = require('tower-graph') // XXX: remove
  , query = require('tower-query')
  , assert = require('assert')
  , data = require('./data');

var ec2 = require('..')(adapter('ec2'));

describe('ec2 adapter', function(){
  var imageId = 'ami-7539b41c';

  before(function(done){
    ec2.connect(data.aws, function(){
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
    query()
      .use('ec2')
      .select('image')
      //.where('architecture').eq('x86_64')
      .action('find')
      .exec()
      .on('data', function(images){
        console.log(images);
        done();
      });
  });

  describe('certificate (key-pair)', function(){
    it('should list', function(done){
      query()
      .use('ec2')
      .select('certificate')
      .action('find')
      .exec()
      .on('data', function(certificates){
        console.log(certificates);
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