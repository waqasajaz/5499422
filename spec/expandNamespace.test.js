const proxyquire = require( 'proxyquire' );

describe( 'The ./lib/expandNamespaces function', ()=>{

  it( 'should keep paths without namespaces unchanged', ()=>{

    const expandNamespaces = proxyquire( '../lib/expandNamespace', {
      './loadNamespaces': sinon.stub()
    } );

    const expected = './somePath';
    const actual   = expandNamespaces( expected );

    expect( actual ).to.equal( actual );

  } );

  it( 'should throw an error if the namespace does not exist', ()=>{

    const expandNamespaces = proxyquire( '../lib/expandNamespace', {
      './loadNamespaces': sinon.stub().returns( { namespaces: {} } )
    } );
    
    expect( ()=>{

      expandNamespaces( '<myNameSpace>./PathToSomewhere' ); 
    
    } ).to.throw( 'namespace <myNameSpace> is not defined.' );

  } );

  it( 'should replace namespace placeholder with correct path ', ()=>{

    const expandNamespaces = proxyquire( '../lib/expandNamespace', {
      './loadNamespaces': sinon.stub().returns( { namespaces: { myNameSpace: './pathToMyNameSpace' } } )
    } );

    const callerPath = './myProjectPath';
    const actual     = expandNamespaces( '<myNameSpace>./pathToSomewhere', callerPath );

    expect( actual ).to.equal( '../pathToMyNameSpace/pathToSomewhere' );

  } );

  it( 'should resolve modules relative to calling directory', ()=>{

    const expandNamespaces = proxyquire( '../lib/expandNamespace', {
      './loadNamespaces': sinon.stub().returns( { namespaces: { myNameSpace: '../myNameSpace' } } )
    } );

    const callerPath = './myProjectPath/nextFolder';
    const actual     = expandNamespaces( '<myNameSpace>./pathToSomewhere', callerPath );
    
    expect( actual ).to.equal( '../../../myNameSpace/pathToSomewhere' );
  
  } );

  it( '[Bug] should not convert absolute caller path to relative path', ()=>{

    const expandNamespaces = proxyquire( '../lib/expandNamespace', {
      './loadNamespaces': sinon.stub().returns( { namespaces: { myNameSpace: './pathToMyNameSpace' } } )
    } );
    const callerPath       = '/Users/user-name/apps/ut_quiz-master';
    const actual           = expandNamespaces( '<myNameSpace>./pathToSomewhere', callerPath );

    expect( actual ).to.not.equal( './pathToMyNameSpace/pathToSomewhere' );
  
  } );


} );
