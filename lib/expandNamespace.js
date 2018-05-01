const path           = require( 'path' );
const assert         = require( 'assert' );
const loadNamespaces = require( './loadNamespaces' );

function expandNameSpace( modulePath, callerPath ){

  // find if there are angle brackets there in module path
  const match = /<([^>]+)>/.exec( modulePath );
  if( !( match && match[1] ) ) return modulePath;

  // find if this namespace is defined in namespaces list
  const namespaceKey   = match[1];
  const { namespaces } = loadNamespaces();
  const namespacePath  = namespaces[ namespaceKey ];

  // if namespace is not defined then stop the excution with given message
  assert( namespacePath != null, `namespace <${ namespaceKey }> is not defined.` );

  // replace angle brackets place holder with full path metioned in namespaces list
  const fullModulePath = path.join( process.cwd(), namespacePath, modulePath.substr( match[0].length + 1 ) );
  // create a relative path
  const relativePath   = path.relative( callerPath, fullModulePath );

  // if relative path does not start with '.' then add a './' at the start
  return relativePath.startsWith( '.' )
    ? relativePath
    : `./${ relativePath }`;

}

module.exports = expandNameSpace;
